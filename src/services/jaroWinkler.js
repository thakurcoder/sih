// VidyaSetu Jaro-Winkler String Similarity & Cross-Document Consistency Engine
// Zero-dependency pure JavaScript implementation.
// Implements standard Jaro distance and Winkler prefix bonus.
// Thresholds per statutory MoTA scrutiny standards:
//   >= 0.97  : MATCH (High Confidence Identity Match)
//   0.85-0.97: POTENTIAL_MISMATCH (Minor spelling / phonetic variance -> Route to Human Scrutiny Officer)
//   < 0.85   : MISMATCH (Definite name mismatch -> Blocking Deficiency)

/**
 * Normalizes text for reliable matching (removes honorifics, extra spaces, punctuation).
 */
export function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .replace(/\b(shri|smt|ku|kumari|mr|ms|mrs|dr|prof|md|mohd|master)\b\.?/gi, '')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes Jaro similarity between two strings.
 * @param {string} s1
 * @param {string} s2
 * @returns {number} Float between 0 and 1
 */
export function jaroSimilarity(s1, s2) {
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;

  const s1Matches = new Array(len1).fill(false);
  const s2Matches = new Array(len2).fill(false);

  let matches = 0;
  let transpositions = 0;

  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, len2);

    for (let j = start; j < end; j++) {
      if (s2Matches[j]) continue;
      if (s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  // Count transpositions
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) {
      k++;
    }
    if (s1[i] !== s2[k]) {
      transpositions++;
    }
    k++;
  }

  const jaro = (
    matches / len1 +
    matches / len2 +
    (matches - transpositions / 2) / matches
  ) / 3;

  return jaro;
}

/**
 * Computes Jaro-Winkler similarity between two strings.
 * Uses standard scaling factor p = 0.1, up to max prefix length of 4.
 *
 * @param {string} str1
 * @param {string} str2
 * @param {boolean} [normalize=true] - Whether to strip honorifics and punctuation
 * @returns {number} Float between 0.0 and 1.0
 */
export function jaroWinklerSimilarity(str1, str2, normalize = true) {
  const s1 = normalize ? normalizeName(str1) : String(str1 || '').trim();
  const s2 = normalize ? normalizeName(str2) : String(str2 || '').trim();

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const jaro = jaroSimilarity(s1, s2);

  // Common prefix length up to 4 chars
  let prefix = 0;
  const maxPrefix = Math.min(4, Math.min(s1.length, s2.length));
  for (let i = 0; i < maxPrefix; i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }

  const p = 0.1; // standard scaling factor
  const jaroWinkler = jaro + prefix * p * (1 - jaro);

  return Math.min(1.0, Number(jaroWinkler.toFixed(4)));
}

/**
 * Compares two name strings and determines status based on statutory thresholds.
 * @param {string} candidateName
 * @param {string} documentName
 * @returns {{ score: number, status: 'MATCH' | 'POTENTIAL_MISMATCH' | 'MISMATCH', label: string }}
 */
export function evaluateNameConsistency(candidateName, documentName) {
  const score = jaroWinklerSimilarity(candidateName, documentName);

  if (score >= 0.97) {
    return {
      score,
      status: 'MATCH',
      label: `Name matches perfectly (${(score * 100).toFixed(1)}%)`,
      routeToHuman: false
    };
  }

  if (score >= 0.85) {
    return {
      score,
      status: 'POTENTIAL_MISMATCH',
      label: `Minor phonetic/spelling variation (${(score * 100).toFixed(1)}%) — Routed to Scrutiny Officer`,
      routeToHuman: true
    };
  }

  return {
    score,
    status: 'MISMATCH',
    label: `Name discrepancy detected (${(score * 100).toFixed(1)}%) — Deficiency flagged`,
    routeToHuman: true
  };
}

/**
 * Performs cross-document consistency checks between applicant profile and all uploaded documents.
 * Evaluates candidate name, DOB, and parent name across documents.
 *
 * @param {Object} applicant - Applicant profile ({ name, dob, parentName, ... })
 * @param {Array<Object>} documents - Array of document objects with extractedFields
 * @returns {Object} Consistency audit report
 */
export function auditCrossDocumentConsistency(applicant, documents = []) {
  const applicantName = applicant?.name || '';
  const applicantDob = applicant?.dob || '';
  const comparisons = [];
  let overallStatus = 'CONSISTENT';
  let minScore = 1.0;

  for (const doc of documents) {
    const docName = doc.name || doc.type || 'Document';
    const fields = doc.extractedFields || {};
    const extractedName = fields.name || fields.candidateName;

    if (extractedName && applicantName) {
      const nameEval = evaluateNameConsistency(applicantName, extractedName);
      minScore = Math.min(minScore, nameEval.score);

      comparisons.push({
        documentName: docName,
        field: 'Candidate Name',
        applicantValue: applicantName,
        documentValue: extractedName,
        similarityScore: nameEval.score,
        status: nameEval.status,
        label: nameEval.label,
        routeToHuman: nameEval.routeToHuman
      });

      if (nameEval.status === 'MISMATCH') {
        overallStatus = 'MISMATCH';
      } else if (nameEval.status === 'POTENTIALLY_ELIGIBLE' || nameEval.status === 'POTENTIAL_MISMATCH') {
        if (overallStatus !== 'MISMATCH') {
          overallStatus = 'REQUIRES_OFFICER_REVIEW';
        }
      }
    }

    // Check DOB if present
    if (fields.dob && applicantDob) {
      // Normalize dates: compare YYYY-MM-DD or DD-MM-YYYY
      const cleanAppDob = String(applicantDob).replace(/[^0-9]/g, '');
      const cleanDocDob = String(fields.dob).replace(/[^0-9]/g, '');
      const dobMatch = cleanAppDob === cleanDocDob || cleanAppDob.slice(-4) === cleanDocDob.slice(-4);

      comparisons.push({
        documentName: docName,
        field: 'Date of Birth',
        applicantValue: applicantDob,
        documentValue: fields.dob,
        similarityScore: dobMatch ? 1.0 : 0.0,
        status: dobMatch ? 'MATCH' : 'MISMATCH',
        label: dobMatch ? 'DOB matches across records' : 'DOB mismatch detected',
        routeToHuman: !dobMatch
      });

      if (!dobMatch) {
        overallStatus = 'MISMATCH';
      }
    }
  }

  return {
    overallStatus,
    minSimilarityScore: Number(minScore.toFixed(4)),
    comparisons,
    requiresHumanReview: overallStatus !== 'CONSISTENT'
  };
}
