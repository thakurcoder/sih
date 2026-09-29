// VidyaSetu Lightweight Prototype Backend REST Server
// Zero-dependency native Node.js HTTP server. Runs directly via `node backend/server.js`.
// Provides deterministic eligibility, document pre-scrutiny, audit chain verification,
// and policy simulation for Ministry of Tribal Affairs (MoTA) scholarship workflows.

import http from 'node:http';
import { URL } from 'node:url';
import { SCHEMES, INITIAL_APPLICATIONS, OFFICIAL_MOTA_DBT_STATS, PROTOTYPE_DEMO_DATASET_INFO } from './data/db.js';
import { SchemeRuleEngine } from './services/ruleEngine.js';
import { DocumentAIService } from './services/documentAI.js';
import { AuditChainService } from './services/auditChain.js';
import { PolicySimulatorService } from './services/policySimulator.js';

const PORT = process.env.PORT || 5001;

// In-memory working database
let applications = JSON.parse(JSON.stringify(INITIAL_APPLICATIONS));
let schemes = JSON.parse(JSON.stringify(SCHEMES));

// Helper: Read JSON request body
const readBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
};

// Helper: Send JSON response
const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
};

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = parsedUrl.pathname;
  const method = req.method;

  try {
    // 1. Health check & Adapter Status
    if (method === 'GET' && path === '/api/health') {
      return sendJson(res, 200, {
        status: 'UP',
        service: 'VidyaSetu Governance API',
        environment: 'Prototype / SIH Demonstration Sandbox',
        adapters: {
          digiLocker: { status: 'SANDBOX_READY', mode: 'Adapter Simulator' },
          uidaiKyc: { status: 'MOCK_READY', mode: 'Demographic Validation Simulator' },
          pfmsDbt: { status: 'SANDBOX_READY', mode: 'e-FTO Batch Release Simulator' },
          npciApb: { status: 'SANDBOX_READY', mode: 'Aadhaar Payment Bridge Verification Simulator' },
          nicSms: { status: 'SIMULATED', mode: 'Notification Dispatch Engine' }
        },
        timestamp: new Date().toISOString()
      });
    }

    // 2. Official MoTA Statistics & Prototype Dataset Info
    if (method === 'GET' && path === '/api/stats/mota-dbt') {
      return sendJson(res, 200, {
        officialMoTaStats: OFFICIAL_MOTA_DBT_STATS,
        prototypeDemoDataset: PROTOTYPE_DEMO_DATASET_INFO
      });
    }

    // 3. Scheme Management
    if (method === 'GET' && path === '/api/schemes') {
      return sendJson(res, 200, schemes);
    }

    if (method === 'PUT' && path.startsWith('/api/schemes/')) {
      const schemeId = path.split('/')[3];
      const body = await readBody(req);
      const existing = schemes.find(s => s.id === schemeId);
      if (!existing) {
        return sendJson(res, 404, { error: `Scheme "${schemeId}" not found in policy registry.` });
      }

      const updatedScheme = { ...existing, ...body, id: schemeId };
      const validation = SchemeRuleEngine.validateScheme(updatedScheme);
      if (!validation.valid) {
        return sendJson(res, 400, { 
          error: 'Statutory rule validation failed', 
          validationErrors: validation.errors 
        });
      }

      schemes = schemes.map(s => s.id === schemeId ? updatedScheme : s);
      return sendJson(res, 200, { 
        success: true, 
        message: `Scheme ${schemeId} updated in statutory policy registry.`, 
        scheme: updatedScheme 
      });
    }

    // 4. Deterministic Statutory Eligibility Pre-Checker
    if (method === 'POST' && path === '/api/eligibility/check') {
      const candidate = await readBody(req);
      const targetSchemes = candidate.targetSchemeId 
        ? schemes.filter(s => s.id === candidate.targetSchemeId)
        : schemes;
      const results = targetSchemes.map(s => SchemeRuleEngine.evaluate(candidate, s));
      return sendJson(res, 200, {
        candidate,
        evaluations: results,
        timestamp: new Date().toISOString()
      });
    }

    // 5. Applications Intake & Case File Retrieval
    if (method === 'GET' && path === '/api/applications') {
      return sendJson(res, 200, applications);
    }

    if (method === 'GET' && path.startsWith('/api/applications/')) {
      const appId = path.split('/')[3];
      const app = applications.find(a => a.id === appId);
      if (!app) return sendJson(res, 404, { error: 'Application not found' });
      return sendJson(res, 200, app);
    }

    // 6. Golden Journey Action: Upload Replacement Document (Deficiency Resolution)
    if (method === 'POST' && path.includes('/documents/replace')) {
      const appId = path.split('/')[3];
      const body = await readBody(req);
      const app = applications.find(a => a.id === appId);

      if (!app) return sendJson(res, 404, { error: 'Application not found' });

      // Run AI re-scan
      const reScanResult = DocumentAIService.processReplacement('Income Certificate', body, app);

      // Update application state
      app.status = 'AI Verified';
      app.stage = 3;
      app.progressPercent = 65;
      app.triageCategory = 'READY';
      app.deficiency = null;
      app.aiRiskLevel = 'LOW';
      app.aiVerdict = 'Replacement Income Certificate (FY 2026-27) scanned successfully. All deficiencies resolved. Queued for Officer Scrutiny approval.';

      // Replace deficient doc in doc list
      app.documents = app.documents.map(d => {
        if (d.name.includes('Income')) {
          return {
            name: 'Income Certificate (FY 2026-27)',
            fileNumber: 'JH/INC/2026/01922',
            issuingAuthority: 'Sub-Divisional Officer (SDO), Ranchi',
            issueDate: '12-06-2026',
            status: 'VERIFIED',
            confidence: 98.4,
            extractedText: 'Annual Income from all sources is Rs. 4,20,000 for FY 2026-27. Digital Barcode verified.',
            tamperScore: 0.01
          };
        }
        return d;
      });

      // Append chained audit block
      const lastBlock = app.auditTrail[app.auditTrail.length - 1];
      const newBlock = AuditChainService.createBlock(
        lastBlock.hash,
        `Applicant (${app.name})`,
        'Replacement Income Certificate for FY 2026-27 uploaded via Deficiency Portal',
        { file: 'Fresh_Income_Certificate_FY2026_27_SDO_Ranchi.pdf', barcodeVerified: true }
      );
      const reScanBlock = AuditChainService.createBlock(
        newBlock.hash,
        'AI Document Pre-Scrutiny Lab',
        'AI Re-Scan Passed: Verified FY 2026-27 validity and SDO digital signature. Deficiency cleared.',
        { ocrConfidence: 98.4, tamperScore: 0.01 }
      );
      app.auditTrail.push(newBlock, reScanBlock);

      return sendJson(res, 200, {
        success: true,
        message: 'Replacement document validated. Application returned to Officer Scrutiny queue.',
        reScanResult,
        updatedApplication: app
      });
    }

    // 7. Scrutiny Action: Officer Approve
    if (method === 'POST' && path.includes('/scrutiny/approve')) {
      const appId = path.split('/')[3];
      const app = applications.find(a => a.id === appId);
      if (!app) return sendJson(res, 404, { error: 'Application not found' });

      app.status = 'Selection Committee Review';
      app.stage = 4;
      app.progressPercent = 85;
      app.triageCategory = 'READY';
      app.aiVerdict = 'Level-1 & Level-2 Scrutiny Approved by MoTA Officer. Forwarded to Merit Committee.';

      // Chained audit block
      const lastBlock = app.auditTrail[app.auditTrail.length - 1];
      const approvalBlock = AuditChainService.createBlock(
        lastBlock.hash,
        'MoTA Scrutiny Officer',
        'Level-1 & Level-2 Scrutiny Approved with Human-in-the-Loop clearance',
        { officer: 'director.fellowship@tribal.gov.in', action: 'APPROVE_AND_FORWARD' }
      );
      app.auditTrail.push(approvalBlock);

      return sendJson(res, 200, { success: true, application: app });
    }

    // 8. Scrutiny Action: Officer Override
    if (method === 'POST' && path.includes('/scrutiny/override')) {
      const appId = path.split('/')[3];
      const body = await readBody(req);
      const app = applications.find(a => a.id === appId);
      if (!app) return sendJson(res, 404, { error: 'Application not found' });

      const lastBlock = app.auditTrail[app.auditTrail.length - 1];
      const overrideBlock = AuditChainService.createBlock(
        lastBlock.hash,
        'MoTA Scrutiny Officer',
        `Human Officer Override Executed: ${body.overrideType || 'Exceptional Approval'}`,
        { reason: body.reason, statutoryClause: body.statutoryClause, officerComments: body.comments }
      );
      app.auditTrail.push(overrideBlock);

      return sendJson(res, 200, { success: true, message: 'Officer override recorded in tamper-evident audit ledger.', auditTrail: app.auditTrail });
    }

    // 9. Tamper-Evident Chained Audit Trail Verification
    if (method === 'GET' && path.startsWith('/api/audit/') && path.endsWith('/verify')) {
      const appId = path.split('/')[3];
      const app = applications.find(a => a.id === appId);
      if (!app) return sendJson(res, 404, { error: 'Application not found' });

      const verification = AuditChainService.verifyChain(app.auditTrail);
      return sendJson(res, 200, verification);
    }

    // 10. Policy Decision Support System (Simulation on Synthetic Pool)
    if (method === 'POST' && path === '/api/policy/simulate') {
      const { baseline, proposed } = await readBody(req);
      const simulation = PolicySimulatorService.runSimulation(baseline || {}, proposed || {});
      return sendJson(res, 200, simulation);
    }

    // 11. Cross-Application Anomalies
    if (method === 'GET' && path === '/api/anomalies') {
      const flagged = applications.filter(a => a.anomalyFlags && a.anomalyFlags.length > 0);
      return sendJson(res, 200, {
        totalAnomaliesDetected: flagged.length,
        description: 'Cross-application anomaly clusters requiring officer review. (Does not make adverse administrative determinations automatically).',
        clusters: flagged
      });
    }

    // 404 Not Found
    sendJson(res, 404, { error: 'Endpoint not found', path });
  } catch (error) {
    console.error('Server error:', error);
    sendJson(res, 500, { error: 'Internal server error', details: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏛️  VidyaSetu Governance API Server running on port ${PORT}`);
  console.log(`👉  http://localhost:${PORT}/api/health`);
  console.log(`👉  Environment: SIH Demonstration Prototype / Sandbox`);
  console.log(`=======================================================`);
});
