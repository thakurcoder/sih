// VidyaSetu Deterministic Statutory Rule Engine (Backend Service Adapter)
// Single Source of Truth: Re-exports the unified SchemeRuleEngine from src/services/ruleEngine.js
// Completely generic: zero hardcoded scheme.id branches.

export { SchemeRuleEngine, resolveCandidateField, applyOperator } from '../../src/services/ruleEngine.js';
