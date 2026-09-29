// VidyaSetu Central Data Repository & State Store
// Aligned with official Ministry of Tribal Affairs (MoTA) guidelines and DBT public reporting standards.

export const OFFICIAL_MOTA_DBT_STATS = {
  reportingPeriod: 'FY 2025–26 (Official DBT Bharat Portal Reporting)',
  source: 'Ministry of Tribal Affairs / Direct Benefit Transfer (DBT) Bharat Portal',
  sourceUrl: 'https://dbtbharat.gov.in',
  schemes: [
    { name: 'Pre-Matric Scholarship for ST Students', beneficiaries: '28,99,699', fundsReleasedCr: '₹412.5 Cr', description: 'Centrally sponsored assistance for Classes IX & X ST scholars' },
    { name: 'Post-Matric Scholarship for ST Students', beneficiaries: '65,42,207', fundsReleasedCr: '₹2,180.4 Cr', description: 'Flagship higher secondary, diploma & undergraduate financial coverage' },
    { name: 'National Fellowship for ST Students (NFST)', slotsSanctioned: '750', activeFellows: '620', stipendRange: '₹37,000–₹42,000/mo' },
    { name: 'National Overseas Scholarship (NOS)', slotsSanctioned: '20', activeFellows: '18', coverage: '100% Tuition + Maintenance Allowance' },
    { name: 'Top Class Education for ST Students', slotsSanctioned: '1,000', activeScholars: '940', coverage: 'Premier Institutes (IITs, IIMs, NITs, AIIMS, NLUs)' }
  ]
};

export const PROTOTYPE_DEMO_DATASET_INFO = {
  datasetName: 'VidyaSetu Demonstration Intake Pool',
  totalApplications: 12842,
  description: 'Synthetic demonstration dataset used for testing AI triage, rule simulations, and cross-application anomaly detection.',
  isSynthetic: true
};

import { SCHEMES as CANONICAL_SCHEMES } from '../../backend/data/schemesData.js';
export const INITIAL_SCHEMES = CANONICAL_SCHEMES;

export const TRIBAL_COMMUNITIES = [
  { name: 'Santhal', states: ['Jharkhand', 'West Bengal', 'Odisha', 'Bihar'], pvtg: false },
  { name: 'Gond', states: ['Madhya Pradesh', 'Chhattisgarh', 'Maharashtra', 'Telangana'], pvtg: false },
  { name: 'Bhil', states: ['Rajasthan', 'Gujarat', 'Madhya Pradesh', 'Maharashtra'], pvtg: false },
  { name: 'Munda', states: ['Jharkhand', 'Odisha', 'West Bengal'], pvtg: false },
  { name: 'Oraon (Kurukh)', states: ['Jharkhand', 'Chhattisgarh', 'Odisha'], pvtg: false },
  { name: 'Birhor', states: ['Jharkhand', 'Chhattisgarh', 'Odisha'], pvtg: true }, // PVTG
  { name: 'Chenchu', states: ['Andhra Pradesh', 'Telangana'], pvtg: true },        // PVTG
  { name: 'Baiga', states: ['Madhya Pradesh', 'Chhattisgarh'], pvtg: true },         // PVTG
  { name: 'Sahariya', states: ['Madhya Pradesh', 'Rajasthan'], pvtg: true },         // PVTG
  { name: 'Katkari', states: ['Maharashtra', 'Gujarat'], pvtg: true },               // PVTG
  { name: 'Toda', states: ['Tamil Nadu'], pvtg: true },                              // PVTG
  { name: 'Mizo', states: ['Mizoram'], pvtg: false },
  { name: 'Khasi', states: ['Meghalaya', 'Assam'], pvtg: false },
  { name: 'Garo', states: ['Meghalaya', 'Assam'], pvtg: false },
  { name: 'Bodo', states: ['Assam'], pvtg: false },
  { name: 'Meena', states: ['Rajasthan'], pvtg: false }
];

export const INITIAL_APPLICANTS = [
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
    status: 'Deficiency Pending', // Key for 7-minute golden walkthrough!
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
    auditTrail: [
      {
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: '2026-09-12 10:40:00',
        actor: 'Applicant (Birsa Hemrom)',
        action: 'Application submitted with documents via DigiLocker Sandbox Adapter',
        payload: 'appId=MOTA-2026-NFST-0101',
        hash: 'e81a3f01b9204918acde88102910481239102481029410294810293810293810',
        shortHash: 'e81a..3810'
      },
      {
        prevHash: 'e81a3f01b9204918acde88102910481239102481029410294810293810293810',
        timestamp: '2026-09-12 10:42:00',
        actor: 'AI Document Pre-Scrutiny Lab',
        action: 'OCR extraction completed: Flagged Income Certificate validity lapsed (>1 yr old)',
        payload: 'docName=Income Certificate;issueDate=15-01-2023',
        hash: 'a42f9910c2847102938471029384710293847102938471029384710293847102',
        shortHash: 'a42f..7102'
      },
      {
        prevHash: 'a42f9910c2847102938471029384710293847102938471029384710293847102',
        timestamp: '2026-09-12 10:45:00',
        actor: 'System Notification Adapter',
        action: 'Deficiency Alert dispatched to student with 14-day SLA deadline',
        payload: 'code=DEF-INC-EXPIRED;deadline=2026-09-28',
        hash: 'b110249810293847102938471029384710293847102938471029384710293847',
        shortHash: 'b110..3847'
      }
    ],
    anomalyFlags: [],
    deficiency: {
      code: 'DEF-INC-EXPIRED',
      title: 'Income Certificate Validity Lapsed (> 1 Year Old)',
      description: 'The uploaded Income Certificate was issued on 15-01-2023. Under MoTA statutory guidelines, annual family income certificates must be valid for the ongoing Financial Year (FY 2026-27).',
      actionRequired: 'Upload a valid Income Certificate for FY 2026-27 issued by Tehsildar / SDO.',
      raisedOn: '2026-09-14',
      deadline: '2026-09-28',
      officerRemarks: 'Please upload the latest certificate with digital barcode issued by Revenue Authority.'
    },
    fellowshipDetails: {
      sanctionNumber: 'MoTA/NFST/2026/JH-041',
      monthlyStipend: 37000,
      monthlyHra: 6660,
      annualContingency: 20500,
      bankAccount: 'State Bank of India (Aadhaar Seeded)',
      accountNoMasked: 'SBIN0000166 - ***41203',
      pfmsBatchId: 'DEMO-PFMS-MOTA-B09',
      disbursementHistory: [
        { installment: 'Installment 1 Sanction', amount: 43660, status: 'Paid', utr: 'DEMO-PFMS-00124', date: '2026-08-15' },
        { installment: 'Installment 2 Stipend', amount: 43660, status: 'Paid', utr: 'RBI2409158810291', date: '2026-09-15' },
        { installment: 'Installment 3 Stipend', amount: 43660, status: 'Processing', utr: 'Queued in PFMS e-FTO', date: 'Pending' }
      ],
      progressReports: [
        { quarter: 'Q1 (Jul-Sep 2026)', status: 'Approved by Supervisor', submissionDate: '2026-09-20', grade: 'Satisfactory' }
      ]
    }
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
    auditTrail: [
      {
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: '2026-08-28 09:10:00',
        actor: 'Applicant (Shanti Madkam)',
        action: 'Application submitted for Oxford NOS Fellowship',
        payload: 'institution=University of Oxford',
        hash: 'f102901928374619283746192837461928374619283746192837461928374619',
        shortHash: 'f102..4619'
      },
      {
        prevHash: 'f102901928374619283746192837461928374619283746192837461928374619',
        timestamp: '2026-08-30 11:45:00',
        actor: 'MoTA Overseas Scrutiny Officer',
        action: 'QS Rank (#3) & IELTS verified. Recommended for selection committee',
        payload: 'verified=true',
        hash: 'c881231928374619283746192837461928374619283746192837461928374619',
        shortHash: 'c881..4619'
      },
      {
        prevHash: 'c881231928374619283746192837461928374619283746192837461928374619',
        timestamp: '2026-09-02 15:15:00',
        actor: 'National Selection Committee',
        action: 'Award sanctioned under PVTG priority. Sanction Order generated with QR code',
        payload: 'sanctionNo=MoTA/NOS/2026/CG-OXF-003',
        hash: 'd994121928374619283746192837461928374619283746192837461928374619',
        shortHash: 'd994..4619'
      }
    ],
    anomalyFlags: [],
    deficiency: null,
    fellowshipDetails: {
      sanctionNumber: 'MoTA/NOS/2026/CG-OXF-003',
      monthlyStipend: 110000,
      stipendAnnualGbp: 9900,
      tuitionFeeCoveredGbp: 32500,
      airfareStatus: 'Authorized Economy Flight Ticket',
      visaAssistanceLetter: 'Issued on 2026-09-01',
      bankAccount: 'State Bank of India Foreign Currency Desk',
      accountNoMasked: 'BARC-UK - ***9921',
      pfmsBatchId: 'DEMO-PFMS-NOS-B02',
      disbursementHistory: [
        { installment: 'Term 1 Maintenance (GBP 3,300)', amount: 412500, status: 'Paid', utr: 'FEDWIRE-BOI-2026-0901', date: '2026-09-01' },
        { installment: 'Tuition Tranche 1 (GBP 16,250)', amount: 1625000, status: 'Paid', utr: 'SWIFT-SBI-2026-OXF1', date: '2026-09-05' }
      ],
      progressReports: [
        { quarter: 'Michaelmas Term 2026', status: 'In Progress', submissionDate: 'Due Dec 2026', grade: 'Enrolled' }
      ]
    }
  },
  {
    id: 'MOTA-2026-TOP-0312',
    name: 'Ananya Katkari',
    email: 'ananya.katkari@iitb.ac.in',
    phone: '+91 98230 44918',
    gender: 'Female',
    age: 19,
    dob: '2007-06-12',
    tribe: 'Katkari',
    pvtg: true,
    state: 'Maharashtra',
    district: 'Raigad',
    schemeId: 'TOP_CLASS',
    schemeName: 'Top Class Education for ST Students',
    institution: 'Indian Institute of Technology (IIT) Bombay',
    nirfRank: 3,
    degree: 'B.Tech in Computer Science and Engineering',
    guideName: 'Faculty Advisor: Prof. S. Sudarshan',
    pgMarks: 94.5,
    netScore: 'JEE Advanced ST Category Rank: 14',
    annualIncome: 120000,
    submissionDate: '2026-09-08',
    status: 'AI Verified',
    stage: 2,
    progressPercent: 40,
    aiScore: 97,
    triageCategory: 'READY',
    aiRiskLevel: 'LOW',
    aiVerdict: 'PVTG ST Female with JEE Adv Rank 14 at IIT Bombay. Full tuition + living + IT hardware approved for review.',
    deterministicRuleAudit: {
      status: 'PASSED',
      stStatus: 'PASS',
      incomeLimit: 'PASS',
      ageLimit: 'PASS',
      qualifyingMarks: 'PASS',
      details: 'All statutory criteria met. Notified institute (IIT Bombay).'
    },
    documents: [
      {
        name: 'ST Caste Certificate & Validity',
        fileNumber: 'MH/CCV/PUNE/2025/11294',
        issuingAuthority: 'Divisional Caste Scrutiny Committee, Pune',
        status: 'VERIFIED',
        confidence: 99.8,
        extractedText: 'Caste Scrutiny Certificate issued confirming Katkari Particularly Vulnerable Scheduled Tribe.',
        tamperScore: 0.0
      },
      {
        name: 'IIT Bombay Fee Allotment',
        fileNumber: 'IITB/ADMIS/JEE2026/CS104',
        issuingAuthority: 'Registrar, IIT Bombay',
        status: 'VERIFIED',
        confidence: 99.2,
        extractedText: 'Provisional admission to B.Tech Computer Science granted. Fee payable under Top Class ST.',
        tamperScore: 0.01
      }
    ],
    auditTrail: [
      { time: '02:15 PM', date: '2026-09-08', actor: 'Applicant (Ananya Katkari)', action: 'Application submitted for Top Class ST', hash: 'a881..99', shortHash: 'a881..99' },
      { time: '02:16 PM', date: '2026-09-08', actor: 'VidyaSetu Document AI', action: 'Maharashtra Caste Scrutiny Committee Certificate validated via MahaOnline Sandbox Adapter', hash: 'e992..31', shortHash: 'e992..31' }
    ],
    anomalyFlags: [],
    deficiency: null,
    fellowshipDetails: null
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
        status: 'VERIFIED',
        confidence: 96.0,
        extractedText: 'Certified that Suresh Kumar Meena belongs to Meena Scheduled Tribe.',
        tamperScore: 0.02
      },
      {
        name: 'Income Certificate',
        fileNumber: 'INC/RJ/2026/991',
        issuingAuthority: 'Tehsildar Jaipur',
        status: 'VERIFIED',
        confidence: 94.0,
        extractedText: 'Annual income is Rs. 5,20,000 for FY 2026-27.',
        tamperScore: 0.03
      }
    ],
    auditTrail: [
      { time: '04:12 PM', date: '2026-09-20', actor: 'Applicant (Suresh Meena)', action: 'Application submitted', hash: 'b771..02', shortHash: 'b771..02' },
      { time: '04:13 PM', date: '2026-09-20', actor: 'Cross-Application Anomaly Detector', action: 'Flagged potential duplicate cluster: Phone/Bank match with #MOTA-2026-NFST-0091', hash: 'c992..04', shortHash: 'c992..04' }
    ],
    anomalyFlags: [
      { type: 'SHARED_IDENTIFIER', label: 'Phone & Bank details match #MOTA-2026-NFST-0091', severity: 'HIGH', explanation: 'Shared contact phone and IFSC account detected across two applications. Officer verification required before proceeding.' }
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
    auditTrail: [
      { time: '09:30 AM', date: '2026-09-18', actor: 'Applicant (Mangal Munda)', action: 'Application submitted for Pre-Matric ST', hash: 'd112..81', shortHash: 'd112..81' },
      { time: '09:31 AM', date: '2026-09-18', actor: 'VidyaSetu Document AI', action: 'School bonafide and Article 342 caste status verified', hash: 'e223..92', shortHash: 'e223..92' }
    ],
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
    auditTrail: [
      { time: '11:20 AM', date: '2026-09-15', actor: 'Applicant (Sunita Oraon)', action: 'Application submitted for Post-Matric ST', hash: 'f334..12', shortHash: 'f334..12' },
      { time: '11:22 AM', date: '2026-09-15', actor: 'VidyaSetu Document AI', action: 'RIMS Bonafide & Fee structure verified via institutional adapter', hash: 'a445..23', shortHash: 'a445..23' }
    ],
    anomalyFlags: [],
    deficiency: null,
    fellowshipDetails: null
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    channel: 'SMS (NIC Gateway Adapter) + PORTAL',
    recipient: '+91 98451 22341 (Birsa Hemrom)',
    title: 'Deficiency Notice: Income Certificate Validity Lapsed',
    message: 'MoTA Alert: Your application #MOTA-2026-NFST-0101 requires a fresh FY 2026-27 Income Certificate. Please upload within 14 days to preserve application queue seniority.',
    time: '2 hours ago',
    type: 'ALERT'
  },
  {
    id: 'NOTIF-02',
    channel: 'EMAIL',
    recipient: 'shanti.madkam@oxford.alumni.org',
    title: 'Award Sanction Order Issued — National Overseas Scholarship',
    message: 'Official Sanction Order MoTA/NOS/2026/CG-OXF-003 for University of Oxford signed. Download from VidyaSetu portal.',
    time: 'Yesterday',
    type: 'SUCCESS'
  },
  {
    id: 'NOTIF-03',
    channel: 'PORTAL',
    recipient: 'birsa.hemrom@research.iitkgp.ac.in',
    title: 'DBT Stipend Release Simulator Notice',
    message: 'Stipend release simulated via PFMS e-FTO (Reference: DEMO-PFMS-00124). Please keep QPR endorsed by supervisor.',
    time: '3 days ago',
    type: 'INFO'
  }
];

export const MOCK_GRIEVANCES = [
  {
    id: 'GR-1021',
    applicantId: 'MOTA-2026-NFST-0101',
    applicantName: 'Birsa Hemrom',
    category: 'Payment / Disbursement',
    title: 'HRA Allowance Difference in Tier-1 City',
    description: 'Hostel accommodation under renovation; staying off-campus. Requesting HRA assessment.',
    aiCategory: 'Finance & DBT Division',
    aiPriority: 'MEDIUM',
    status: 'Pending Review',
    submittedOn: '2026-09-24',
    officerResponse: null
  }
];

export const NATIONAL_ANALYTICS_DATA = {
  // Sourced official MoTA DBT published numbers
  officialMoTaStats: OFFICIAL_MOTA_DBT_STATS,
  // Synthetic intake dataset for demo
  totalApplications: 12842,
  underVerification: 3241,
  deficienciesIdentified: 842,
  totalSelected: 1204,
  pendingDisbursement: 328,
  prototypeDataset: {
    totalApplications: 12842,
    underVerification: 3241,
    deficienciesIdentified: 842,
    totalSelected: 1204,
    pendingDisbursement: 328,
    isSynthetic: true
  },
  schemeBreakdown: [
    { scheme: 'Pre-Matric ST', applications: 2899699, verified: 2840120, selected: 2795400, fundsCr: 412.5 },
    { scheme: 'Post-Matric ST', applications: 6542207, verified: 6410300, selected: 6320100, fundsCr: 2180.4 },
    { scheme: 'Top Class ST', applications: 4582, verified: 4120, selected: 940, fundsCr: 65.0 },
    { scheme: 'NFST', applications: 5420, verified: 4821, selected: 620, fundsCr: 95.0 },
    { scheme: 'NOS', applications: 2840, verified: 2341, selected: 18, fundsCr: 18.5 }
  ],
  statePerformance: [
    { state: 'Jharkhand', applications: 3840, selected: 420, pvtgCount: 420 },
    { state: 'Odisha', applications: 3410, selected: 390, pvtgCount: 380 },
    { state: 'Madhya Pradesh', applications: 3120, selected: 340, pvtgCount: 310 },
    { state: 'Chhattisgarh', applications: 2450, selected: 270, pvtgCount: 220 },
    { state: 'Maharashtra', applications: 1980, selected: 195, pvtgCount: 85 },
    { state: 'Assam & NE States', applications: 1840, selected: 180, pvtgCount: 40 },
    { state: 'Rajasthan', applications: 1120, selected: 110, pvtgCount: 15 },
    { state: 'Gujarat', applications: 980, selected: 92, pvtgCount: 12 }
  ],
  aiInsights: [
    {
      title: 'Low NOS Intake from Central Tribal Belt',
      description: 'Only 3% of NOS applicants originate from MP and Chhattisgarh despite high tribal population. Recommended intervention: Launch overseas counseling bootcamps in Eklavya Model Residential Schools (EMRS).',
      suggestedAction: 'Deploy regional language awareness materials via VidyaMitra.'
    },
    {
      title: 'Expiring Income Certificates in Q3 Intake',
      description: '412 applications in Jharkhand currently have FY 2024-25 income certificates expiring before selection. Automated deficiency alerts dispatched with 14-day SLA deadline.',
      suggestedAction: 'Track deficiency clearance rate on Officer Scrutiny Desk.'
    }
  ]
};
