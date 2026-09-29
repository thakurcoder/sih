// VidyaSetu Official Schemes Data Repository
// Single Source of Truth for Ministry of Tribal Affairs (MoTA) Scholarship & Fellowship Schemes
// Every rule carries official 'source' citations and a 'verified' flag.
// Ground Rules:
// - NOS-ST family income ceiling: ₹6,00,000 (verified: true, source: tribal.nic.in/ScholarshiP.aspx)
// - NOS-ST 20 awards = 17 ST + 3 PVTG, with 6 earmarked for women (verified: true)
// - NOS-ST max age: 35 for Ph.D. as of 1 July of selection year (verified: true)
// - NOS-ST QS World Ranking threshold: 1,000 (verified: true, source: tribal.nic.in 2024-25 guidelines)
// - Unconfirmed items marked with verified: false

export const SCHEMES = [
  {
    id: 'NFST',
    name: 'National Fellowship for Scheduled Tribe Students',
    shortName: 'NFST',
    category: 'Higher Education Research (Ph.D. / M.Phil)',
    description: 'Financial assistance to ST scholars pursuing regular and full-time M.Phil and Ph.D. degrees in Sciences, Humanities, Social Sciences and Engineering across Indian Universities and Research Institutes.',
    totalSlots: 750,
    filledSlots: 620,
    annualBudgetCr: 95.0,
    stipendJrf: 37000,
    stipendSrf: 42000,
    contingencyAnnual: 20500,
    guidelineReference: 'MoTA Scheme Guidelines for NFST (Revised Edition) — tribal.nic.in/ScholarshiP.aspx',
    selectionMethod: {
      type: 'MERIT_AND_QUOTA',
      description: 'Merit in Post-Graduation Examination with statutory provisions for ST girls (30% horizontal quota), Divyangjan (5%), and PVTG priority.',
      source: 'MoTA NFST Scheme Guidelines',
      verified: true
    },
    quotaRules: {
      stFemaleHorizontal: 30, // 30% horizontal reservation for women
      pvtgPrioritySlots: 50,  // 50 dedicated seats for Particularly Vulnerable Tribal Groups
      pwdReservation: 5       // 5% reservation for Divyangjan
    },
    validityRules: {
      incomeCertificate: {
        requiresCurrentFY: true,
        maxAgeMonths: 12,
        label: 'Income Certificate must be issued for ongoing Financial Year (FY 2026-27)',
        source: 'MoTA Statutory Revenue Guidelines',
        verified: true
      },
      casteCertificate: {
        lifetimeValidity: true,
        article342Notified: true,
        label: 'ST Certificate has lifelong validity under Article 342',
        source: 'Constitution of India, Article 342',
        verified: true
      }
    },
    requiredDocuments: [
      {
        type: 'st_certificate',
        label: 'ST Caste Certificate',
        mandatory: true,
        issuingAuthorities: ['Sub-Divisional Officer (SDO)', 'Tehsildar', 'District Magistrate'],
        description: 'Scheduled Tribe certificate issued by competent revenue authority under Article 342.'
      },
      {
        type: 'income_certificate',
        label: 'Annual Family Income Certificate',
        mandatory: true,
        issuingAuthorities: ['Tehsildar', 'SDO', 'Circle Officer'],
        description: 'Income Certificate valid for FY 2026-27 certifying total annual family income ≤ ₹6,00,000.'
      },
      {
        type: 'marksheet',
        label: 'Master Degree Consolidated Marksheet',
        mandatory: true,
        issuingAuthorities: ['University Registrar', 'Controller of Examinations'],
        description: 'Post-Graduation marksheet demonstrating ≥ 55% aggregate marks.'
      },
      {
        type: 'admission_letter',
        label: 'Ph.D. / M.Phil Enrolment Confirmation',
        mandatory: true,
        issuingAuthorities: ['Dean of Academic Affairs', 'Registrar', 'Head of Department'],
        description: 'Official confirmation of regular, full-time Ph.D. or M.Phil enrolment with guide endorsement.'
      },
      {
        type: 'research_proposal',
        label: 'Research Synopsis / Proposal',
        mandatory: false,
        issuingAuthorities: ['Candidate & Research Supervisor'],
        description: 'Brief research synopsis (max 10 pages) endorsed by department head.'
      },
      {
        type: 'aadhaar_card',
        label: 'Aadhaar Identity Proof',
        mandatory: true,
        issuingAuthorities: ['UIDAI'],
        description: 'Aadhaar card linked to bank account seeded via NPCI Aadhaar Payment Bridge.'
      }
    ],
    // Deterministic Statutory Eligibility Rules
    rules: [
      {
        id: 'st_status',
        field: 'isSt',
        operator: 'eq',
        value: true,
        severity: 'BLOCKING',
        label: 'Scheduled Tribe Community Verification',
        description: 'Candidate must belong to a Scheduled Tribe notified under Article 342 of the Constitution of India.',
        source: 'Constitution of India Article 342 / Central ST list',
        verified: true
      },
      {
        id: 'income_ceiling',
        field: 'annualIncome',
        operator: 'lte',
        value: 600000,
        severity: 'BLOCKING',
        label: 'Family Income Ceiling',
        description: 'Total annual family income from all sources must not exceed ₹6,00,000.',
        source: 'MoTA NFST Scheme Guidelines Section 4.2',
        verified: true
      },
      {
        id: 'age_limit',
        field: 'age',
        operator: 'lte',
        value: 36,
        severity: 'BLOCKING',
        label: 'Maximum Age Limit',
        description: 'Maximum age limit is 36 years as of cutoff date, with +5 years affirmative relaxation for PVTG and PwD.',
        source: 'MoTA NFST Guidelines (Revised Edition)',
        verified: true,
        relaxations: [
          {
            condition: { field: 'pvtg', operator: 'eq', value: true },
            modifier: 5,
            label: '+5 years age relaxation for Particularly Vulnerable Tribal Group (PVTG) scholars',
            source: 'MoTA Affirmative Inclusion Norms',
            verified: true
          },
          {
            condition: { field: 'pwd', operator: 'eq', value: true },
            modifier: 5,
            label: '+5 years age relaxation for Divyangjan (Persons with Benchmark Disabilities)',
            source: 'RPwD Act 2016 / MoTA Guidelines',
            verified: true
          }
        ]
      },
      {
        id: 'qualifying_marks',
        field: 'pgMarks',
        operator: 'gte',
        value: 55,
        severity: 'BLOCKING',
        label: 'Minimum Qualifying Marks',
        description: 'Candidate must have secured minimum 55% marks at Master degree level.',
        source: 'UGC / MoTA Research Fellowship Guidelines',
        verified: true
      },
      {
        id: 'enrolled_degree',
        field: 'degree',
        operator: 'in',
        value: ['Ph.D.', 'M.Phil', 'Integrated Ph.D.', 'Doctor of Philosophy', 'Research Scholar'],
        severity: 'ATTENTION',
        label: 'Eligible Degree Programme',
        description: 'Scholars must be enrolled in regular and full-time Ph.D. or M.Phil programmes in recognized Indian universities.',
        source: 'MoTA NFST Guidelines Section 2',
        verified: true
      }
    ],
    // Backward-compatible summary thresholds
    eligibility: {
      minMarks: 55,
      maxAge: 36,
      maxIncome: 600000,
      degrees: ['Ph.D.', 'M.Phil', 'Integrated Ph.D.'],
      mandatoryTest: 'UGC-NET / CSIR-NET / GATE or Institutional Entrance'
    },
    workflow: [
      'Application Submission',
      'AI Pre-Verification',
      'Institute Verification',
      'Ministry Scrutiny Desk',
      'Selection Committee Review',
      'Sanction Order & DBT Active'
    ]
  },
  {
    id: 'NOS',
    name: 'National Overseas Scholarship for ST Students',
    shortName: 'NOS',
    category: 'International Higher Education (Masters & Ph.D.)',
    description: 'Financial support to meritorious ST students for pursuing Master level courses and Ph.D. abroad in accredited overseas universities ranked within QS Top 1,000.',
    totalSlots: 20,           // 17 ST + 3 PVTG | source: tribal.nic.in | verified: true
    stSlots: 17,
    pvtgSlots: 3,             // source: tribal.nic.in | verified: true
    womenEarmarked: 6,        // 30% horizontal earmarking for women | verified: true
    filledSlots: 18,
    annualBudgetCr: 18.5,
    stipendAnnualGbp: 9900,
    stipendAnnualUsd: 15400,
    tuitionCoverage: '100% Actuals',
    guidelineReference: 'MoTA NOS Scheme Guidelines — tribal.nic.in/ScholarshiP.aspx',
    selectionMethod: {
      type: 'OVERSEAS_RANK_AND_COMMITTEE',
      description: 'Unconditional admission in QS World Top 1,000 university (prioritizing top 200) + academic appraisal by National Selection Committee with 3 dedicated PVTG seats.',
      source: 'MoTA NOS Scheme Guidelines (Section 3.2)',
      verified: true
    },
    quotaRules: {
      stFemaleHorizontal: 30, // 30% horizontal reservation (6 seats minimum)
      pvtgPrioritySlots: 3,   // 3 dedicated PVTG slots out of 20
      pwdReservation: 5
    },
    validityRules: {
      incomeCertificate: {
        requiresCurrentFY: true,
        maxAgeMonths: 12,
        label: 'Income Certificate must be valid for current FY (FY 2026-27)',
        source: 'MoTA NOS Guidelines',
        verified: true
      },
      passport: {
        minValidityMonths: 6,
        label: 'Indian Passport must have at least 6 months validity remaining',
        source: 'Ministry of External Affairs Passport Rules',
        verified: true
      }
    },
    requiredDocuments: [
      {
        type: 'st_certificate',
        label: 'ST Caste Certificate',
        mandatory: true,
        issuingAuthorities: ['Sub-Divisional Officer (SDO)', 'Tehsildar', 'District Magistrate'],
        description: 'ST Caste Certificate with Central Government ST list mapping under Article 342.'
      },
      {
        type: 'income_certificate',
        label: 'Family Income Certificate',
        mandatory: true,
        issuingAuthorities: ['Tehsildar', 'Sub-Divisional Magistrate', 'Revenue Authority'],
        description: 'Income Certificate or ITR showing total family income ≤ ₹6,00,000 for FY 2026-27.'
      },
      {
        type: 'admission_letter',
        label: 'Unconditional Overseas Offer Letter',
        mandatory: true,
        issuingAuthorities: ['Host Foreign University Admissions'],
        description: 'Unconditional offer letter of admission from a QS World Top 1,000 accredited foreign university.'
      },
      {
        type: 'passport',
        label: 'Valid Indian Passport',
        mandatory: true,
        issuingAuthorities: ['Regional Passport Office (MEA)'],
        description: 'Current valid Indian Passport for international travel and visa processing.'
      },
      {
        type: 'language_scorecard',
        label: 'English Proficiency Scorecard (IELTS / TOEFL / PTE)',
        mandatory: false,
        issuingAuthorities: ['British Council / IDP / ETS / Pearson'],
        description: 'Language proficiency test scorecard meeting university admission threshold.'
      },
      {
        type: 'marksheet',
        label: 'Qualifying Degree Marksheet & Degree Certificate',
        mandatory: true,
        issuingAuthorities: ['Indian University Registrar'],
        description: 'Bachelor degree marksheet for Master applicants, Master degree marksheet for Ph.D. applicants.'
      }
    ],
    // Deterministic Statutory Eligibility Rules
    rules: [
      {
        id: 'st_status',
        field: 'isSt',
        operator: 'eq',
        value: true,
        severity: 'BLOCKING',
        label: 'Scheduled Tribe Community Verification',
        description: 'Candidate must belong to a Scheduled Tribe notified under Article 342 of the Constitution of India.',
        source: 'Constitution of India Article 342',
        verified: true
      },
      {
        id: 'income_ceiling',
        field: 'annualIncome',
        operator: 'lte',
        // CORRECTION: NOS-ST income ceiling is ₹6,00,000 (NOT ₹8L).
        // ₹8L was from the Social Justice Ministry's NOS for SC/OBC.
        value: 600000,
        severity: 'BLOCKING',
        label: 'Family Income Ceiling',
        description: 'Total annual family income must not exceed ₹6,00,000 from all sources.',
        source: 'tribal.nic.in/ScholarshiP.aspx & pib.gov.in',
        verified: true
      },
      {
        id: 'age_limit',
        field: 'age',
        operator: 'lte',
        value: 35,
        severity: 'BLOCKING',
        label: 'Maximum Age Limit (Ph.D.)',
        description: 'Maximum age is 35 years as of 1 July of the selection year for Ph.D. applicants (32 years for Masters).',
        source: 'tribal.nic.in NOS Guidelines',
        verified: true,
        relaxations: [
          {
            condition: { field: 'pvtg', operator: 'eq', value: true },
            modifier: 5,
            label: '+5 years age relaxation for PVTG scholars (provisional)',
            source: 'MoTA Affirmative Inclusion guidelines',
            verified: false // Unconfirmed whether +5 yrs applies universally to NOS
          }
        ]
      },
      {
        id: 'qs_world_rank',
        field: 'qsWorldRank',
        operator: 'lte',
        value: 1000,
        severity: 'BLOCKING',
        label: 'QS World University Ranking',
        description: 'Host overseas institution must be ranked within Top 1,000 in the latest QS World University Rankings.',
        source: 'overseas.tribal.gov.in / tribal.nic.in 2024-25 guidelines',
        verified: true
      },
      {
        id: 'qualifying_marks',
        field: 'pgMarks',
        operator: 'gte',
        value: 55,
        severity: 'ATTENTION',
        label: 'Minimum Qualifying Marks (Waived if Top 1000 Admitted)',
        description: 'Requires ≥ 55% marks, but waived under guidelines if candidate holds confirmed admission in a QS Top 1,000 institution.',
        source: 'MoTA NOS Scheme Guidelines Section 3.2',
        verified: true
      },
      {
        id: 'enrolled_degree',
        field: 'degree',
        operator: 'in',
        value: ['Master of Science', 'Ph.D. Abroad', 'Master of Engineering', 'Master of Public Policy', 'Master', 'Ph.D.', 'Post-Doctoral'],
        severity: 'ATTENTION',
        label: 'Overseas Degree Programme',
        description: 'Eligible for Master level courses, Ph.D., and Post-Doctoral studies in accredited institutions abroad.',
        source: 'MoTA NOS Guidelines Section 3.1',
        verified: true
      }
    ],
    eligibility: {
      minMarks: 55,
      maxAge: 35,
      maxIncome: 600000,
      degrees: ['Master of Science', 'Ph.D. Abroad', 'Master of Engineering', 'Master of Public Policy'],
      universityRankMax: 1000,
      priorityRankMax: 200,
      languageTest: 'IELTS (>= 6.5) / TOEFL (>= 90) / GRE'
    },
    workflow: [
      'Application Submission',
      'AI Pre-Verification',
      'Overseas Division Scrutiny',
      'Selection Committee Review',
      'Award Sanction & Forex Disbursement'
    ]
  },
  {
    id: 'TOP_CLASS',
    name: 'Top Class Education for ST Students',
    shortName: 'Top Class ST',
    category: 'Undergraduate / Professional Courses in Notified Institutes',
    description: 'Encourages ST scholars to join premier institutions (IITs, IIMs, NITs, AIIMS, NLUs, NIDs) by providing 100% tuition fees, living allowances, and IT grants.',
    totalSlots: 1000,
    filledSlots: 940,
    annualBudgetCr: 65.0,
    livingAllowanceMonthly: 2220,
    booksGrantAnnual: 3000,
    computerAllowanceOneTime: 45000,
    tuitionCoverage: '100% Tuition Fees',
    guidelineReference: 'Top Class Scheme Guidelines for Notified Premier Institutes — tribal.nic.in',
    selectionMethod: {
      type: 'INSTITUTE_QUOTA_ENTRANCE_RANK',
      description: 'Direct institutional quota allocation based on entrance examination ranking (JEE Adv, NEET, CAT, CLAT).',
      source: 'MoTA Top Class Scheme Guidelines',
      verified: true
    },
    quotaRules: {
      stFemaleHorizontal: 30,
      pvtgPrioritySlots: 75,
      pwdReservation: 5
    },
    validityRules: {
      incomeCertificate: {
        requiresCurrentFY: true,
        maxAgeMonths: 12,
        label: 'Income Certificate must be valid for FY 2026-27',
        source: 'MoTA Top Class Guidelines',
        verified: true
      }
    },
    requiredDocuments: [
      {
        type: 'st_certificate',
        label: 'ST Caste Certificate',
        mandatory: true,
        issuingAuthorities: ['SDO', 'Tehsildar', 'State Caste Scrutiny Committee'],
        description: 'ST Caste Certificate issued under Article 342.'
      },
      {
        type: 'income_certificate',
        label: 'Family Income Certificate',
        mandatory: true,
        issuingAuthorities: ['Tehsildar', 'Circle Officer', 'SDO'],
        description: 'Family Income Certificate verifying income ≤ ₹6,00,000 for FY 2026-27.'
      },
      {
        type: 'admission_letter',
        label: 'Entrance Exam Allotment Letter & Institute Admission Proof',
        mandatory: true,
        issuingAuthorities: ['JoSAA / NTA / MCC / CLAT / Notified Institute Registrar'],
        description: 'Allotment letter (JEE Adv / NEET / CAT / CLAT) confirming admission to notified institute.'
      },
      {
        type: 'fee_receipt',
        label: 'Institute Admission Fee Receipt',
        mandatory: true,
        issuingAuthorities: ['Notified Institute Finance Office'],
        description: 'Receipt of non-refundable tuition and institutional fees paid.'
      },
      {
        type: 'aadhaar_card',
        label: 'Aadhaar Identity Proof',
        mandatory: true,
        issuingAuthorities: ['UIDAI'],
        description: 'Aadhaar card linked to bank account seeded via NPCI APB.'
      }
    ],
    rules: [
      {
        id: 'st_status',
        field: 'isSt',
        operator: 'eq',
        value: true,
        severity: 'BLOCKING',
        label: 'Scheduled Tribe Community Verification',
        description: 'Candidate must belong to a Scheduled Tribe notified under Article 342.',
        source: 'Constitution of India Article 342',
        verified: true
      },
      {
        id: 'income_ceiling',
        field: 'annualIncome',
        operator: 'lte',
        value: 600000,
        severity: 'BLOCKING',
        label: 'Family Income Ceiling',
        description: 'Total annual family income from all sources must not exceed ₹6,00,000.',
        source: 'MoTA Top Class Scheme Guidelines Section 4',
        verified: true
      },
      {
        id: 'age_limit',
        field: 'age',
        operator: 'lte',
        value: 30,
        severity: 'BLOCKING',
        label: 'Maximum Age Limit',
        description: 'Candidate must be ≤ 30 years of age at the time of admission.',
        source: 'Top Class ST Guidelines',
        verified: true,
        relaxations: [
          {
            condition: { field: 'pvtg', operator: 'eq', value: true },
            modifier: 5,
            label: '+5 years age relaxation for PVTG scholars',
            source: 'MoTA Affirmative Inclusion guidelines',
            verified: false // Unconfirmed exact relaxation clause
          }
        ]
      },
      {
        id: 'qualifying_marks',
        field: 'pgMarks',
        operator: 'gte',
        value: 50,
        severity: 'BLOCKING',
        label: 'Minimum Qualifying Exam Marks',
        description: 'Candidate must have secured ≥ 50% marks in Class XII or qualifying examination.',
        source: 'Top Class ST Guidelines',
        verified: true
      },
      {
        id: 'notified_degree',
        field: 'degree',
        operator: 'in',
        value: ['B.Tech', 'MBBS', 'MBA', 'B.Des', 'B.A. LL.B', 'Integrated M.Tech', 'B.Sc.', 'Engineering', 'Medical', 'Management', 'Law'],
        severity: 'ATTENTION',
        label: 'Approved Professional Degree',
        description: 'Course must be a regular professional or undergraduate course in a notified premier institute.',
        source: 'Top Class ST Notified Courses Schedule',
        verified: true
      }
    ],
    eligibility: {
      minMarks: 50,
      maxAge: 30,
      maxIncome: 600000,
      degrees: ['B.Tech', 'MBBS', 'MBA', 'B.Des', 'B.A. LL.B'],
      instituteTypes: ['IIT', 'IIM', 'NIT', 'AIIMS', 'NLU', 'IIIT', 'NID']
    },
    workflow: [
      'Application Submission',
      'AI Pre-Verification',
      'Institutional Registrar Verification',
      'MoTA Direct Sanction',
      'DBT to Institute & Student'
    ]
  },
  {
    id: 'PRE_MATRIC',
    name: 'Pre-Matric Scholarship Scheme for ST Students',
    shortName: 'Pre-Matric ST',
    category: 'Secondary School Education (Classes IX & X)',
    description: 'Centrally sponsored scholarship scheme to support Scheduled Tribe parents in sending their children to school, minimizing dropout rates between elementary and secondary stages (Classes IX and X).',
    totalSlots: 'Universal Entitlement',
    annualBudgetCr: 412.5,
    stipendDayScholar: 225,
    stipendHosteller: 525,
    booksGrantAnnual: 750,
    guidelineReference: 'Centrally Sponsored Scheme Guidelines for Pre-Matric Scholarship to ST Students (Classes IX & X) — tribal.nic.in',
    selectionMethod: {
      type: 'UNIVERSAL_ENTITLEMENT',
      description: 'Universal entitlement for all eligible regular ST students enrolled in Classes IX & X in recognized government/aided schools.',
      source: 'Centrally Sponsored Pre-Matric ST Guidelines',
      verified: true
    },
    quotaRules: {
      stFemaleHorizontal: 30,
      pvtgPrioritySlots: '100% Saturation Guarantee',
      pwdReservation: 5
    },
    validityRules: {
      incomeCertificate: {
        requiresCurrentFY: true,
        maxAgeMonths: 12,
        label: 'Income Certificate must be valid for FY 2026-27',
        source: 'Pre-Matric ST Guidelines',
        verified: true
      }
    },
    requiredDocuments: [
      {
        type: 'st_certificate',
        label: 'ST Caste Certificate',
        mandatory: true,
        issuingAuthorities: ['Tehsildar', 'Circle Officer', 'SDO'],
        description: 'Caste Certificate issued under Article 342.'
      },
      {
        type: 'income_certificate',
        label: 'Annual Family Income Certificate',
        mandatory: true,
        issuingAuthorities: ['Tehsildar', 'Gram Panchayat Head / Revenue Inspector', 'SDO'],
        description: 'Income Certificate showing family income ≤ ₹2,50,000 per annum.'
      },
      {
        type: 'marksheet',
        label: 'Previous Class Passing Marksheet (Class VIII / IX)',
        mandatory: true,
        issuingAuthorities: ['School Headmaster / Principal'],
        description: 'Marksheet or report card showing student passed previous class.'
      },
      {
        type: 'admission_letter',
        label: 'School Bonafide & Enrolment Certificate',
        mandatory: true,
        issuingAuthorities: ['Headmaster / Principal of Recognized School'],
        description: 'Bonafide certificate confirming regular full-time enrolment in Class IX or X.'
      },
      {
        type: 'aadhaar_card',
        label: 'Aadhaar Seeded Bank Account Details',
        mandatory: true,
        issuingAuthorities: ['Bank / UIDAI'],
        description: 'Bank passbook or Aadhaar-seeded account confirmation of student or parent.'
      }
    ],
    rules: [
      {
        id: 'st_status',
        field: 'isSt',
        operator: 'eq',
        value: true,
        severity: 'BLOCKING',
        label: 'Scheduled Tribe Community Verification',
        description: 'Student must belong to a Scheduled Tribe notified under Article 342.',
        source: 'Constitution of India Article 342',
        verified: true
      },
      {
        id: 'income_ceiling',
        field: 'annualIncome',
        operator: 'lte',
        value: 250000,
        severity: 'BLOCKING',
        label: 'Family Income Ceiling',
        description: 'Annual family income must not exceed ₹2,50,000 from all sources.',
        source: 'Centrally Sponsored Pre-Matric ST Scheme Guidelines Section 3',
        verified: true
      },
      {
        id: 'age_limit',
        field: 'age',
        operator: 'lte',
        value: 18,
        severity: 'BLOCKING',
        label: 'Maximum Age Limit (Secondary School)',
        description: 'Student must be 18 years or younger at the beginning of the academic year.',
        source: 'Centrally Sponsored Pre-Matric ST Scheme Guidelines',
        verified: true
      },
      {
        id: 'qualifying_marks',
        field: 'pgMarks',
        operator: 'gte',
        value: 35,
        severity: 'BLOCKING',
        label: 'Previous Class Passing Standard',
        description: 'Student must have obtained a passing grade (≥ 35%) in Class VIII or IX.',
        source: 'Pre-Matric ST Guidelines',
        verified: true
      },
      {
        id: 'class_level',
        field: 'degree',
        operator: 'in',
        value: ['Class IX', 'Class X', 'Class 9', 'Class 10', 'Secondary School', 'IX', 'X'],
        severity: 'BLOCKING',
        label: 'Enrolled in Class IX or X',
        description: 'Student must be enrolled in Class IX or X in a recognized Government, aided, or local body school.',
        source: 'Pre-Matric ST Guidelines Section 2',
        verified: true
      }
    ],
    eligibility: {
      minMarks: 35,
      maxAge: 18,
      maxIncome: 250000,
      degrees: ['Class IX', 'Class X'],
      institutionTypes: ['Government School', 'Govt-Aided School', 'Recognized School']
    },
    workflow: [
      'School Bonafide Enrolment',
      'AI Pre-Verification',
      'District Welfare Officer Scrutiny',
      'State DBT Approval',
      'Direct Benefit Transfer to Student/Parent Bank Account'
    ]
  },
  {
    id: 'POST_MATRIC',
    name: 'Post-Matric Scholarship Scheme for ST Students',
    shortName: 'Post-Matric ST',
    category: 'Post-Secondary & Higher Education (Classes XI to Ph.D.)',
    description: 'Flagship Centrally Sponsored scheme providing financial assistance to Scheduled Tribe students studying at post-matriculation or post-secondary stage to enable them to complete their education.',
    totalSlots: 'Universal Entitlement',
    annualBudgetCr: 2180.4,
    maintenanceAllowanceMonthly: 1200,
    tuitionCoverage: '100% Compulsory Non-Refundable Fees',
    guidelineReference: 'Centrally Sponsored Scheme Guidelines for Post-Matric Scholarship to ST Students — tribal.nic.in',
    selectionMethod: {
      type: 'UNIVERSAL_ENTITLEMENT_BY_GROUP',
      description: 'Universal entitlement across 4 recognized course groups (Group 1: Professional Degree/PG; Group 2: Diplomas & Professional; Group 3: General UG/PG; Group 4: Classes XI-XII, ITI).',
      source: 'Centrally Sponsored Post-Matric ST Guidelines',
      verified: true
    },
    quotaRules: {
      stFemaleHorizontal: 30,
      pvtgPrioritySlots: '100% Saturation Guarantee',
      pwdReservation: 5
    },
    validityRules: {
      incomeCertificate: {
        requiresCurrentFY: true,
        maxAgeMonths: 12,
        label: 'Income Certificate must be valid for current FY (FY 2026-27)',
        source: 'Post-Matric ST Guidelines',
        verified: true
      }
    },
    requiredDocuments: [
      {
        type: 'st_certificate',
        label: 'ST Caste Certificate',
        mandatory: true,
        issuingAuthorities: ['Tehsildar', 'SDO', 'District Magistrate'],
        description: 'ST Caste Certificate issued under Article 342.'
      },
      {
        type: 'income_certificate',
        label: 'Annual Family Income Certificate',
        mandatory: true,
        issuingAuthorities: ['Tehsildar', 'Circle Officer', 'SDO'],
        description: 'Income Certificate showing family income ≤ ₹2,50,000 for FY 2026-27.'
      },
      {
        type: 'marksheet',
        label: 'Class X / XII / Qualifying Exam Marksheet',
        mandatory: true,
        issuingAuthorities: ['Board of Secondary/Higher Secondary Education / University'],
        description: 'Qualifying exam certificate or marksheet.'
      },
      {
        type: 'admission_letter',
        label: 'College Bonafide & Fee Structure Certificate',
        mandatory: true,
        issuingAuthorities: ['College Principal / Registrar'],
        description: 'Bonafide certificate confirming enrollment in recognized Group 1 to 4 course and break-up of compulsory fees.'
      },
      {
        type: 'aadhaar_card',
        label: 'Aadhaar Seeded Bank Account Details',
        mandatory: true,
        issuingAuthorities: ['Bank / UIDAI'],
        description: 'Aadhaar-seeded bank account for DBT maintenance and fee transfers.'
      }
    ],
    rules: [
      {
        id: 'st_status',
        field: 'isSt',
        operator: 'eq',
        value: true,
        severity: 'BLOCKING',
        label: 'Scheduled Tribe Community Verification',
        description: 'Student must belong to a Scheduled Tribe notified under Article 342.',
        source: 'Constitution of India Article 342',
        verified: true
      },
      {
        id: 'income_ceiling',
        field: 'annualIncome',
        operator: 'lte',
        value: 250000,
        severity: 'BLOCKING',
        label: 'Family Income Ceiling',
        description: 'Annual family income must not exceed ₹2,50,000 from all sources.',
        source: 'Centrally Sponsored Post-Matric ST Scheme Guidelines Section 4',
        verified: true
      },
      {
        id: 'age_limit',
        field: 'age',
        operator: 'lte',
        value: 35,
        severity: 'BLOCKING',
        label: 'Maximum Age Limit',
        description: 'Student must be 35 years or younger for regular post-matric courses.',
        source: 'Centrally Sponsored Post-Matric ST Guidelines',
        verified: true
      },
      {
        id: 'qualifying_marks',
        field: 'pgMarks',
        operator: 'gte',
        value: 40,
        severity: 'BLOCKING',
        label: 'Minimum Qualifying Exam Marks',
        description: 'Candidate must have obtained at least passing marks (≥ 40%) in the qualifying examination.',
        source: 'Post-Matric ST Guidelines',
        verified: true
      },
      {
        id: 'post_matric_level',
        field: 'degree',
        operator: 'in',
        value: [
          'Class XI', 'Class XII', 'Diploma', 'Polytechnic', 
          'B.A.', 'B.Sc.', 'B.Com', 'M.A.', 'M.Sc.', 'B.Tech', 'MBBS', 
          'B.Sc. Nursing', 'Professional Degree', 'Undergraduate', 'Postgraduate', 
          'ITI', 'B.Ed', 'LL.B', 'Ph.D.'
        ],
        severity: 'BLOCKING',
        label: 'Recognized Post-Secondary Course (Groups 1–4)',
        description: 'Course must be a recognized post-matriculation course under Ministry Course Groups 1 to 4.',
        source: 'Post-Matric ST Course Schedule Group 1-4',
        verified: true
      }
    ],
    eligibility: {
      minMarks: 40,
      maxAge: 35,
      maxIncome: 250000,
      degrees: ['Class XI', 'Class XII', 'Diploma', 'Polytechnic', 'B.A.', 'B.Sc.', 'B.Com', 'M.A.', 'M.Sc.', 'B.Tech', 'MBBS', 'Professional Degree'],
      courseGroups: ['Group 1 (Professional Degree/PG)', 'Group 2 (Diplomas & Other Professional)', 'Group 3 (General UG/PG)', 'Group 4 (Classes XI-XII, ITI)']
    },
    workflow: [
      'Student Online Registration',
      'AI Pre-Verification',
      'Institutional Nodal Officer Verification',
      'District Welfare Scrutiny',
      'State / MoTA DBT Disbursal'
    ]
  }
];
