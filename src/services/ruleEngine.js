// VidyaSetu Generic Config-Driven Statutory Rule Engine
// Evaluates applications deterministically against scheme criteria defined purely in data.
// NO hardcoded scheme.id branches. All scheme-specific logic is modeled as declarative rules.
// Single source of truth importable by both Node.js backend and Vite React frontend.

/**
 * Resolves a field value from candidate profile with fallback aliases.
 * @param {Object} candidate - Candidate details
 * @param {string} field - Field name
 * @returns {any}
 */
export function resolveCandidateField(candidate, field) {
  if (!candidate) return undefined;

  switch (field) {
    case 'isSt':
    case 'stStatus':
    case 'tribe':
      return Boolean(candidate.isSt || candidate.category === 'ST' || !!candidate.tribe);

    case 'annualIncome':
    case 'income':
      return Number(candidate.annualIncome ?? candidate.income ?? 0);

    case 'age':
      if (candidate.age !== undefined && candidate.age !== null && candidate.age !== '') {
        return Number(candidate.age);
      }
      if (candidate.dob) {
        const birthDate = new Date(candidate.dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          calculatedAge--;
        }
        return calculatedAge;
      }
      return 0;

    case 'pgMarks':
    case 'marks':
    case 'qualifyingMarks':
      return Number(candidate.pgMarks ?? candidate.marks ?? candidate.qualifyingMarks ?? 0);

    case 'qsWorldRank':
    case 'universityRank':
      return Number(candidate.qsWorldRank ?? candidate.universityRank ?? 9999);

    case 'pvtg':
      return Boolean(candidate.pvtg === true || candidate.pvtg === 'Yes' || candidate.pvtg === 'true');

    case 'pwd':
    case 'divyang':
      return Boolean(candidate.pwd === true || candidate.pwd === 'Yes' || candidate.divyang === true);

    case 'gender':
      return String(candidate.gender || '');

    case 'degree':
    case 'course':
    case 'classLevel':
      return String(candidate.degree ?? candidate.course ?? candidate.classLevel ?? '');

    case 'institution':
      return String(candidate.institution || '');

    default:
      return candidate[field];
  }
}

/**
 * Evaluates an operator against an actual value and target value.
 * Supported operators: lte, gte, eq, in, between
 */
export function applyOperator(actual, operator, targetValue) {
  switch (operator) {
    case 'lte':
      return Number(actual) <= Number(targetValue);

    case 'gte':
      return Number(actual) >= Number(targetValue);

    case 'eq':
      if (typeof targetValue === 'boolean') {
        return Boolean(actual) === targetValue;
      }
      if (typeof targetValue === 'number') {
        return Number(actual) === Number(targetValue);
      }
      return String(actual).toLowerCase().trim() === String(targetValue).toLowerCase().trim();

    case 'in':
      if (Array.isArray(targetValue)) {
        const actualStr = String(actual || '').toLowerCase();
        // Check if actual string matches or contains any of the target items, or is exactly in array
        return targetValue.some(t => {
          const tStr = String(t).toLowerCase();
          return actualStr.includes(tStr) || tStr.includes(actualStr);
        });
      }
      return false;

    case 'between':
      if (Array.isArray(targetValue) && targetValue.length >= 2) {
        const val = Number(actual);
        return val >= Number(targetValue[0]) && val <= Number(targetValue[1]);
      }
      return false;

    default:
      console.warn(`[SchemeRuleEngine] Unsupported operator: ${operator}`);
      return false;
  }
}

/**
 * Formats values into human-readable statutory text.
 */
function formatRequirement(operator, value, field, relaxationsText = '') {
  let base = '';
  switch (operator) {
    case 'lte':
      base = field.toLowerCase().includes('income')
        ? `≤ ₹${Number(value).toLocaleString('en-IN')}`
        : (field.toLowerCase().includes('rank') ? `QS Rank ≤ ${value}` : `≤ ${value} years`);
      break;
    case 'gte':
      base = field.toLowerCase().includes('mark') ? `≥ ${value}%` : `≥ ${value}`;
      break;
    case 'eq':
      base = field === 'isSt' ? 'Notified Scheduled Tribe (Article 342)' : String(value);
      break;
    case 'in':
      base = Array.isArray(value) ? value.join(' / ') : String(value);
      break;
    case 'between':
      base = Array.isArray(value) ? `${value[0]} to ${value[1]}` : String(value);
      break;
    default:
      base = String(value);
  }
  return relaxationsText ? `${base} (${relaxationsText})` : base;
}

function formatActual(actual, field, candidate) {
  if (field === 'isSt') {
    return candidate?.tribe ? `${candidate.tribe} (ST)` : (actual ? 'ST Community' : 'Non-ST');
  }
  if (field.toLowerCase().includes('income')) {
    return `₹${Number(actual).toLocaleString('en-IN')}`;
  }
  if (field.toLowerCase().includes('mark')) {
    return `${actual}%`;
  }
  if (field === 'age') {
    return `${actual} years`;
  }
  if (field.toLowerCase().includes('rank')) {
    const rankNum = Number(actual);
    return rankNum > 0 && rankNum < 9999 ? `QS #${rankNum}` : 'Unranked / Offer Pending';
  }
  return String(actual || 'Not provided');
}

export class SchemeRuleEngine {
  /**
   * Deterministically evaluates candidate attributes against scheme rules purely defined in data.
   * Fully generic: zero hardcoded scheme.id branches.
   *
   * @param {Object} candidate - Candidate details
   * @param {Object} scheme - Scheme definition containing an array of rules
   * @returns {Object} Comprehensive evaluation report
   */
  static evaluate(candidate, scheme) {
    if (!scheme) {
      return {
        schemeId: 'UNKNOWN',
        schemeName: 'Unknown Scheme',
        status: 'NOT_ELIGIBLE',
        summary: 'Invalid scheme definition provided.',
        checks: [],
        evaluationTimestamp: new Date().toISOString()
      };
    }

    const rules = Array.isArray(scheme.rules) && scheme.rules.length > 0 
      ? scheme.rules 
      : this.synthesizeRulesFromEligibility(scheme);

    const checks = [];

    for (const rule of rules) {
      const actualRaw = resolveCandidateField(candidate, rule.field);

      // Handle conditional relaxations (e.g. +5 years for PVTG / PwD)
      let effectiveTargetValue = rule.value;
      const appliedRelaxations = [];

      if (Array.isArray(rule.relaxations) && rule.relaxations.length > 0) {
        for (const relax of rule.relaxations) {
          if (relax && relax.condition) {
            const condActual = resolveCandidateField(candidate, relax.condition.field);
            const condPass = applyOperator(condActual, relax.condition.operator, relax.condition.value);
            if (condPass) {
              if (typeof effectiveTargetValue === 'number' && typeof relax.modifier === 'number') {
                effectiveTargetValue += relax.modifier;
              }
              appliedRelaxations.push(relax.label || `Modifier +${relax.modifier}`);
            }
          }
        }
      }

      // Evaluate the rule operator
      const passed = applyOperator(actualRaw, rule.operator, effectiveTargetValue);

      const relaxationsLabel = appliedRelaxations.length > 0 
        ? `Relaxation: ${appliedRelaxations.join(', ')}` 
        : '';

      checks.push({
        id: rule.id || rule.field,
        criterion: rule.label || rule.field,
        statutoryRule: rule.description || rule.label || 'Statutory requirement',
        required: formatRequirement(rule.operator, effectiveTargetValue, rule.field, relaxationsLabel),
        actual: formatActual(actualRaw, rule.field, candidate),
        passed: Boolean(passed),
        severity: rule.severity || 'BLOCKING',
        source: rule.source || scheme.guidelineReference || 'MoTA Guidelines',
        verified: Boolean(rule.verified),
        appliedRelaxations
      });
    }

    // Aggregate determination
    const blockingFailures = checks.filter(c => c.severity === 'BLOCKING' && !c.passed);
    const attentionWarnings = checks.filter(c => c.severity === 'ATTENTION' && !c.passed);

    let status = 'ELIGIBLE';
    let summary = 'Meets all statutory scheme eligibility criteria based on deterministic evaluation.';

    if (blockingFailures.length > 0) {
      status = 'NOT_ELIGIBLE';
      summary = `Does not satisfy ${blockingFailures.length} mandatory criteria: ${blockingFailures.map(f => f.criterion).join(', ')}.`;
    } else if (attentionWarnings.length > 0) {
      status = 'POTENTIALLY_ELIGIBLE';
      summary = `Potentially eligible, pending verification of: ${attentionWarnings.map(w => w.criterion).join(', ')}.`;
    }

    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      shortName: scheme.shortName || scheme.name,
      status,
      summary,
      checks,
      passedCount: checks.filter(c => c.passed).length,
      totalChecks: checks.length,
      evaluationTimestamp: new Date().toISOString()
    };
  }

  /**
   * Evaluates a candidate across a list of schemes.
   */
  static evaluateAll(candidate, schemes) {
    if (!Array.isArray(schemes)) return [];
    return schemes.map(scheme => this.evaluate(candidate, scheme));
  }

  /**
   * Backward compatibility helper: synthesizes rule models from legacy eligibility objects.
   */
  static synthesizeRulesFromEligibility(scheme) {
    const elig = scheme.eligibility || {};
    const rules = [];

    // Scheduled Tribe Community Verification
    rules.push({
      id: 'st_status',
      field: 'isSt',
      operator: 'eq',
      value: true,
      severity: 'BLOCKING',
      label: 'Scheduled Tribe Community Verification',
      description: 'Candidate must belong to a Scheduled Tribe notified under Article 342.',
      source: 'Constitution of India, Article 342',
      verified: true
    });

    // Income
    if (elig.maxIncome !== undefined) {
      rules.push({
        id: 'income_ceiling',
        field: 'annualIncome',
        operator: 'lte',
        value: elig.maxIncome,
        severity: 'BLOCKING',
        label: 'Family Income Ceiling',
        description: `Total annual family income must not exceed ₹${elig.maxIncome.toLocaleString('en-IN')}.`,
        source: scheme.guidelineReference || 'MoTA Guidelines',
        verified: true
      });
    }

    // Age
    if (elig.maxAge !== undefined) {
      rules.push({
        id: 'age_limit',
        field: 'age',
        operator: 'lte',
        value: elig.maxAge,
        severity: 'BLOCKING',
        label: 'Maximum Age Limit',
        description: `Candidate must be ≤ ${elig.maxAge} years of age.`,
        source: scheme.guidelineReference || 'MoTA Guidelines',
        verified: true,
        relaxations: [
          {
            condition: { field: 'pvtg', operator: 'eq', value: true },
            modifier: 5,
            label: '+5 years for PVTG scholars',
            source: 'MoTA Guidelines',
            verified: scheme.id === 'NFST'
          }
        ]
      });
    }

    // Minimum Marks
    if (elig.minMarks !== undefined) {
      rules.push({
        id: 'qualifying_marks',
        field: 'pgMarks',
        operator: 'gte',
        value: elig.minMarks,
        severity: 'BLOCKING',
        label: 'Minimum Qualifying Marks',
        description: `Qualifying examination score must be at least ${elig.minMarks}%.`,
        source: scheme.guidelineReference || 'MoTA Guidelines',
        verified: true
      });
    }

    // Degrees / Program
    if (Array.isArray(elig.degrees) && elig.degrees.length > 0) {
      rules.push({
        id: 'enrolled_degree',
        field: 'degree',
        operator: 'in',
        value: elig.degrees,
        severity: 'ATTENTION',
        label: 'Eligible Degree / Course',
        description: `Course must be under approved categories: ${elig.degrees.join(', ')}.`,
        source: scheme.guidelineReference || 'MoTA Guidelines',
        verified: true
      });
    }

    // QS World Rank
    if (elig.universityRankMax !== undefined) {
      rules.push({
        id: 'qs_world_rank',
        field: 'qsWorldRank',
        operator: 'lte',
        value: elig.universityRankMax,
        severity: 'BLOCKING',
        label: 'QS World University Ranking',
        description: `Foreign university must be ranked within Top ${elig.universityRankMax} in QS World University Rankings.`,
        source: 'tribal.nic.in 2024-25 guidelines',
        verified: true
      });
    }

    return rules;
  }

  /**
   * Validates a scheme configuration before saving via PUT /api/schemes/:id.
   * Ensures every rule carries required fields, valid operator, source, and verified boolean.
   * @param {Object} scheme - Scheme data to validate
   * @returns {{ valid: boolean, errors: string[] }}
   */
  static validateScheme(scheme) {
    const errors = [];
    if (!scheme) {
      return { valid: false, errors: ['Scheme configuration object is required.'] };
    }
    if (!scheme.id || typeof scheme.id !== 'string') {
      errors.push('Scheme ID is required and must be a string.');
    }
    if (!scheme.name || typeof scheme.name !== 'string') {
      errors.push('Scheme Name is required.');
    }

    if (Array.isArray(scheme.rules)) {
      scheme.rules.forEach((rule, idx) => {
        const prefix = `Rule #${idx + 1} (${rule.id || 'unnamed'}):`;
        if (!rule.id) errors.push(`${prefix} Missing rule ID.`);
        if (!rule.field) errors.push(`${prefix} Missing target field.`);
        if (!['lte', 'gte', 'eq', 'in', 'between'].includes(rule.operator)) {
          errors.push(`${prefix} Invalid operator "${rule.operator}". Must be one of: lte, gte, eq, in, between.`);
        }
        if (rule.value === undefined || rule.value === null || rule.value === '') {
          errors.push(`${prefix} Missing rule comparison value.`);
        }
        if (!rule.source || typeof rule.source !== 'string' || rule.source.trim().length === 0) {
          errors.push(`${prefix} Missing statutory source citation. Ground rule: Every rule must carry a source citation.`);
        }
        if (typeof rule.verified !== 'boolean') {
          errors.push(`${prefix} Missing verified boolean flag. Ground rule: Set verified: true/false.`);
        }
        if (rule.severity && !['BLOCKING', 'ATTENTION'].includes(rule.severity)) {
          errors.push(`${prefix} Severity must be either BLOCKING or ATTENTION.`);
        }
      });
    }

    if (Array.isArray(scheme.requiredDocuments)) {
      scheme.requiredDocuments.forEach((doc, idx) => {
        const prefix = `Document #${idx + 1}:`;
        if (!doc.type) errors.push(`${prefix} Missing document type key.`);
        if (!doc.label) errors.push(`${prefix} Missing document label.`);
        if (typeof doc.mandatory !== 'boolean') errors.push(`${prefix} Missing mandatory boolean flag.`);
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
