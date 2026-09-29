// Unit tests for VidyaSetu Generic Config-Driven SchemeRuleEngine
// Uses native node:test and node:assert

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SchemeRuleEngine, applyOperator, resolveCandidateField } from '../src/services/ruleEngine.js';
import { SCHEMES } from '../backend/data/schemesData.js';

describe('SchemeRuleEngine - Operator Evaluations', () => {
  test('lte operator evaluates numerical ceilings correctly', () => {
    assert.strictEqual(applyOperator(500000, 'lte', 600000), true);
    assert.strictEqual(applyOperator(600000, 'lte', 600000), true);
    assert.strictEqual(applyOperator(600001, 'lte', 600000), false);
  });

  test('gte operator evaluates numerical floors correctly', () => {
    assert.strictEqual(applyOperator(55, 'gte', 55), true);
    assert.strictEqual(applyOperator(78.4, 'gte', 55), true);
    assert.strictEqual(applyOperator(54.9, 'gte', 55), false);
  });

  test('eq operator evaluates booleans and strings correctly', () => {
    assert.strictEqual(applyOperator(true, 'eq', true), true);
    assert.strictEqual(applyOperator(false, 'eq', true), false);
    assert.strictEqual(applyOperator('Santhal', 'eq', 'santhal'), true);
    assert.strictEqual(applyOperator('Gond', 'eq', 'Bhil'), false);
  });

  test('in operator evaluates list membership with substring matching', () => {
    const degrees = ['Ph.D.', 'M.Phil', 'Integrated Ph.D.'];
    assert.strictEqual(applyOperator('Ph.D. in Linguistics', 'in', degrees), true);
    assert.strictEqual(applyOperator('M.Phil', 'in', degrees), true);
    assert.strictEqual(applyOperator('B.Com', 'in', degrees), false);
  });

  test('between operator evaluates range bounds correctly', () => {
    assert.strictEqual(applyOperator(25, 'between', [18, 35]), true);
    assert.strictEqual(applyOperator(18, 'between', [18, 35]), true);
    assert.strictEqual(applyOperator(35, 'between', [18, 35]), true);
    assert.strictEqual(applyOperator(17, 'between', [18, 35]), false);
    assert.strictEqual(applyOperator(36, 'between', [18, 35]), false);
  });
});

describe('SchemeRuleEngine - Candidate Field Resolution', () => {
  test('resolves annual income from aliases', () => {
    assert.strictEqual(resolveCandidateField({ annualIncome: 420000 }, 'annualIncome'), 420000);
    assert.strictEqual(resolveCandidateField({ income: 300000 }, 'annualIncome'), 300000);
  });

  test('resolves ST status from category or tribe', () => {
    assert.strictEqual(resolveCandidateField({ isSt: true }, 'isSt'), true);
    assert.strictEqual(resolveCandidateField({ tribe: 'Santhal' }, 'isSt'), true);
    assert.strictEqual(resolveCandidateField({ category: 'ST' }, 'isSt'), true);
    assert.strictEqual(resolveCandidateField({ isSt: false, tribe: '' }, 'isSt'), false);
  });

  test('resolves age directly or computes from dob', () => {
    assert.strictEqual(resolveCandidateField({ age: 26 }, 'age'), 26);
    // Birthday 20 years ago
    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
    const dobStr = twentyYearsAgo.toISOString().split('T')[0];
    const computed = resolveCandidateField({ dob: dobStr }, 'age');
    assert.ok(computed === 20 || computed === 19);
  });
});

describe('SchemeRuleEngine - Affirmative Relaxations', () => {
  test('applies +5 years age relaxation for PVTG candidate under NFST', () => {
    const nfstScheme = SCHEMES.find(s => s.id === 'NFST');

    // Candidate is 38 years old (exceeds standard 36, but within 36 + 5 = 41 for PVTG)
    const pvtgCandidate = {
      name: 'Birhor Scholar',
      isSt: true,
      tribe: 'Birhor',
      pvtg: true,
      annualIncome: 150000,
      age: 38,
      pgMarks: 60,
      degree: 'Ph.D. in Forestry'
    };

    const result = SchemeRuleEngine.evaluate(pvtgCandidate, nfstScheme);
    const ageCheck = result.checks.find(c => c.id === 'age_limit');

    assert.ok(ageCheck, 'Age check should exist');
    assert.strictEqual(ageCheck.passed, true, 'PVTG candidate at age 38 should pass age limit with relaxation');
    assert.ok(ageCheck.appliedRelaxations.some(r => r.includes('PVTG')), 'Should apply PVTG relaxation note');
  });

  test('non-PVTG candidate over 36 fails age limit under NFST', () => {
    const nfstScheme = SCHEMES.find(s => s.id === 'NFST');

    const nonPvtgCandidate = {
      name: 'Standard Scholar',
      isSt: true,
      pvtg: false,
      annualIncome: 150000,
      age: 38,
      pgMarks: 60,
      degree: 'Ph.D.'
    };

    const result = SchemeRuleEngine.evaluate(nonPvtgCandidate, nfstScheme);
    const ageCheck = result.checks.find(c => c.id === 'age_limit');

    assert.ok(ageCheck);
    assert.strictEqual(ageCheck.passed, false, 'Non-PVTG candidate at age 38 must fail base limit of 36');
    assert.strictEqual(result.status, 'NOT_ELIGIBLE');
  });
});

describe('SchemeRuleEngine - NOS Scheme Specific Rules', () => {
  test('enforces corrected ₹6,00,000 income ceiling (not legacy ₹8L)', () => {
    const nosScheme = SCHEMES.find(s => s.id === 'NOS');

    const candidate7L = {
      name: 'Overseas Applicant',
      isSt: true,
      annualIncome: 700000, // Above ₹6L, but below ₹8L
      age: 28,
      pgMarks: 75,
      degree: 'Master of Science',
      qsWorldRank: 85
    };

    const result = SchemeRuleEngine.evaluate(candidate7L, nosScheme);
    const incomeCheck = result.checks.find(c => c.id === 'income_ceiling');

    assert.ok(incomeCheck);
    assert.strictEqual(incomeCheck.passed, false, 'Income of ₹7,00,000 must fail the corrected ₹6,00,000 ceiling');
    assert.strictEqual(result.status, 'NOT_ELIGIBLE');
  });

  test('accepts QS World University Rank within Top 1000', () => {
    const nosScheme = SCHEMES.find(s => s.id === 'NOS');

    const candidateRank650 = {
      name: 'Admitted Scholar',
      isSt: true,
      annualIncome: 350000,
      age: 27,
      pgMarks: 68,
      degree: 'Ph.D. Abroad',
      qsWorldRank: 650 // > 500, but <= 1000
    };

    const result = SchemeRuleEngine.evaluate(candidateRank650, nosScheme);
    const rankCheck = result.checks.find(c => c.id === 'qs_world_rank');

    assert.ok(rankCheck);
    assert.strictEqual(rankCheck.passed, true, 'QS rank 650 must pass the Top 1000 threshold');
    assert.strictEqual(result.status, 'ELIGIBLE');
  });

  test('rejects QS World University Rank above 1000', () => {
    const nosScheme = SCHEMES.find(s => s.id === 'NOS');

    const unrankedCandidate = {
      name: 'Unranked Scholar',
      isSt: true,
      annualIncome: 350000,
      age: 27,
      pgMarks: 68,
      degree: 'Ph.D. Abroad',
      qsWorldRank: 1250
    };

    const result = SchemeRuleEngine.evaluate(unrankedCandidate, nosScheme);
    const rankCheck = result.checks.find(c => c.id === 'qs_world_rank');

    assert.ok(rankCheck);
    assert.strictEqual(rankCheck.passed, false, 'QS rank 1250 must fail the Top 1000 threshold');
    assert.strictEqual(result.status, 'NOT_ELIGIBLE');
  });
});

describe('SchemeRuleEngine - Scheme Config Validation', () => {
  test('rejects scheme without source citations on rules', () => {
    const invalidScheme = {
      id: 'TEST',
      name: 'Test Scheme',
      rules: [
        {
          id: 'test_rule',
          field: 'annualIncome',
          operator: 'lte',
          value: 500000,
          label: 'Test Rule',
          source: '', // Missing source!
          verified: true
        }
      ]
    };

    const validation = SchemeRuleEngine.validateScheme(invalidScheme);
    assert.strictEqual(validation.valid, false);
    assert.ok(validation.errors.some(e => e.includes('statutory source citation')));
  });

  test('rejects scheme without verified boolean on rules', () => {
    const invalidScheme = {
      id: 'TEST',
      name: 'Test Scheme',
      rules: [
        {
          id: 'test_rule',
          field: 'annualIncome',
          operator: 'lte',
          value: 500000,
          label: 'Test Rule',
          source: 'tribal.nic.in'
          // Missing verified flag!
        }
      ]
    };

    const validation = SchemeRuleEngine.validateScheme(invalidScheme);
    assert.strictEqual(validation.valid, false);
    assert.ok(validation.errors.some(e => e.includes('verified boolean flag')));
  });

  test('validates all 5 canonical MoTA schemes cleanly', () => {
    for (const scheme of SCHEMES) {
      const validation = SchemeRuleEngine.validateScheme(scheme);
      assert.strictEqual(
        validation.valid, 
        true, 
        `Scheme ${scheme.id} should pass validation. Errors: ${validation.errors?.join(', ')}`
      );
    }
  });
});
