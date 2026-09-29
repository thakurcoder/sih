// VidyaSetu Central Data Repository & State Store
// Governed by official Ministry of Tribal Affairs (MoTA) guidelines and DBT public reporting standards.

import { AuditChainService } from '../services/auditChain.js';

export const OFFICIAL_MOTA_DBT_STATS = {
  reportingPeriod: 'FY 2025–26 (Official DBT Bharat Portal Reporting)',
  source: 'Ministry of Tribal Affairs / Direct Benefit Transfer (DBT) Bharat Portal',
  sourceUrl: 'https://dbtbharat.gov.in',
  schemes: [
    { name: 'Pre-Matric Scholarship for ST Students', beneficiaries: 2899699, fundsReleasedCr: 412.5 },
    { name: 'Post-Matric Scholarship for ST Students', beneficiaries: 6542207, fundsReleasedCr: 2180.4 },
    { name: 'National Fellowship for ST Students (NFST)', slotsSanctioned: 750, activeFellows: 620 },
    { name: 'National Overseas Scholarship (NOS)', slotsSanctioned: 20, activeFellows: 18 },
    { name: 'Top Class Education for ST Students', slotsSanctioned: 1000, activeScholars: 940 }
  ]
};

export const PROTOTYPE_DEMO_DATASET_INFO = {
  datasetName: 'VidyaSetu Demonstration Intake Pool',
  totalApplications: 12842,
  description: 'Synthetic demonstration dataset used for testing AI triage, rule simulations, and fraud anomaly detection.',
  isSynthetic: true
};

import { SCHEMES as CANONICAL_SCHEMES } from './schemesData.js';
export const SCHEMES = CANONICAL_SCHEMES;

// Helper to generate a valid cryptographic block chain
const buildInitialChain = (events) => {
  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const chain = [];
  for (const ev of events) {
    const block = AuditChainService.createBlock(prevHash, ev.actor, ev.action, ev.payload || '', ev.timestamp);
    chain.push(block);
    prevHash = block.hash;
  }
  return chain;
};

export const INITIAL_APPLICATIONS = [
  {
    id: 'MOTA-2026-NFST-0101',
    name: 'Birsa Hemrom',
    email: 'birsa.hemrom@research.iitkgp.ac.in',
    phone: '+91 98451 22341',
    gender: 'Male',
    age: 26,
    dob: '1999-11-15',
    tribe: 'Santhal',
    pvtg: false,
    state: 'Jharkhand',
    district: 'Ranchi',
    schemeId: 'NFST',
    schemeName: 'National Fellowship for ST Students',
    institution: 'Indian Institute of Technology (IIT) Kharagpur',
    nirfRank: 5,
    degree: 'Ph.D. in Rural Development & Water Harvesting',
    guideName: 'Prof. A. K. Banerjee',
    pgMarks: 78.4,
    netScore: 'UGC-NET Qualified (Roll: JH04100234)',
    annualIncome: 420000,
    submissionDate: '2026-09-12',
    status: 'Deficiency Pending',
    stage: 2,
    progressPercent: 45,
    aiScore: 82,
    triageCategory: 'DEFICIENT',
    aiRiskLevel: 'MEDIUM',
    aiVerdict: 'Income Certificate issue date is Jan 2023 (>1 yr old). Validity has lapsed. Action required by student.',
    deterministicRuleAudit: {
      status: 'DEFICIENT_DOCUMENTS',
      stStatus: 'PASS',
      incomeLimit: 'PASS',
      ageLimit: 'PASS',
      qualifyingMarks: 'PASS',
      details: 'Meets demographic and academic statutory criteria, but requires an active FY 2026-27 Income Certificate.'
    },
    documents: [
      {
        name: 'ST Caste Certificate',
        fileNumber: 'JH/RAN/2021/ST/8821',
        issuingAuthority: 'Sub-Divisional Officer, Ranchi',
        issueDate: '10-08-2021',
        status: 'VERIFIED',
        confidence: 99.1,
        extractedText: 'Certified that Shri Birsa Hemrom belongs to Santhal Community recognized as Scheduled Tribe in Jharkhand.',
        tamperScore: 0.01
      },
      {
        name: 'Income Certificate',
        fileNumber: 'INC/JH/2023/1029',
        issuingAuthority: 'Circle Officer, Kanke, Ranchi',
        issueDate: '15-01-2023 (EXPIRED)',
        status: 'DEFICIENT',
        confidence: 96.4,
        extractedText: 'Annual Income stated as Rs. 4,20,000. WARNING: Date of issue is 15-01-2023. Validity of 1 fiscal year has lapsed.',
        tamperScore: 0.02
      },
      {
        name: 'IIT Kharagpur Ph.D. Confirmation',
        fileNumber: 'IITKGP/ACAD/PHD/2026/041',
        issuingAuthority: 'Dean of Academic Affairs, IIT Kharagpur',
        issueDate: '01-08-2026',
        status: 'VERIFIED',
        confidence: 98.6,
        extractedText: 'Mr. Birsa Hemrom enrolled as regular full-time Ph.D. scholar w.e.f. August 2026 under Roll No 26RD91R02.',
        tamperScore: 0.0
      },
      {
        name: 'Aadhaar Identity Proof',
        fileNumber: 'XXXX-XXXX-4912',
        issuingAuthority: 'UIDAI Adapter (Sandbox)',
        issueDate: '2026-01-10',
        status: 'VERIFIED',
        confidence: 99.8,
        extractedText: 'Birsa Hemrom, DOB: 15/11/1999, Ranchi, Jharkhand. Seeded in SBI A/c ***41203.',
        tamperScore: 0.0
      }
    ],
    deficiency: {
      code: 'DEF-INC-EXPIRED',
      title: 'Income Certificate Validity Lapsed (> 1 Year Old)',
      description: 'The uploaded Income Certificate was issued on 15-01-2023. Under MoTA statutory guidelines, annual family income certificates must be valid for the ongoing Financial Year (FY 2026-27).',
      actionRequired: 'Upload a valid Income Certificate for FY 2026-27 issued by Tehsildar / SDO.',
      raisedOn: '2026-09-14',
      deadline: '2026-09-28',
      officerRemarks: 'Please upload the latest certificate with digital barcode issued by Revenue Authority.'
    },
    auditTrail: buildInitialChain([
      {
        timestamp: '2026-09-12T10:40:00Z',
        actor: 'Applicant (Birsa Hemrom)',
        action: 'Application submitted with documents via DigiLocker Sandbox Adapter',
        payload: { appId: 'MOTA-2026-NFST-0101', scheme: 'NFST' }
      },
      {
        timestamp: '2026-09-12T10:42:00Z',
        actor: 'AI Document Pre-Scrutiny Lab',
        action: 'OCR extraction completed: Flagged Income Certificate validity lapsed (>1 yr old)',
        payload: { docName: 'Income Certificate', issueDate: '15-01-2023', finding: 'DEFICIENCY' }
      },
      {
        timestamp: '2026-09-12T10:45:00Z',
        actor: 'System Notification Adapter',
        action: 'Deficiency Alert dispatched to student with 14-day SLA deadline',
        payload: { code: 'DEF-INC-EXPIRED', deadline: '2026-09-28' }
      }
    ]),
    anomalyFlags: [],
    fellowshipDetails: null
  },
  {
    id: 'MOTA-2026-NOS-0042',
    name: 'Shanti Madkam',
    email: 'shanti.madkam@oxford.alumni.org',
    phone: '+91 94060 11984',
    gender: 'Female',
    age: 27,
    dob: '1999-04-03',
    tribe: 'Dhurwa / Gond',
    pvtg: true,
    state: 'Chhattisgarh',
    district: 'Bastar',
    schemeId: 'NOS',
    schemeName: 'National Overseas Scholarship for ST Students',
    institution: 'University of Oxford, United Kingdom',
    nirfRank: null,
    qsWorldRank: 3,
    degree: 'M.Sc. in Biodiversity, Conservation and Forest Management',
    guideName: 'Dr. Evelyn Sinclair',
    pgMarks: 84.2,
    netScore: 'IELTS: 8.0 overall (L:8.5, R:8.0, W:7.5, S:8.0)',
    annualIncome: 180000,
    submissionDate: '2026-08-28',
    status: 'Selected',
    stage: 6,
    progressPercent: 100,
    aiScore: 98,
    triageCategory: 'READY',
    aiRiskLevel: 'LOW',
    aiVerdict: 'Top tier candidate. PVTG Scholar from Bastar. Unconditional Oxford offer (QS #3). Selected by Overseas Expert Committee.',
    deterministicRuleAudit: {
      status: 'PASSED',
      stStatus: 'PASS',
      incomeLimit: 'PASS',
      ageLimit: 'PASS',
      qualifyingMarks: 'PASS',
      details: 'All statutory criteria satisfied. QS World Rank #3 meets Priority ≤ 200 requirement.'
    },
    documents: [
      {
        name: 'ST Caste Certificate',
        fileNumber: 'CG/BAS/2020/ST/0912',
        issuingAuthority: 'Tahsildar Jagdalpur, Bastar',
        issueDate: '12-05-2020',
        status: 'VERIFIED',
        confidence: 99.4,
        extractedText: 'Ku. Shanti Madkam d/o Sh. Joga Madkam belongs to Gond (Dhurwa) Scheduled Tribe of Bastar district.',
        tamperScore: 0.01
      },
      {
        name: 'Oxford Unconditional Offer Letter',
        fileNumber: 'OXF-ADMIS-2026-MSCBIO-9182',
        issuingAuthority: 'Graduate Admissions, University of Oxford',
        issueDate: '2026-08-15',
        status: 'VERIFIED',
        confidence: 99.7,
        extractedText: 'Unconditional admission offered on the M.Sc. in Biodiversity, Conservation and Management for Michaelmas Term 2026.',
        tamperScore: 0.0
      },
      {
        name: 'Valid Indian Passport',
        fileNumber: 'V8921044',
        issuingAuthority: 'Regional Passport Office, Raipur',
        issueDate: '2024-05-14',
        status: 'VERIFIED',
        confidence: 98.9,
        extractedText: 'Passport No: V8921044, Shanti Madkam, Expiry: 14/05/2034',
        tamperScore: 0.0
      }
    ],
    auditTrail: buildInitialChain([
      {
        timestamp: '2026-08-28T09:10:00Z',
        actor: 'Applicant (Shanti Madkam)',
        action: 'Application submitted for Oxford NOS Fellowship',
        payload: { institution: 'University of Oxford', qsRank: 3 }
      },
      {
        timestamp: '2026-08-30T11:45:00Z',
        actor: 'MoTA Overseas Scrutiny Officer',
        action: 'QS Rank (#3) & IELTS verified. Recommended for selection committee',
        payload: { verifiedBy: 'overseas.desk@tribal.gov.in' }
      },
      {
        timestamp: '2026-09-02T15:15:00Z',
        actor: 'National Selection Committee',
        action: 'Award sanctioned under PVTG priority. Sanction Order generated with QR code',
        payload: { sanctionNo: 'MoTA/NOS/2026/CG-OXF-003', pvtgQuota: true }
      }
    ]),
    anomalyFlags: [],
    deficiency: null,
    fellowshipDetails: {
      sanctionNumber: 'MoTA/NOS/2026/CG-OXF-003',
      monthlyStipend: 110000,
      stipendAnnualGbp: 9900,
      tuitionFeeCoveredGbp: 32500,
      airfareStatus: 'Authorized Economy Flight Ticket',
      bankAccount: 'State Bank of India Foreign Currency Desk',
      accountNoMasked: 'BARC-UK - ***9921',
      pfmsBatchId: 'DEMO-PFMS-NOS-B02',
      disbursementHistory: [
        { installment: 'Term 1 Maintenance (GBP 3,300)', amount: 412500, status: 'Paid', utr: 'FEDWIRE-BOI-2026-0901', date: '2026-09-01' },
        { installment: 'Tuition Tranche 1 (GBP 16,250)', amount: 1625000, status: 'Paid', utr: 'SWIFT-SBI-2026-OXF1', date: '2026-09-05' }
      ],
      progressReports: [
        { quarter: 'Michaelmas Term 2026', status: 'Enrolled & Verified', submissionDate: '2026-09-20', grade: 'Satisfactory' }
      ]
    }
  },
  {
    id: 'MOTA-2026-NFST-0282',
    name: 'Suresh Kumar Meena',
    email: 'suresh.meena99@rajasthan.edu.in',
    phone: '+91 94140 33918',
    gender: 'Male',
    age: 27,
    dob: '1999-01-10',
    tribe: 'Meena',
    pvtg: false,
    state: 'Rajasthan',
    district: 'Jaipur',
    schemeId: 'NFST',
    schemeName: 'National Fellowship for ST Students',
    institution: 'University of Rajasthan',
    nirfRank: 45,
    degree: 'Ph.D. in Botany',
    guideName: 'Dr. S. C. Sharma',
    pgMarks: 72.1,
    netScore: 'UGC-NET Qualified',
    annualIncome: 520000,
    submissionDate: '2026-09-20',
    status: 'Submitted',
    stage: 1,
    progressPercent: 20,
    aiScore: 71,
    triageCategory: 'DEFICIENT',
    aiRiskLevel: 'HIGH',
    aiVerdict: 'CROSS-APPLICATION ANOMALY: Shared phone number and bank account matches applicant #MOTA-2026-NFST-0091. Flagged for officer review.',
    deterministicRuleAudit: {
      status: 'ANOMALY_FLAGGED',
      stStatus: 'PASS',
      incomeLimit: 'PASS',
      ageLimit: 'PASS',
      qualifyingMarks: 'PASS',
      details: 'Meets general criteria, but cross-application anomaly detected in financial and contact identifiers.'
    },
    documents: [
      {
        name: 'ST Caste Certificate',
        fileNumber: 'RJ/JAI/2021/ST/1102',
        issuingAuthority: 'Tehsildar Sanganer, Jaipur',
        issueDate: '2021-04-12',
        status: 'VERIFIED',
        confidence: 96.0,
        extractedText: 'Certified that Suresh Kumar Meena belongs to Meena Scheduled Tribe.',
        tamperScore: 0.02
      },
      {
        name: 'Income Certificate',
        fileNumber: 'INC/RJ/2026/991',
        issuingAuthority: 'Tehsildar Jaipur',
        issueDate: '2026-05-18',
        status: 'VERIFIED',
        confidence: 94.0,
        extractedText: 'Annual income is Rs. 5,20,000 for FY 2026-27.',
        tamperScore: 0.03
      }
    ],
    auditTrail: buildInitialChain([
      {
        timestamp: '2026-09-20T16:12:00Z',
        actor: 'Applicant (Suresh Meena)',
        action: 'Application submitted',
        payload: { appId: 'MOTA-2026-NFST-0282' }
      },
      {
        timestamp: '2026-09-20T16:13:00Z',
        actor: 'Cross-Application Anomaly Detector',
        action: 'Cluster match flagged: Phone and Bank Account shared with #MOTA-2026-NFST-0091',
        payload: { sharedIdentifier: '9414033918', severity: 'HIGH' }
      }
    ]),
    anomalyFlags: [
      {
        type: 'SHARED_IDENTIFIER',
        label: 'Phone number & Bank Account matches active record #MOTA-2026-NFST-0091',
        severity: 'HIGH',
        explanation: 'AI detected that bank account IFSC/Acc and applicant mobile number were already registered in another state intake. Requires officer verification.'
      }
    ],
    deficiency: null,
    fellowshipDetails: null
  },
  {
    id: 'MOTA-2026-PRE-0512',
    name: 'Mangal Munda',
    email: 'mangal.munda.khunti@jharkhandschools.gov.in',
    phone: '+91 94301 88412',
    gender: 'Male',
    age: 15,
    dob: '2011-03-22',
    tribe: 'Munda',
    pvtg: false,
    state: 'Jharkhand',
    district: 'Khunti',
    schemeId: 'PRE_MATRIC',
    schemeName: 'Pre-Matric Scholarship Scheme for ST Students',
    institution: 'Government High School, Khunti',
    nirfRank: null,
    degree: 'Class X (Secondary School)',
    guideName: 'Headmaster: Sri R. N. Sahu',
    pgMarks: 81.2,
    netScore: 'Class IX Final: 81.2% (Grade A)',
    annualIncome: 140000,
    submissionDate: '2026-09-18',
    status: 'AI Verified',
    stage: 2,
    progressPercent: 40,
    aiScore: 94,
    triageCategory: 'READY',
    aiRiskLevel: 'LOW',
    aiVerdict: 'All statutory criteria met under Pre-Matric ST guidelines. Income ₹1.40L <= ₹2.50L. School bonafide verified.',
    deterministicRuleAudit: {
      status: 'PASSED',
      stStatus: 'PASS',
      incomeLimit: 'PASS',
      ageLimit: 'PASS',
      qualifyingMarks: 'PASS',
      details: 'Meets Article 342 ST notification, income ceiling <= 2.5L, and enrolled in recognized Government School.'
    },
    documents: [
      {
        name: 'ST Caste Certificate',
        fileNumber: 'JH/KHU/2022/ST/4401',
        issuingAuthority: 'Circle Officer, Khunti',
        issueDate: '14-07-2022',
        status: 'VERIFIED',
        confidence: 99.4,
        extractedText: 'Certified that Mangal Munda belongs to Munda Scheduled Tribe in Jharkhand under Article 342.',
        tamperScore: 0.0
      },
      {
        name: 'Income Certificate',
        fileNumber: 'INC/JH/2026/0882',
        issuingAuthority: 'Tehsildar Khunti',
        issueDate: '2026-05-10',
        status: 'VERIFIED',
        confidence: 98.1,
        extractedText: 'Annual family income is Rs. 1,40,000 for FY 2026-27.',
        tamperScore: 0.01
      },
      {
        name: 'School Bonafide Certificate',
        fileNumber: 'GHSK/ENROL/2026/IX-104',
        issuingAuthority: 'Headmaster, Govt High School Khunti',
        issueDate: '2026-06-20',
        status: 'VERIFIED',
        confidence: 98.9,
        extractedText: 'Mangal Munda is a bonafide regular student of Class X for academic year 2026-27.',
        tamperScore: 0.0
      }
    ],
    auditTrail: buildInitialChain([
      {
        timestamp: '2026-09-18T09:30:00Z',
        actor: 'Applicant (Mangal Munda)',
        action: 'Application submitted for Pre-Matric ST Scholarship',
        payload: { appId: 'MOTA-2026-PRE-0512' }
      },
      {
        timestamp: '2026-09-18T09:31:00Z',
        actor: 'VidyaSetu Document AI',
        action: 'School bonafide and Article 342 caste records verified',
        payload: { confidence: 99.4 }
      }
    ]),
    anomalyFlags: [],
    deficiency: null,
    fellowshipDetails: null
  },
  {
    id: 'MOTA-2026-POST-0841',
    name: 'Sunita Oraon',
    email: 'sunita.oraon@rims.edu.in',
    phone: '+91 94317 55219',
    gender: 'Female',
    age: 21,
    dob: '2005-08-14',
    tribe: 'Oraon (Kurukh)',
    pvtg: false,
    state: 'Jharkhand',
    district: 'Ranchi',
    schemeId: 'POST_MATRIC',
    schemeName: 'Post-Matric Scholarship Scheme for ST Students',
    institution: 'Rajendra Institute of Medical Sciences (RIMS), Ranchi',
    nirfRank: 25,
    degree: 'B.Sc. Nursing (Group 1 Professional Degree)',
    guideName: 'Principal: Dr. S. K. Tirkey',
    pgMarks: 76.5,
    netScore: 'Class XII Science: 76.5%',
    annualIncome: 185000,
    submissionDate: '2026-09-15',
    status: 'AI Verified',
    stage: 2,
    progressPercent: 45,
    aiScore: 96,
    triageCategory: 'READY',
    aiRiskLevel: 'LOW',
    aiVerdict: 'All statutory criteria met under Post-Matric ST guidelines. Income ₹1.85L <= ₹2.50L. Group 1 Professional course verified.',
    deterministicRuleAudit: {
      status: 'PASSED',
      stStatus: 'PASS',
      incomeLimit: 'PASS',
      ageLimit: 'PASS',
      qualifyingMarks: 'PASS',
      details: 'Meets Article 342 ST notification, income ceiling <= 2.5L, and enrolled in recognized institution for Group 1 professional course.'
    },
    documents: [
      {
        name: 'ST Caste Certificate',
        fileNumber: 'JH/RAN/2023/ST/1092',
        issuingAuthority: 'Sub-Divisional Officer, Ranchi',
        issueDate: '2023-04-10',
        status: 'VERIFIED',
        confidence: 99.2,
        extractedText: 'Certified that Ku. Sunita Oraon belongs to Oraon Scheduled Tribe in Jharkhand under Article 342.',
        tamperScore: 0.0
      },
      {
        name: 'Income Certificate',
        fileNumber: 'INC/JH/2026/4102',
        issuingAuthority: 'Circle Officer, Ranchi',
        issueDate: '2026-05-15',
        status: 'VERIFIED',
        confidence: 98.7,
        extractedText: 'Family annual income is Rs. 1,85,000 for FY 2026-27.',
        tamperScore: 0.0
      },
      {
        name: 'College Bonafide & Fee Structure',
        fileNumber: 'RIMS/NURS/2026/BON-088',
        issuingAuthority: 'Dean, College of Nursing, RIMS Ranchi',
        issueDate: '2026-08-01',
        status: 'VERIFIED',
        confidence: 99.0,
        extractedText: 'Bonafide student in B.Sc. Nursing (Year 2). Compulsory fee eligible for 100% reimbursement under Post-Matric ST.',
        tamperScore: 0.0
      }
    ],
    auditTrail: buildInitialChain([
      {
        timestamp: '2026-09-15T11:20:00Z',
        actor: 'Applicant (Sunita Oraon)',
        action: 'Application submitted for Post-Matric ST Scholarship',
        payload: { appId: 'MOTA-2026-POST-0841' }
      },
      {
        timestamp: '2026-09-15T11:22:00Z',
        actor: 'VidyaSetu Document AI',
        action: 'RIMS Bonafide & Fee structure verified via institutional adapter',
        payload: { confidence: 99.0 }
      }
    ]),
    anomalyFlags: [],
    deficiency: null,
    fellowshipDetails: null
  }
];
