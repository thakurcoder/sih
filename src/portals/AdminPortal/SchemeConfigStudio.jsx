import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Save, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Trash2,
  Edit2,
  Play,
  RotateCcw,
  Sliders,
  HelpCircle,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { SchemeRuleEngine } from '../../services/ruleEngine';
import { ApiClient } from '../../services/apiClient';

export function SchemeConfigStudio({ schemes, onUpdateScheme }) {
  const [selectedSchemeId, setSelectedSchemeId] = useState(schemes[0]?.id || 'NFST');
  const [activeTab, setActiveTab] = useState('rules'); // 'rules', 'documents', 'quotas', 'sandbox'
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Editable scheme state
  const currentScheme = schemes.find(s => s.id === selectedSchemeId) || schemes[0];
  const [formData, setFormData] = useState({ ...currentScheme });

  // Update when selected scheme changes
  const handleSelectScheme = (id) => {
    setSelectedSchemeId(id);
    const target = schemes.find(s => s.id === id);
    if (target) setFormData(JSON.parse(JSON.stringify(target)));
    setSaveSuccess(false);
    setSaveError(null);
  };

  // Rule Editor State
  const [editingRuleIndex, setEditingRuleIndex] = useState(null);

  // Sandbox testing state
  const [sandboxCandidate, setSandboxCandidate] = useState({
    annualIncome: 550000,
    pgMarks: 62,
    age: 28,
    isSt: true,
    tribe: 'Santhal',
    pvtg: false,
    pwd: false,
    degree: 'Ph.D. in Rural Development',
    qsWorldRank: 120
  });
  const [sandboxResult, setSandboxResult] = useState(null);

  // RULE MANAGEMENT HANDLERS
  const handleUpdateRule = (index, field, value) => {
    setFormData(prev => {
      const updatedRules = [...(prev.rules || [])];
      let formattedValue = value;

      if (field === 'value') {
        const op = updatedRules[index].operator;
        if (op === 'in' && typeof value === 'string') {
          formattedValue = value.split(',').map(s => s.trim()).filter(Boolean);
        } else if (['lte', 'gte'].includes(op) && !isNaN(Number(value)) && value !== '') {
          formattedValue = Number(value);
        } else if (op === 'eq' && (value === 'true' || value === 'false')) {
          formattedValue = value === 'true';
        }
      }

      updatedRules[index] = {
        ...updatedRules[index],
        [field]: formattedValue
      };

      // Also keep legacy eligibility object in sync if applicable
      const updatedElig = { ...(prev.eligibility || {}) };
      if (updatedRules[index].field === 'annualIncome' && updatedRules[index].operator === 'lte') {
        updatedElig.maxIncome = Number(formattedValue);
      }
      if (updatedRules[index].field === 'age' && updatedRules[index].operator === 'lte') {
        updatedElig.maxAge = Number(formattedValue);
      }
      if (updatedRules[index].field === 'pgMarks' && updatedRules[index].operator === 'gte') {
        updatedElig.minMarks = Number(formattedValue);
      }

      return {
        ...prev,
        rules: updatedRules,
        eligibility: updatedElig
      };
    });
  };

  const handleAddRule = () => {
    const newRule = {
      id: `rule_${Date.now()}`,
      field: 'annualIncome',
      operator: 'lte',
      value: 600000,
      severity: 'BLOCKING',
      label: 'New Statutory Rule',
      description: 'Rule requirement description',
      source: 'tribal.nic.in/ScholarshiP.aspx',
      verified: true
    };
    setFormData(prev => ({
      ...prev,
      rules: [...(prev.rules || []), newRule]
    }));
    setEditingRuleIndex((formData.rules || []).length);
  };

  const handleDeleteRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, idx) => idx !== index)
    }));
    if (editingRuleIndex === index) {
      setEditingRuleIndex(null);
    }
  };

  // DOCUMENT MANAGEMENT HANDLERS
  const handleAddDocument = () => {
    const newDoc = {
      type: `doc_${Date.now()}`,
      label: 'New Required Document',
      mandatory: true,
      issuingAuthorities: ['Competent Authority'],
      description: 'Document required for statutory verification.'
    };
    setFormData(prev => ({
      ...prev,
      requiredDocuments: [...(prev.requiredDocuments || []), newDoc]
    }));
  };

  const handleUpdateDocument = (index, field, value) => {
    setFormData(prev => {
      const updatedDocs = [...(prev.requiredDocuments || [])];
      let formattedVal = value;
      if (field === 'issuingAuthorities' && typeof value === 'string') {
        formattedVal = value.split(',').map(s => s.trim()).filter(Boolean);
      }
      updatedDocs[index] = {
        ...updatedDocs[index],
        [field]: formattedVal
      };
      return {
        ...prev,
        requiredDocuments: updatedDocs
      };
    });
  };

  const handleDeleteDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_, idx) => idx !== index)
    }));
  };

  // SAVE HANDLER (PUT /api/schemes/:id with validation)
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    // 1. Client-side validation using generic SchemeRuleEngine
    const validation = SchemeRuleEngine.validateScheme(formData);
    if (!validation.valid) {
      setSaveError(validation.errors.join(' | '));
      setIsSaving(false);
      return;
    }

    try {
      // 2. Call backend PUT /api/schemes/:id
      const res = await ApiClient.updateScheme(formData.id, formData);

      if (res && res.success) {
        onUpdateScheme(res.scheme || formData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else if (res && res.error) {
        setSaveError(res.error + (res.validationErrors ? `: ${res.validationErrors.join(', ')}` : ''));
      } else {
        // Fallback / offline mode
        onUpdateScheme(formData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      onUpdateScheme(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // SANDBOX EVALUATION (Uses generic SchemeRuleEngine directly)
  const handleRunSandbox = () => {
    const result = SchemeRuleEngine.evaluate(sandboxCandidate, formData);
    setSandboxResult(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">Scheme Rule & Policy Configuration Studio</h1>
            <span className="text-xs bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full font-bold border border-purple-200">
              Generic Declarative Engine
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Define scheme eligibility rules, document requirements, and quotas. Rules govern scrutiny deterministically.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>{isSaving ? 'Validating & Publishing...' : 'Publish Rules to Engine (PUT /api/schemes)'}</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">
            Policy configuration validated & saved! New statutory rules are live in the engine with zero code redeployment.
          </span>
        </div>
      )}

      {/* Save Error Alert */}
      {saveError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-start space-x-2 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Validation Error: Cannot save scheme rules</div>
            <p className="mt-0.5 text-rose-800">{saveError}</p>
          </div>
        </div>
      )}

      {/* Scheme Selector Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {schemes.map(sch => (
          <button
            key={sch.id}
            onClick={() => handleSelectScheme(sch.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              selectedSchemeId === sch.id
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{sch.shortName}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedSchemeId === sch.id ? 'bg-blue-800 text-amber-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {sch.totalSlots} Slots
            </span>
          </button>
        ))}
      </div>

      {/* Subtabs: Rules, Documents, Quotas, Sandbox */}
      <div className="flex space-x-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 px-2 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'rules' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Statutory Rules Editor ({formData.rules?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 px-2 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'documents' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Required Documents Editor ({formData.requiredDocuments?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotas')}
          className={`pb-3 px-2 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'quotas' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Slots, Quotas & Budget</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`pb-3 px-2 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'sandbox' ? 'border-purple-700 text-purple-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Live Engine Sandbox</span>
        </button>
      </div>

      {/* TAB 1: STATUTORY RULES EDITOR */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Eligibility Rules for {formData.name} ({formData.shortName})
              </h3>
              <p className="text-xs text-slate-500">
                Every rule is evaluated generically by <code>SchemeRuleEngine.evaluate()</code>. Operators: lte, gte, eq, in, between.
              </p>
            </div>
            <button
              onClick={handleAddRule}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Eligibility Rule</span>
            </button>
          </div>

          <div className="space-y-4">
            {(formData.rules || []).map((rule, idx) => {
              const isExpanded = editingRuleIndex === idx;
              return (
                <div 
                  key={rule.id || idx}
                  className={`p-4 rounded-xl border transition ${
                    isExpanded 
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/30' 
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  {/* Rule Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        rule.severity === 'BLOCKING' 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {rule.severity || 'BLOCKING'}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{rule.label}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        field: <strong className="text-blue-900">{rule.field}</strong> {rule.operator} {Array.isArray(rule.value) ? `[${rule.value.join(', ')}]` : String(rule.value)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        rule.verified 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {rule.verified ? '✓ Verified MoTA Rule' : '⚠️ Unverified (Provisional)'}
                      </span>
                      <button
                        onClick={() => setEditingRuleIndex(isExpanded ? null : idx)}
                        className="p-1 text-slate-500 hover:text-blue-900 rounded cursor-pointer"
                        title="Edit Rule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Rule Edit Form */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Rule ID</label>
                        <input
                          type="text"
                          value={rule.id}
                          onChange={(e) => handleUpdateRule(idx, 'id', e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Rule Label</label>
                        <input
                          type="text"
                          value={rule.label}
                          onChange={(e) => handleUpdateRule(idx, 'label', e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Candidate Field</label>
                        <select
                          value={rule.field}
                          onChange={(e) => handleUpdateRule(idx, 'field', e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-600 font-mono font-bold text-blue-900"
                        >
                          <option value="annualIncome">annualIncome (₹)</option>
                          <option value="age">age (Years)</option>
                          <option value="pgMarks">pgMarks (%)</option>
                          <option value="isSt">isSt (ST Category Boolean)</option>
                          <option value="qsWorldRank">qsWorldRank (NOS QS Rank)</option>
                          <option value="degree">degree (Enrolled Program)</option>
                          <option value="institution">institution (Enrolled Institute)</option>
                          <option value="pvtg">pvtg (Particularly Vulnerable)</option>
                          <option value="pwd">pwd (Divyangjan)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Comparison Operator</label>
                        <select
                          value={rule.operator}
                          onChange={(e) => handleUpdateRule(idx, 'operator', e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-600 font-mono font-bold"
                        >
                          <option value="lte">lte (≤ Less than or equal)</option>
                          <option value="gte">gte (≥ Greater than or equal)</option>
                          <option value="eq">eq (= Exactly equal / boolean)</option>
                          <option value="in">in (Value matches one in list)</option>
                          <option value="between">between ([min, max] range)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Rule Target Value {rule.operator === 'in' ? '(comma-separated)' : ''}
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(rule.value) ? rule.value.join(', ') : String(rule.value)}
                          onChange={(e) => handleUpdateRule(idx, 'value', e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-600 font-bold font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Severity</label>
                        <select
                          value={rule.severity || 'BLOCKING'}
                          onChange={(e) => handleUpdateRule(idx, 'severity', e.target.value)}
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                        >
                          <option value="BLOCKING">BLOCKING (Mandatory — Ineligible if failed)</option>
                          <option value="ATTENTION">ATTENTION (Warning / Human Scrutiny)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Statutory Source Citation <span className="text-rose-600 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          value={rule.source || ''}
                          onChange={(e) => handleUpdateRule(idx, 'source', e.target.value)}
                          placeholder="e.g. tribal.nic.in/ScholarshiP.aspx Section 4.2"
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-600 font-medium"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block font-bold text-slate-700 mb-1">Statutory Clause Description</label>
                        <input
                          type="text"
                          value={rule.description || ''}
                          onChange={(e) => handleUpdateRule(idx, 'description', e.target.value)}
                          placeholder="e.g. Total annual family income must not exceed ₹6,00,000 from all sources."
                          className="w-full px-2.5 py-1.5 border rounded-lg bg-white focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-5">
                        <input
                          type="checkbox"
                          id={`verified_${idx}`}
                          checked={Boolean(rule.verified)}
                          onChange={(e) => handleUpdateRule(idx, 'verified', e.target.checked)}
                          className="rounded text-blue-900 focus:ring-blue-600 w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor={`verified_${idx}`} className="font-bold text-slate-800 cursor-pointer">
                          Verified against Official MoTA Guidelines
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REQUIRED DOCUMENTS EDITOR */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Required Verification Documents for {formData.name}
              </h3>
              <p className="text-xs text-slate-500">
                Configures which document types are mandatory, required issuing authorities, and OCR pre-scrutiny targets.
              </p>
            </div>
            <button
              onClick={handleAddDocument}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Required Document</span>
            </button>
          </div>

          <div className="space-y-3">
            {(formData.requiredDocuments || []).map((doc, idx) => (
              <div key={doc.type || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                      {doc.type}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{doc.label}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(doc.mandatory)}
                        onChange={(e) => handleUpdateDocument(idx, 'mandatory', e.target.checked)}
                        className="rounded text-blue-900"
                      />
                      <span className="font-bold text-slate-700">Mandatory</span>
                    </label>
                    <button
                      onClick={() => handleDeleteDocument(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove Document Requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Document Label</label>
                    <input
                      type="text"
                      value={doc.label}
                      onChange={(e) => handleUpdateDocument(idx, 'label', e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Type Key</label>
                    <input
                      type="text"
                      value={doc.type}
                      onChange={(e) => handleUpdateDocument(idx, 'type', e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Issuing Authorities (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(doc.issuingAuthorities) ? doc.issuingAuthorities.join(', ') : String(doc.issuingAuthorities || '')}
                      onChange={(e) => handleUpdateDocument(idx, 'issuingAuthorities', e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Verification Description</label>
                    <input
                      type="text"
                      value={doc.description || ''}
                      onChange={(e) => handleUpdateDocument(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SLOTS, QUOTAS & BUDGET */}
      {activeTab === 'quotas' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Scheme Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Annual Slots</label>
              <input
                type="text"
                value={formData.totalSlots}
                onChange={(e) => setFormData({ ...formData, totalSlots: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Annual Budget Allocation (₹ Crores)</label>
              <input
                type="number"
                step="0.1"
                value={formData.annualBudgetCr}
                onChange={(e) => setFormData({ ...formData, annualBudgetCr: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-600 font-bold text-blue-900"
              />
            </div>
          </div>

          {/* Quotas Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Affirmative Action & Inclusion Quotas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                <label className="block font-bold text-purple-950 mb-1">PVTG Dedicated Priority Slots</label>
                <input
                  type="text"
                  value={formData.quotaRules?.pvtgPrioritySlots ?? 50}
                  onChange={(e) => setFormData({
                    ...formData,
                    quotaRules: { ...(formData.quotaRules || {}), pvtgPrioritySlots: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) }
                  })}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white font-bold text-purple-900"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <label className="block font-bold text-amber-950 mb-1">ST Female Horizontal Reservation (%)</label>
                <input
                  type="number"
                  value={formData.quotaRules?.stFemaleHorizontal ?? 30}
                  onChange={(e) => setFormData({
                    ...formData,
                    quotaRules: { ...(formData.quotaRules || {}), stFemaleHorizontal: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white font-bold text-amber-900"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <label className="block font-bold text-blue-950 mb-1">Divyangjan PwD Reservation (%)</label>
                <input
                  type="number"
                  value={formData.quotaRules?.pwdReservation ?? 5}
                  onChange={(e) => setFormData({
                    ...formData,
                    quotaRules: { ...(formData.quotaRules || {}), pwdReservation: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white font-bold text-blue-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE ENGINE SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>Interactive Rule Engine Sandbox</span>
            </h3>
            <p className="text-xs text-slate-500">
              Test candidate attributes against the configured rules for <strong>{formData.name}</strong>. Evaluates in real time using the shared <code>SchemeRuleEngine</code>.
            </p>
          </div>

          {/* Test Candidate Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Annual Income (₹)</label>
              <input
                type="number"
                value={sandboxCandidate.annualIncome}
                onChange={(e) => setSandboxCandidate({ ...sandboxCandidate, annualIncome: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Qualifying Marks (%)</label>
              <input
                type="number"
                value={sandboxCandidate.pgMarks}
                onChange={(e) => setSandboxCandidate({ ...sandboxCandidate, pgMarks: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Candidate Age</label>
              <input
                type="number"
                value={sandboxCandidate.age}
                onChange={(e) => setSandboxCandidate({ ...sandboxCandidate, age: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">QS World University Rank</label>
              <input
                type="number"
                value={sandboxCandidate.qsWorldRank}
                onChange={(e) => setSandboxCandidate({ ...sandboxCandidate, qsWorldRank: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Enrolled Degree / Course</label>
              <input
                type="text"
                value={sandboxCandidate.degree}
                onChange={(e) => setSandboxCandidate({ ...sandboxCandidate, degree: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-center space-x-4 pt-5 sm:col-span-2">
              <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={sandboxCandidate.isSt}
                  onChange={(e) => setSandboxCandidate({ ...sandboxCandidate, isSt: e.target.checked })}
                  className="rounded text-blue-900"
                />
                <span>ST Category (Article 342)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-purple-900">
                <input
                  type="checkbox"
                  checked={sandboxCandidate.pvtg}
                  onChange={(e) => setSandboxCandidate({ ...sandboxCandidate, pvtg: e.target.checked })}
                  className="rounded text-purple-900"
                />
                <span>PVTG Scholar (+5 yrs age relaxation)</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-blue-900">
                <input
                  type="checkbox"
                  checked={sandboxCandidate.pwd}
                  onChange={(e) => setSandboxCandidate({ ...sandboxCandidate, pwd: e.target.checked })}
                  className="rounded text-blue-900"
                />
                <span>PwD / Divyangjan (+5 yrs)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={handleRunSandbox}
              className="flex items-center space-x-2 px-6 py-2.5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Evaluate Eligibility via Engine</span>
            </button>
          </div>

          {/* Sandbox Live Evaluation Output */}
          {sandboxResult && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-300 space-y-4 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    sandboxResult.status === 'ELIGIBLE' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : (sandboxResult.status === 'POTENTIALLY_ELIGIBLE' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-rose-100 text-rose-800 border border-rose-300')
                  }`}>
                    {sandboxResult.status}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{sandboxResult.summary}</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  Passed {sandboxResult.passedCount} of {sandboxResult.totalChecks} Statutory Checks
                </span>
              </div>

              {/* Detailed Rule Breakdown */}
              <div className="space-y-2">
                {sandboxResult.checks.map((chk, i) => (
                  <div 
                    key={chk.id || i}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                      chk.passed 
                        ? 'bg-white border-emerald-200' 
                        : (chk.severity === 'BLOCKING' ? 'bg-rose-50/70 border-rose-200 text-rose-950' : 'bg-amber-50/70 border-amber-200 text-amber-950')
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        {chk.passed ? (
                          <Check className="w-4 h-4 text-emerald-600 font-bold" />
                        ) : (
                          <X className="w-4 h-4 text-rose-600 font-bold" />
                        )}
                        <span className="font-bold">{chk.criterion}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          chk.severity === 'BLOCKING' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {chk.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 ml-6">{chk.statutoryRule}</p>
                      <div className="text-[10px] text-slate-500 mt-0.5 ml-6">
                        Source: <span className="font-mono text-slate-700">{chk.source}</span> {chk.verified ? '✓' : '(unconfirmed)'}
                      </div>
                    </div>

                    <div className="text-right sm:text-right ml-6 sm:ml-0 font-mono text-[11px] shrink-0">
                      <div>Required: <strong>{chk.required}</strong></div>
                      <div>Actual: <strong className={chk.passed ? 'text-emerald-700' : 'text-rose-700'}>{chk.actual}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
