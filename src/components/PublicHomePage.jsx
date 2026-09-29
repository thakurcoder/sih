import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Landmark, 
  Globe2, 
  Award, 
  FileText, 
  Clock, 
  Coins, 
  ChevronRight, 
  AlertCircle, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  ExternalLink,
  Users,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
  Layers,
  TrendingUp,
  Volume2,
  Languages
} from 'lucide-react';
import { INITIAL_SCHEMES, TRIBAL_COMMUNITIES } from '../data/mockData';
import { SchemeRuleEngine } from '../services/ruleEngine';
import { I18N } from '../data/i18n';

export function PublicHomePage({ 
  onOpenLogin, 
  onOpenRegister, 
  onLaunchGoldenDemo,
  onLaunchOfficerDemo,
  lang = 'en',
  setLang,
  contrast = false,
  setContrast,
  textSize = 'normal',
  setTextSize,
  lowBandwidth = false,
  setLowBandwidth
}) {
  const t = I18N[lang] || I18N.en;
  const [activeSchemeTab, setActiveSchemeTab] = useState('NFST');
  
  // Quick Eligibility Checker State
  const [checkQualification, setCheckQualification] = useState('pg');
  const [checkIncome, setCheckIncome] = useState(450000);
  const [checkAge, setCheckAge] = useState(26);
  const [checkTarget, setCheckTarget] = useState('india_phd');
  const [checkTribe, setCheckTribe] = useState('Santhal');
  const [checkResult, setCheckResult] = useState(null);
  const [whyDetails, setWhyDetails] = useState(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Handle Eligibility Check via unified SchemeRuleEngine
  const handleRunEligibilityCheck = () => {
    const selectedTribeObj = TRIBAL_COMMUNITIES.find(t => t.name === checkTribe);
    const isPvtg = selectedTribeObj?.pvtg || false;

    // Build candidate representation for the generic engine
    let degreeLabel = 'Ph.D. in Rural Development';
    if (checkQualification === 'ug') degreeLabel = 'B.Tech';
    else if (checkQualification === 'class12') degreeLabel = 'Class XII';
    else if (checkQualification === 'school') degreeLabel = 'Class X';

    const candidate = {
      qualification: checkQualification,
      degree: degreeLabel,
      annualIncome: Number(checkIncome),
      age: Number(checkAge),
      isSt: true,
      tribe: checkTribe,
      pvtg: isPvtg,
      pgMarks: 65, // Standard passing baseline for pre-checker
      qsWorldRank: checkTarget === 'abroad' ? 120 : 9999,
      target: checkTarget
    };

    // Evaluate all schemes using the single source of truth rule engine
    const evaluations = SchemeRuleEngine.evaluateAll(candidate, INITIAL_SCHEMES);

    const matches = [];

    for (const ev of evaluations) {
      const scheme = INITIAL_SCHEMES.find(s => s.id === ev.schemeId);
      if (!scheme) continue;

      // Filter by target higher education / program destination if not 'any'
      let targetMatches = true;
      if (checkTarget === 'india_phd') targetMatches = scheme.id === 'NFST';
      else if (checkTarget === 'abroad') targetMatches = scheme.id === 'NOS';
      else if (checkTarget === 'premier_institute') targetMatches = scheme.id === 'TOP_CLASS';
      else if (checkTarget === 'school') targetMatches = scheme.id === 'PRE_MATRIC';
      else if (checkTarget === 'college_ug') targetMatches = scheme.id === 'POST_MATRIC';

      if (targetMatches && (ev.status === 'ELIGIBLE' || ev.status === 'POTENTIALLY_ELIGIBLE')) {
        let stipendText = 'Direct DBT Scholarship';
        if (scheme.stipendJrf) stipendText = `₹${scheme.stipendJrf.toLocaleString('en-IN')} – ₹${scheme.stipendSrf.toLocaleString('en-IN')} / mo + contingency`;
        else if (scheme.stipendAnnualGbp) stipendText = `100% Tuition Fees + £${scheme.stipendAnnualGbp}/yr living grant`;
        else if (scheme.livingAllowanceMonthly) stipendText = `100% Tuition + ₹${scheme.livingAllowanceMonthly}/mo living assistance`;
        else if (scheme.maintenanceAllowanceMonthly) stipendText = `100% Tuition + ₹${scheme.maintenanceAllowanceMonthly}/mo maintenance`;
        else if (scheme.stipendDayScholar) stipendText = `Day Scholar ₹${scheme.stipendDayScholar}/mo, Hosteller ₹${scheme.stipendHosteller}/mo`;

        let locationText = 'Recognized Institutions';
        if (scheme.id === 'NFST') locationText = 'Indian Universities & Research Institutes (Ph.D. / M.Phil)';
        else if (scheme.id === 'NOS') locationText = 'QS World Top 1,000 Overseas Universities (Masters / Ph.D.)';
        else if (scheme.id === 'TOP_CLASS') locationText = 'Notified Premier Institutes (IITs, IIMs, NITs, AIIMS, NLUs)';
        else if (scheme.id === 'PRE_MATRIC') locationText = 'Classes IX & X in Recognized Government / Aided Schools';
        else if (scheme.id === 'POST_MATRIC') locationText = 'Classes XI to PG / Professional (Groups 1–4 Recognized Courses)';

        matches.push({
          schemeId: scheme.id,
          name: scheme.name,
          stipend: stipendText,
          location: locationText,
          status: ev.status === 'ELIGIBLE' ? 'Highly Eligible (100% Statutory Criteria Matched)' : 'Potentially Eligible (Review Criteria)',
          pvtgBonus: isPvtg ? '★ Dedicated PVTG Affirmative Priority Active' : null,
          evaluation: ev,
          scheme
        });
      }
    }

    setCheckResult({
      matches,
      tribe: checkTribe,
      isPvtg,
      evaluations,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const FAQS = [
    {
      q: 'What is the National Fellowship for Scheduled Tribe Students (NFST)?',
      a: 'NFST is a flagship Central Sector scheme of the Ministry of Tribal Affairs providing 750 annual fellowships for Scheduled Tribe scholars pursuing regular and full-time M.Phil. and Ph.D. degrees in Indian universities. Fellowship amounts are ₹37,000/mo (JRF) and ₹42,000/mo (SRF) plus HRA and annual contingency grants of ₹20,500.'
    },
    {
      q: 'What are the eligibility guidelines for the National Overseas Scholarship (NOS)?',
      a: 'ST candidates must have secured unconditional admission to a university ranked within the QS World Top 500 for Master or Ph.D. programs. Total family income from all sources must not exceed ₹8,000,000 per annum, and the applicant must be 35 years or younger as of the cutoff date.'
    },
    {
      q: 'How does VidyaSetu handle document verification and deficiencies?',
      a: 'VidyaSetu uses automated AI OCR (MoTA-Vision ST v2.4) to match uploaded certificates against the Central ST Gazette. If any defect is detected (e.g. an income certificate older than 1 year), the applicant receives an immediate SMS/Email alert with a 15-day resolution window, preserving their original application queue seniority.'
    },
    {
      q: 'Is Aadhaar mandatory and how are fellowship stipends disbursed?',
      a: 'Yes, per Direct Benefit Transfer (DBT) guidelines, applicants must have an Aadhaar-seeded bank account linked through the NPCI Aadhaar Payment Bridge (APB). Monthly stipends are automatically disbursed via the Public Financial Management System (PFMS) upon guide endorsement of Quarterly Progress Reports (QPR).'
    },
    {
      q: 'What special provisions exist for Particularly Vulnerable Tribal Groups (PVTG)?',
      a: '75 notified PVTG communities (e.g., Birhor, Chenchu, Baiga, Sahariya, Toda) receive affirmative priority, including +10 equity points in the explainable merit ranking and 50 dedicated reserved slots under NFST and 3 slots under NOS.'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans ${contrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-800'}`}>
      {/* 1. National Tricolor Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

      {/* 2. Official Government of India Header Bar */}
      <div className={`border-b text-xs px-4 py-2 flex flex-wrap items-center justify-between ${contrast ? 'bg-zinc-950 border-zinc-800 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wider uppercase text-[11px]">{t.govtOfIndia}</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline font-medium">{t.ministry}</span>
        </div>

        {/* Accessibility & Quick Controls */}
        <div className="flex items-center space-x-3 text-[11px]">
          {/* Language Selector */}
          <div className="flex items-center space-x-1.5 border border-slate-300 rounded px-2 py-0.5 bg-white text-slate-700 shadow-2xs">
            <Languages className="w-3.5 h-3.5 text-blue-900 shrink-0" />
            <select
              value={lang}
              onChange={(e) => setLang && setLang(e.target.value)}
              className="bg-transparent font-bold text-xs text-blue-950 focus:outline-none cursor-pointer"
              title="Select Language / भाषा चुनें"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="or">ଓଡ଼ିଆ (Odia)</option>
              <option value="sat">संताली / ᱥᱟᱱᱛᱟᱲᱤ (Santhali)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
            <span className="text-[10px] text-slate-400 font-bold">Text:</span>
            <button 
              onClick={() => setTextSize && setTextSize('normal')} 
              className={`px-1 rounded font-bold ${textSize === 'normal' ? 'bg-blue-900 text-white' : 'hover:bg-slate-200'}`}
            >
              A
            </button>
            <button 
              onClick={() => setTextSize && setTextSize('large')} 
              className={`px-1 rounded font-bold text-xs ${textSize === 'large' ? 'bg-blue-900 text-white' : 'hover:bg-slate-200'}`}
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setContrast && setContrast(!contrast)}
            className="hover:underline font-semibold"
          >
            {contrast ? 'Standard View' : t.highContrast}
          </button>

          <span className="text-slate-300">|</span>

          <button
            onClick={() => setLowBandwidth && setLowBandwidth(!lowBandwidth)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${lowBandwidth ? 'bg-amber-400 text-blue-950' : 'bg-slate-200 text-slate-700'}`}
          >
            {lowBandwidth ? '⚡ 2G Active' : '2G Mode'}
          </button>
        </div>
      </div>

      {/* 3. Main Navigation Bar with MoTA Seal and CTAs */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-md shadow-xs ${contrast ? 'bg-black/95 border-yellow-500' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo & National Emblem */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex flex-col items-center justify-center shadow-md border-2 border-amber-400">
              <span className="text-[8px] font-serif font-black tracking-tight text-amber-300 uppercase">सत्यमेव</span>
              <span className="text-[7px] font-serif font-black tracking-tight text-amber-300 uppercase">जयते</span>
              <div className="w-4 h-0.5 bg-amber-400 my-0.5"></div>
              <span className="text-[7px] text-blue-200 font-bold">MoTA</span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black font-serif tracking-tight text-blue-950 leading-none">
                  विद्यासेतु <span className="text-orange-600 font-sans text-lg font-extrabold">{t.portalTitle}</span>
                </h1>
                <span className="hidden md:inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  National Portal
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Nav Links & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <a 
              href="#schemes" 
              className="hidden lg:inline-block text-xs font-bold text-slate-700 hover:text-blue-900 px-3 py-2"
            >
              {t.schemesNav}
            </a>
            <a 
              href="#eligibility" 
              className="hidden lg:inline-block text-xs font-bold text-slate-700 hover:text-blue-900 px-3 py-2"
            >
              {t.eligibilityNav}
            </a>
            <a 
              href="#governance" 
              className="hidden lg:inline-block text-xs font-bold text-slate-700 hover:text-blue-900 px-3 py-2"
            >
              {t.governanceNav}
            </a>

            {/* Primary Action Buttons */}
            <button
              onClick={() => onOpenRegister && onOpenRegister()}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t.newRegistration}</span>
            </button>

            <button
              onClick={() => onOpenLogin && onOpenLogin('student')}
              className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
            >
              <span>{t.studentLogin}</span>
            </button>

            <button
              onClick={() => onOpenLogin && onOpenLogin('admin')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
              title="Official Portal for Ministry Scrutiny, Merit Ranking, and PFMS DBT"
            >
              <ShieldCheck className="w-4 h-4 text-blue-900" />
              <span className="font-bold">{t.officialPortal}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Live Official Ticker */}
      <div className="bg-blue-950 text-white text-xs px-4 py-2 border-b border-blue-900 flex items-center">
        <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase tracking-wider text-[11px] shrink-0 mr-3">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{t.circulars}:</span>
        </div>
        <div className="overflow-x-auto whitespace-nowrap text-xs text-blue-100 flex items-center space-x-6 py-0.5">
          <span className="hover:text-amber-300 cursor-pointer">
            📜 <strong>NFST 2026-27:</strong> Research Fellowship Applications Open for ST Scholars across Indian Universities
          </span>
          <span className="text-blue-400">•</span>
          <span className="hover:text-amber-300 cursor-pointer">
            🌍 <strong>NOS 2026:</strong> Selection Committee publishes first tranche for QS Top 500 Scholars
          </span>
          <span className="text-blue-400">•</span>
          <span className="hover:text-amber-300 cursor-pointer">
            💳 <strong>DBT Mandate:</strong> Ensure Aadhaar Payment Bridge (APB) is seeded with student bank accounts for seamless stipend disbursal
          </span>
        </div>
      </div>

      {/* 5. Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white py-14 sm:py-20 px-4 sm:px-6">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.ministry} • Higher Education & Research</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif leading-tight">
              {t.heroHeadline}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              {t.heroDesc}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onLaunchGoldenDemo ? onLaunchGoldenDemo() : (onOpenRegister && onOpenRegister())}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-blue-950 font-black rounded-2xl shadow-xl transition flex items-center space-x-2 text-sm ring-2 ring-amber-300 cursor-pointer"
              >
                <span>🚀 Run 7-Minute Golden Demo (Birsa Hemrom)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLaunchOfficerDemo ? onLaunchOfficerDemo() : (onOpenLogin && onOpenLogin('admin'))}
                className="px-5 py-3 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-2xl shadow-xl transition flex items-center space-x-2 text-sm border border-blue-400/40 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>🛡️ Ministry Officer Scrutiny Login</span>
              </button>

              <a
                href="#eligibility"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition flex items-center space-x-2 text-sm"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>{t.checkEligibility30s}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300 border-t border-blue-800/60">
              <span className="flex items-center space-x-1.5" title="Operating with sandbox simulator adapters">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>DigiLocker & Jan Parichay Adapters (Sandbox)</span>
              </span>
              <span className="flex items-center space-x-1.5" title="Public Financial Management System e-FTO adapter">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>PFMS DBT & NPCI APB Adapters (Sandbox)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Explainable Decision Record (RTI-Friendly Traceability)</span>
              </span>
            </div>
          </div>

          {/* Hero Right: Official MoTA DBT Reporting & Prototype Dataset Snapshot */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold flex items-center space-x-1.5">
                    <span>🏛️ Official MoTA DBT Portal Reporting</span>
                  </div>
                  <div className="text-base font-black text-white">Government Scholarship Scale</div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  FY 2025–26 Data
                </span>
              </div>

              {/* Official DBT numbers */}
              <div className="grid grid-cols-2 gap-2.5 text-left">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-black text-white font-mono">28,99,699</div>
                  <div className="text-[11px] text-slate-300 font-medium">Pre-Matric ST Scholars</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">₹412.5 Cr Disbursed</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-black text-white font-mono">65,42,207</div>
                  <div className="text-[11px] text-slate-300 font-medium">Post-Matric ST Scholars</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">₹2,180.4 Cr Disbursed</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-black text-amber-300 font-mono">750 Slots</div>
                  <div className="text-[11px] text-slate-300 font-medium">NFST Research Fellows</div>
                  <div className="text-[10px] text-amber-400 font-semibold mt-0.5">₹37,000–₹42,000/mo</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl font-black text-purple-300 font-mono">1,020 Slots</div>
                  <div className="text-[11px] text-slate-300 font-medium">NOS & Top Class ST</div>
                  <div className="text-[10px] text-purple-400 font-semibold mt-0.5">100% Tuition Fees</div>
                </div>
              </div>

              {/* Attribution */}
              <div className="text-[10px] text-slate-400 flex items-center justify-between px-1">
                <span>Source: Official DBT Bharat Portal Reporting</span>
                <span className="text-slate-300 font-mono">dbtbharat.gov.in</span>
              </div>

              {/* Prototype Dataset Callout */}
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center justify-between text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>VidyaSetu Prototype Demo Intake Pool:</span>
                  </span>
                  <span className="bg-amber-400/20 text-amber-300 px-2 py-0.2 rounded font-mono font-bold">12,842 Records</span>
                </div>
                <p className="text-[10px] text-amber-200/90 leading-tight">
                  Synthetic test pool used to demonstrate AI document pre-scrutiny, triage queues, and policy simulations without live PII exposure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Flagship Schemes Directory */}
      <section id="schemes" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-blue-900" />
            <span>{t.ministry}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900">
            {t.flagshipSchemes}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comprehensive financial assistance covering research in premier domestic institutions, world-class overseas universities, and notified professional colleges.
          </p>
        </div>

        {/* Scheme Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {INITIAL_SCHEMES.map(scheme => (
            <button
              key={scheme.id}
              onClick={() => setActiveSchemeTab(scheme.id)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center space-x-2 ${
                activeSchemeTab === scheme.id
                  ? 'bg-blue-950 text-white shadow-lg shadow-blue-950/20'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{scheme.shortName}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeSchemeTab === scheme.id ? 'bg-amber-400 text-blue-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {typeof scheme.totalSlots === 'number' ? `${scheme.totalSlots} Slots` : 'Entitlement'}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Scheme Deep-Dive Card */}
        {(() => {
          const scheme = INITIAL_SCHEMES.find(s => s.id === activeSchemeTab) || INITIAL_SCHEMES[0];
          return (
            <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in duration-200">
              {/* Scheme Left Summary */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                <div>
                  <div className="text-xs font-bold text-orange-600 uppercase tracking-wide">{scheme.category}</div>
                  <h3 className="text-xl sm:text-2xl font-black font-serif text-blue-950 mt-1">{scheme.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{scheme.description}</p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200">
                    <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Monthly Stipend</div>
                    <div className="text-base font-black text-blue-950 mt-0.5">
                      {scheme.stipendJrf ? `₹${scheme.stipendJrf.toLocaleString('en-IN')}/mo` :
                       (scheme.stipendAnnualGbp ? `£${scheme.stipendAnnualGbp}/yr` :
                       (scheme.stipendDayScholar ? `₹${scheme.stipendDayScholar} - ₹${scheme.stipendHosteller}/mo` :
                       (scheme.maintenanceAllowanceMonthly ? `₹${scheme.maintenanceAllowanceMonthly}/mo` :
                       `₹${scheme.livingAllowanceMonthly}/mo`)))}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {scheme.stipendSrf ? `SRF: ₹${scheme.stipendSrf.toLocaleString('en-IN')}/mo` :
                       (scheme.stipendDayScholar ? 'Day Scholar / Hosteller' :
                       (scheme.maintenanceAllowanceMonthly ? 'Group 1-4 Maintenance' : 'Direct DBT Disbursal'))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Tuition / Contingency</div>
                    <div className="text-base font-black text-emerald-950 mt-0.5">
                      {scheme.contingencyAnnual ? `₹${scheme.contingencyAnnual.toLocaleString('en-IN')}/yr` :
                       (scheme.booksGrantAnnual ? `Books: ₹${scheme.booksGrantAnnual}/yr` :
                       (scheme.tuitionCoverage || '100% Actuals'))}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {scheme.contingencyAnnual ? 'Annual Contingency Grant' :
                       (scheme.booksGrantAnnual ? 'Annual Books & Ad-hoc Grant' : 'Full Tuition & Institutional Fees')}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
                    <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Quota / Slots</div>
                    <div className="text-base font-black text-amber-950 mt-0.5">
                      {typeof scheme.totalSlots === 'number' ? `${scheme.totalSlots} Scholars` : scheme.totalSlots}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {typeof scheme.totalSlots === 'number' ? '30% Women & PVTG Priority' : 'All Eligible ST Students'}
                    </div>
                  </div>
                </div>

                {/* Eligibility Checklist */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Statutory Eligibility Thresholds</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">Qualifying Marks:</span>
                      <span className="font-bold text-slate-900">≥ {scheme.eligibility.minMarks}% in qualifying examination</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">Income Ceiling:</span>
                      <span className="font-bold text-slate-900">≤ ₹{(scheme.eligibility.maxIncome / 100000).toFixed(1)} Lakhs / yr</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">Age Limit:</span>
                      <span className="font-bold text-slate-900">≤ {scheme.eligibility.maxAge} Years</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">Affirmative Quotas:</span>
                      <span className="font-bold text-blue-900">PVTG Priority & 30% Women</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => onOpenRegister && onOpenRegister()}
                    className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-2"
                  >
                    <span>Apply for {scheme.shortName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenLogin && onOpenLogin('student')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold rounded-xl text-xs transition"
                  >
                    Already Registered? Sign In
                  </button>
                </div>
              </div>

              {/* Scheme Right: Required Documents & Timeline */}
              <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-slate-200 space-y-5">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-blue-900" />
                  <span>Mandatory Documents (DigiLocker Synced)</span>
                </div>

                <div className="space-y-2">
                  {scheme.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        ✓
                      </div>
                      <span className="leading-snug">{doc}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-blue-900 text-white space-y-2">
                  <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Application Cycle 2026-27</span>
                  </div>
                  <p className="text-[11px] text-blue-100 leading-relaxed">
                    Applications undergo continuous intake triage. Once submitted, pre-screening and OCR verification execute automatically within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 7. Interactive 30-Second Quick Eligibility Pre-Checker Widget */}
      <section id="eligibility" className="py-16 px-4 sm:px-6 bg-slate-100 border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Instant AI Pre-Verification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900">
              Check Your Eligibility in 30 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Select your academic and demographic profile below to calculate which Ministry of Tribal Affairs fellowships you qualify for before registering.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Field 1: Qualification */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Highest Qualification</label>
                <select
                  value={checkQualification}
                  onChange={(e) => setCheckQualification(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="pg">Post-Graduation (Master's / M.Sc. / M.A.)</option>
                  <option value="ug">Under-Graduation (B.Tech / MBBS / B.A. / B.Sc.)</option>
                  <option value="class12">Higher Secondary / Diploma / ITI (Classes XI & XII)</option>
                  <option value="school">Secondary School (Classes IX & X)</option>
                </select>
              </div>

              {/* Field 2: Annual Family Income */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Annual Family Income: <span className="font-mono text-blue-900">₹{(checkIncome / 100000).toFixed(2)} Lakhs</span>
                </label>
                <input
                  type="range"
                  min="50000"
                  max="1200000"
                  step="25000"
                  value={checkIncome}
                  onChange={(e) => setCheckIncome(Number(e.target.value))}
                  className="w-full accent-blue-900 mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹0.5L</span>
                  <span className="font-bold text-slate-600">₹2.5L (Pre/Post)</span>
                  <span className="font-bold text-slate-600">₹6.0L (NFST)</span>
                  <span className="font-bold text-slate-600">₹8.0L (NOS)</span>
                  <span>₹12.0L</span>
                </div>
              </div>

              {/* Field 3: Applicant Age */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Current Age</label>
                <input
                  type="number"
                  min="12"
                  max="45"
                  value={checkAge}
                  onChange={(e) => setCheckAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold font-mono text-slate-800 bg-slate-50"
                />
              </div>

              {/* Field 4: Target Higher Education */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Proposed Level / Destination</label>
                <select
                  value={checkTarget}
                  onChange={(e) => setCheckTarget(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="india_phd">Ph.D. / M.Phil in India (Central/State Univ. - NFST)</option>
                  <option value="abroad">Master's or Ph.D. Abroad (QS Top 500 - NOS)</option>
                  <option value="premier_institute">IIT / IIM / NIT / AIIMS / NLU (Top Class ST)</option>
                  <option value="college_ug">Higher Secondary / ITI / UG / PG (Post-Matric ST)</option>
                  <option value="school">Classes IX & X Secondary School (Pre-Matric ST)</option>
                  <option value="any">Show All Eligible Schemes (Universal Discovery)</option>
                </select>
              </div>

              {/* Field 5: Scheduled Tribe Community */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Scheduled Tribe Community (Gazette Matched)
                </label>
                <select
                  value={checkTribe}
                  onChange={(e) => setCheckTribe(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {TRIBAL_COMMUNITIES.map(tribe => (
                    <option key={tribe.name} value={tribe.name}>
                      {tribe.name} {tribe.pvtg ? '★ (Particularly Vulnerable Tribal Group - PVTG)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculate Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleRunEligibilityCheck}
                className="px-8 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-2xl shadow-md transition flex items-center space-x-2 text-xs"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Evaluate My Statutory Eligibility Now</span>
              </button>
            </div>

            {/* Evaluation Result View */}
            {checkResult && (
              <div className="pt-6 border-t border-slate-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800">
                    Pre-Evaluation Result for <span className="text-blue-900 font-extrabold">{checkResult.tribe} Community</span>:
                  </div>
                  {checkResult.isPvtg && (
                    <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      ★ Notified PVTG Group (Affirmative Priority Active)
                    </span>
                  )}
                </div>

                {checkResult.matches.length > 0 ? (
                  <div className="space-y-3">
                    {checkResult.matches.map((res, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="font-bold text-emerald-950 text-sm">{res.name}</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full">
                              Potentially Eligible
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 font-medium">{res.location}</div>
                          <div className="text-xs text-emerald-800 font-bold font-mono">Grant: {res.stipend}</div>
                          {res.pvtgBonus && (
                            <div className="text-[11px] text-purple-700 font-semibold">{res.pvtgBonus}</div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
                          <button
                            onClick={() => setWhyDetails({
                              scheme: res.name,
                              schemeId: res.schemeId,
                              evaluation: res.evaluation,
                              schemeObj: res.scheme,
                              income: checkIncome,
                              age: checkAge,
                              tribe: checkTribe,
                              isPvtg: checkResult.isPvtg
                            })}
                            className="px-3 py-2 bg-white hover:bg-slate-50 text-blue-900 border border-blue-300 font-bold rounded-xl text-xs transition cursor-pointer"
                          >
                            Why am I eligible? 🔍
                          </button>

                          <button
                            onClick={() => onLaunchGoldenDemo ? onLaunchGoldenDemo() : (onOpenRegister && onOpenRegister())}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
                          >
                            Start Application ➔
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <div className="font-bold flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>No direct fellowship matches under current statutory limits</span>
                      </div>
                      <button
                        onClick={() => setWhyDetails({
                          scheme: 'Statutory Evaluation Summary',
                          schemeId: 'INELIGIBLE',
                          evaluations: checkResult.evaluations,
                          income: checkIncome,
                          age: checkAge,
                          tribe: checkTribe,
                          isPvtg: checkResult.isPvtg,
                          isIneligible: true
                        })}
                        className="text-xs text-blue-900 font-bold underline cursor-pointer"
                      >
                        Why does this not qualify?
                      </button>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Reason: Your selected family income (₹{(checkIncome / 100000).toFixed(2)}L) or age ({checkAge} yrs) exceeds statutory ceilings for NFST (₹6L), NOS (₹6L), or Pre/Post-Matric (₹2.5L). Deterministic rules ensure transparent decisions without arbitrary algorithmic rejection.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Why Am I Eligible / Statutory Rule Modal */}
        {whyDetails && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 text-xs max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    DETERMINISTIC STATUTORY RULE AUDIT
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-1 font-serif">
                    Statutory Eligibility Breakdown: {whyDetails.scheme}
                  </h3>
                </div>
                <button
                  onClick={() => setWhyDetails(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Render Checks from SchemeRuleEngine */}
              <div className="space-y-2">
                {whyDetails.evaluation?.checks?.map((chk, idx) => (
                  <div 
                    key={chk.id || idx} 
                    className={`p-3 rounded-xl border flex items-start justify-between gap-2 text-xs ${
                      chk.passed ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center space-x-1.5">
                        <span>{chk.passed ? '✓ PASS:' : '✗ FAILED:'}</span>
                        <span>{chk.criterion}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          chk.severity === 'BLOCKING' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {chk.severity}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{chk.statutoryRule}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        Source: {chk.source} {chk.verified ? '✓' : '(unconfirmed)'}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[11px] shrink-0">
                      <div>Req: <strong>{chk.required}</strong></div>
                      <div>Actual: <strong className={chk.passed ? 'text-emerald-700' : 'text-rose-700'}>{chk.actual}</strong></div>
                    </div>
                  </div>
                ))}

                {/* If multiple schemes evaluations (ineligible summary) */}
                {whyDetails.isIneligible && whyDetails.evaluations && (
                  <div className="space-y-3">
                    {whyDetails.evaluations.map((ev) => (
                      <div key={ev.schemeId} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                        <div className="flex justify-between items-center font-bold">
                          <span>{ev.schemeName} ({ev.shortName})</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            ev.status === 'ELIGIBLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ev.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{ev.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 text-[11px] space-y-1">
                <strong className="block font-bold">Statutory Authority Reference:</strong>
                <span>Governed by MoTA Central Sector & Centrally Sponsored Scheme Guidelines. Evaluated via VidyaSetu deterministic statutory rule engine. Every rule carries an official source citation.</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setWhyDetails(null)}
                  className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setWhyDetails(null);
                    if (onLaunchGoldenDemo) onLaunchGoldenDemo();
                    else if (onOpenRegister) onOpenRegister();
                  }}
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Run Golden Demo as Birsa Hemrom ➔</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 8. End-to-End Governance Roadmap Infographic */}
      <section id="governance" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-900 uppercase tracking-widest bg-indigo-100 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5 text-indigo-900" />
            <span>Digital India Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900">
            How VidyaSetu Operates: The 6-Stage Governance Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From seamless student registration to automated scrutiny and quarterly DBT disbursements, every step is transparent and auditable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Identity & DigiLocker e-KYC',
              desc: 'ST scholars sign up via MeriPehchaan (National SSO) or Mobile OTP. Verified caste gazette and domicile certificates sync directly from DigiLocker repository.'
            },
            {
              step: '02',
              title: '5-Step Smart Application',
              desc: 'Pre-filled smart wizard automatically validates course admissions, research proposals, guide details, and Aadhaar Payment Bridge (APB) bank accounts.'
            },
            {
              step: '03',
              title: 'MoTA-Vision OCR Scrutiny',
              desc: 'Dual-pane scrutiny desk uses computer vision to highlight certificate seals, Article 342 notified tribal registries, and automatically detects lapsed income certificates.'
            },
            {
              step: '04',
              title: '15-Day Deficiency Redressal',
              desc: 'If any anomaly is detected, candidate receives an immediate SMS/Email alert. 1-click re-upload re-scans replacement document in real time with 99.4% confidence.'
            },
            {
              step: '05',
              title: 'Explainable Merit Ranking',
              desc: 'RTI-compliant Multi-Criteria formula balances qualifying marks, institution rank, PVTG (+10 equity bonus), and 30% ST Women horizontal quota.'
            },
            {
              step: '06',
              title: 'Sanction & DBT via PFMS',
              desc: 'Digital sanction order with verifiable cryptographic QR code is issued. Monthly research stipends disburse seamlessly upon guide QPR verification.'
            }
          ].map((stage, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-3 relative overflow-hidden">
              <div className="text-3xl font-black font-mono text-slate-200">{stage.step}</div>
              <h3 className="font-bold text-base text-blue-950">{stage.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Frequently Asked Questions (FAQs) Accordion */}
      <section className="py-16 px-4 sm:px-6 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Official answers to common applicant inquiries regarding fellowship criteria, documents, and DBT payments.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-300 overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className="text-blue-900 text-lg font-black shrink-0">
                    {openFaqIndex === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Official Helpdesk & Contact Strip */}
      <section className="bg-blue-950 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-300 text-sm">
              <Building2 className="w-4 h-4" />
              <span>Ministry Headquarters</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Ministry of Tribal Affairs (जनजातीय कार्य मंत्रालय)<br />
              Government of India, Shastri Bhawan<br />
              Dr. Rajendra Prasad Road, New Delhi - 110001
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-300 text-sm">
              <Phone className="w-4 h-4" />
              <span>National Support Helpline</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Toll-Free National Helpline: <strong>1800-11-7777</strong><br />
              Technical Support: <strong>011-2338-9214</strong><br />
              Hours: Mon–Fri, 9:30 AM to 6:00 PM IST
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-300 text-sm">
              <Mail className="w-4 h-4" />
              <span>Official Correspondence</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Fellowship Cell: <strong>fellowship-mota@nic.in</strong><br />
              Grievance Officer: <strong>dir-scholarship@tribal.gov.in</strong><br />
              NIC Portal Support: <strong>vidyasetu-helpdesk@nic.in</strong>
            </p>
          </div>
        </div>
      </section>

      {/* 11. Official Footer */}
      <footer className="bg-slate-950 text-slate-400 py-6 px-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 Ministry of Tribal Affairs, Government of India. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Hyperlinking Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">GIGW 2.0 Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
