// VidyaSetu Automated Deficiency Generator & Document Completeness Engine
// Translates failed validations, document expiration, missing required documents,
// and identity mismatches into structured statutory action notices with 15-day resolution SLAs.
// Supports multiple deficiencies per application.

/**
 * Calculates a future deadline ISO date string.
 * @param {number} days - Number of days from today (default: 15 days)
 * @returns {string} YYYY-MM-DD
 */
export function calculateDeadline(days = 15) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Checks completeness of uploaded documents against scheme's requiredDocuments.
 * @param {Array<Object>} uploadedDocs - Uploaded document objects (with .type or .name)
 * @param {Array<Object>} requiredDocs - Scheme's requiredDocuments array
 * @returns {{ isComplete: boolean, missingDocs: Array<Object>, presentDocs: Array<Object> }}
 */
export function checkDocumentCompleteness(uploadedDocs = [], requiredDocs = []) {
  const uploadedTypes = new Set(
    uploadedDocs.map(d => (d.type || d.documentType || '').toLowerCase().trim())
  );

  const missingDocs = [];
  const presentDocs = [];

  for (const req of requiredDocs) {
    const reqType = (typeof req === 'string' ? req : req.type || req.label || '').toLowerCase().trim();
    const isMandatory = typeof req === 'string' ? true : Boolean(req.mandatory !== false);

    // Check if any uploaded document matches this type or label keyword
    const matched = uploadedDocs.some(u => {
      const uType = (u.type || u.documentType || '').toLowerCase();
      const uName = (u.name || '').toLowerCase();
      return uType === reqType || uName.includes(reqType) || reqType.includes(uType);
    });

    if (matched) {
      presentDocs.push(req);
    } else if (isMandatory) {
      missingDocs.push(req);
    }
  }

  return {
    isComplete: missingDocs.length === 0,
    missingDocs,
    presentDocs,
    missingCount: missingDocs.length,
    presentCount: presentDocs.length,
    totalRequiredCount: requiredDocs.length
  };
}

/**
 * Generates structured deficiencies from:
 * 1. Completeness checks (missing mandatory documents)
 * 2. Document validity checks (expired certificate, bad FY)
 * 3. Cross-document consistency checks (name/DOB mismatches)
 * 4. OCR quality checks (low confidence scan)
 * 5. Rule engine blocking failures
 *
 * @param {Object} params
 * @param {Array<Object>} params.documents - Uploaded documents with analysis results
 * @param {Object} params.scheme - Scheme definition with requiredDocuments and rules
 * @param {Object} [params.consistencyReport] - Result from auditCrossDocumentConsistency
 * @param {Object} [params.ruleEvaluation] - Result from SchemeRuleEngine.evaluate
 * @returns {Array<Object>} Structured deficiencies
 */
export function generateDeficiencies({
  documents = [],
  scheme,
  consistencyReport = null,
  ruleEvaluation = null
}) {
  const deficiencies = [];
  const today = new Date().toISOString().split('T')[0];
  const deadline = calculateDeadline(15);

  // 1. Missing mandatory documents check
  if (scheme?.requiredDocuments) {
    const completeness = checkDocumentCompleteness(documents, scheme.requiredDocuments);
    for (const missing of completeness.missingDocs) {
      const label = missing.label || missing.type || 'Mandatory Certificate';
      deficiencies.push({
        code: `DEF-MISSING-${(missing.type || 'DOC').toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
        title: `Missing Required Document: ${label}`,
        description: `Scheme guidelines require a valid ${label} before verification can proceed.`,
        actionRequired: `Upload a clear, attested copy of ${label} (${(missing.issuingAuthorities || ['Competent Authority']).join(', ')}).`,
        severity: 'BLOCKING',
        field: missing.type || 'document',
        raisedOn: today,
        deadline,
        officerRemarks: `Please provide official ${label} to complete your case file.`
      });
    }
  }

  // 2. Document validity & scan quality checks
  for (const doc of documents) {
    const fields = doc.extractedFields || {};
    const docName = doc.name || doc.label || 'Document';

    // Expired Income Certificate Check (FY 2026-27 statutory mandate)
    if (doc.type === 'income_certificate' || docName.toLowerCase().includes('income')) {
      const issueDateStr = fields.issueDate || doc.issueDate || '';
      const text = (doc.extractedText || '').toLowerCase();
      
      const isExpired = 
        issueDateStr.includes('2023') || 
        issueDateStr.includes('2024') || 
        issueDateStr.includes('2022') ||
        issueDateStr.includes('EXPIRED') ||
        text.includes('expired') ||
        text.includes('validity has lapsed') ||
        (!text.includes('2026') && !text.includes('2027') && !issueDateStr.includes('2026') && !issueDateStr.includes('2027'));

      if (isExpired) {
        deficiencies.push({
          code: 'DEF-INC-EXPIRED',
          title: 'Income Certificate Validity Lapsed (> 1 Fiscal Year Old)',
          description: `The uploaded Income Certificate (${issueDateStr || 'prior date'}) was issued for a prior financial year. MoTA statutory guidelines require family income to be certified for ongoing FY 2026-27.`,
          actionRequired: 'Upload a valid Income Certificate for FY 2026-27 issued by Tehsildar / SDO.',
          severity: 'BLOCKING',
          field: 'income_certificate',
          raisedOn: today,
          deadline,
          officerRemarks: 'Income certificate must reflect ongoing financial year (FY 2026-27) with digital seal or barcode.'
        });
      }
    }

    // Low OCR Confidence Scan Quality
    const confidence = Number(doc.confidence || doc.ocrConfidence || 100);
    if (confidence < 80) {
      deficiencies.push({
        code: 'DEF-DOC-LOW-QUALITY',
        title: `Low Legibility Document: ${docName}`,
        description: `OCR scan confidence for ${docName} is low (${confidence.toFixed(1)}%). Essential credentials cannot be deterministically verified.`,
        actionRequired: 'Re-upload a high-resolution, unblurred scan or PDF (minimum 200 DPI).',
        severity: 'ATTENTION',
        field: doc.type || 'document',
        raisedOn: today,
        deadline,
        officerRemarks: 'Document scan appears blurred or cropped. Please upload a clear digital scan.'
      });
    }
  }

  // 3. Cross-Document Identity Mismatches
  if (consistencyReport?.comparisons) {
    for (const comp of consistencyReport.comparisons) {
      if (comp.status === 'MISMATCH') {
        deficiencies.push({
          code: 'DEF-NAME-MISMATCH',
          title: `Identity Discrepancy: ${comp.field} Mismatch`,
          description: `Applicant ${comp.field} ("${comp.applicantValue}") does not match record in ${comp.documentName} ("${comp.documentValue}"). Jaro-Winkler similarity: ${(comp.similarityScore * 100).toFixed(1)}%.`,
          actionRequired: 'Upload supporting Gazette notification, marriage affidavit, or corrected certificate matching Aadhaar credentials.',
          severity: 'BLOCKING',
          field: comp.field,
          raisedOn: today,
          deadline,
          officerRemarks: `Discrepancy in ${comp.field} between form and ${comp.documentName}. Clarification required.`
        });
      } else if (comp.status === 'POTENTIAL_MISMATCH') {
        deficiencies.push({
          code: 'DEF-NAME-SIMILARITY',
          title: `Minor Name Spelling Variation: ${comp.documentName}`,
          description: `Slight spelling or phonetic variation detected in ${comp.documentName} ("${comp.documentValue}" vs "${comp.applicantValue}"). Similarity: ${(comp.similarityScore * 100).toFixed(1)}%.`,
          actionRequired: 'Confirm identity consistency. Case routed to Ministry Scrutiny Officer for human-in-the-loop review.',
          severity: 'ATTENTION',
          field: comp.field,
          raisedOn: today,
          deadline,
          officerRemarks: 'Minor spelling variation noted. Officer review required before final clearance.'
        });
      }
    }
  }

  // 4. Rule Engine Blocking Failures
  if (ruleEvaluation?.checks) {
    const blockingFails = ruleEvaluation.checks.filter(c => c.severity === 'BLOCKING' && !c.passed);
    for (const fail of blockingFails) {
      // Don't duplicate if already added
      const code = `DEF-RULE-${(fail.id || 'REQ').toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
      if (!deficiencies.some(d => d.code === code)) {
        deficiencies.push({
          code,
          title: `Eligibility Criterion Not Met: ${fail.criterion}`,
          description: `${fail.statutoryRule} Required: ${fail.required}; Actual: ${fail.actual}.`,
          actionRequired: `Verify whether credentials satisfy statutory clause under ${fail.source}.`,
          severity: 'BLOCKING',
          field: fail.id,
          raisedOn: today,
          deadline,
          officerRemarks: `Criterion "${fail.criterion}" not met under scheme guidelines.`
        });
      }
    }
  }

  return deficiencies;
}
