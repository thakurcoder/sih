// VidyaSetu API Client Service
// Connects to the backend API at the URL configured in VITE_API_BASE.
// If the backend is unreachable, callers receive null and must display a
// visible "Demo mode: simulated results" banner — never silently mock.
//
// Usage:
//   Copy .env.example → .env and set VITE_API_BASE=http://localhost:5001/api
//   Leave VITE_API_BASE unset to run in static / demo mode.

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE) ||
  'http://localhost:5001/api';

/**
 * Shared fetch wrapper.
 * Returns parsed JSON on success, or null on any network / server error.
 * Sets a signal timeout so the UI never hangs.
 */
async function apiFetch(path, options = {}, timeoutMs = 2000) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.ok) return await res.json();
    // Server returned an error status — treat as backend unavailable
    console.warn(`[ApiClient] ${options.method || 'GET'} ${path} → HTTP ${res.status}`);
    return null;
  } catch {
    // Network error, timeout, or CORS block
    return null;
  }
}

export const ApiClient = {
  /** The resolved API base URL (useful for diagnostics). */
  API_BASE,

  /**
   * Health check — returns the health payload on success, null if backend is down.
   * Callers should show a "Demo mode" banner when this returns null.
   */
  async checkBackendHealth() {
    return apiFetch('/health', {}, 1500);
  },

  /**
   * Deterministic eligibility check against all schemes.
   * POST /api/eligibility/check
   * @param {Object} candidate - Candidate profile fields
   * @returns {Object|null} Evaluation report, or null (demo mode)
   */
  async checkEligibility(candidate) {
    return apiFetch('/eligibility/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidate),
    });
  },

  /**
   * Analyze an uploaded document.
   * POST /api/documents/analyze  (multipart/form-data)
   * @param {FormData} formData - Must include 'file' and optionally 'schemeId', 'applicantName'
   * @returns {Object|null} Analysis result, or null (demo mode)
   */
  async analyzeDocument(formData) {
    return apiFetch(
      '/documents/analyze',
      { method: 'POST', body: formData },
      15000 // OCR can take a few seconds
    );
  },

  /**
   * Submit a replacement document to resolve a deficiency.
   * POST /api/applications/:appId/documents/replace  (multipart/form-data)
   * @param {string} appId - Application ID
   * @param {FormData} formData - Replacement file + metadata
   * @returns {Object|null} Re-scan result, or null (demo mode)
   */
  async replaceDocument(appId, formData) {
    const isFormData = formData instanceof FormData;
    return apiFetch(
      `/applications/${appId}/documents/replace`,
      {
        method: 'POST',
        ...(isFormData
          ? { body: formData }
          : {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
            }),
      },
      15000
    );
  },

  /**
   * Verify SHA-256 chained audit trail for an application.
   * GET /api/audit/:appId/verify
   * @param {string} appId - Application ID
   * @returns {Object|null} Verification report, or null (demo mode)
   */
  async verifyAuditChain(appId) {
    return apiFetch(`/audit/${appId}/verify`, {});
  },

  /**
   * Update a scheme's configuration (rules, documents, quotas).
   * PUT /api/schemes/:schemeId
   * @param {string} schemeId - Scheme ID (e.g. 'NOS', 'NFST')
   * @param {Object} schemeData - Full updated scheme object
   * @returns {Object|null} Success response, or null (demo mode)
   */
  async updateScheme(schemeId, schemeData) {
    return apiFetch(`/schemes/${schemeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schemeData),
    });
  },

  /**
   * Run policy simulation on the synthetic applicant pool.
   * POST /api/policy/simulate
   * @param {Object} baseline - Current rule values
   * @param {Object} proposed - Proposed rule values
   * @returns {Object|null} Simulation report, or null (demo mode)
   */
  async simulatePolicy(baseline, proposed) {
    return apiFetch('/policy/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseline, proposed }),
    });
  },

  /**
   * Evaluate a single candidate against a specific scheme via the backend engine.
   * POST /api/eligibility/check  (reuses the same endpoint; caller filters by schemeId)
   */
  async evaluateEligibility(candidate, schemeId) {
    const result = await apiFetch('/eligibility/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...candidate, targetSchemeId: schemeId }),
    });
    if (!result) return null;
    // Return only the evaluation for the requested scheme
    return result.evaluations?.find((e) => e.schemeId === schemeId) ?? result;
  },
};
