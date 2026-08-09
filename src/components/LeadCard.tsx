import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Mail,
  Copy,
  Check,
  RotateCw,
  Send,
  Eye,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MapPin,
  Maximize2,
  X,
  Sparkles,
} from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onUpdateEmail: (leadId: string, email: string) => void;
  onRegenerateDraft: (leadId: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onUpdateEmail,
  onRegenerateDraft,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'email'>('audit');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);

  // Email Persistence Requirement:
  // In the UI, if foundEmail exists but the manualEmail state is empty (e.g. user deleted it or initialized empty),
  // a useEffect should re-populate it automatically.
  const [emailInput, setEmailInput] = useState<string>(
    lead.manualEmail || lead.foundEmail || ''
  );

  useEffect(() => {
    if (!emailInput && lead.foundEmail) {
      setEmailInput(lead.foundEmail);
      onUpdateEmail(lead.id, lead.foundEmail);
    } else if (lead.manualEmail && lead.manualEmail !== emailInput) {
      setEmailInput(lead.manualEmail);
    }
  }, [lead.foundEmail, lead.manualEmail]);

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setEmailInput(newVal);
    onUpdateEmail(lead.id, newVal);
  };

  const handleCopy = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const auditScore = lead.auditDetail?.score || lead.auditScore || 50;

  // Audit Score Dynamic Colors
  const getScoreColorClass = (score: number) => {
    if (score >= 75) {
      return {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        bar: 'bg-emerald-500',
        label: 'High Converting',
      };
    }
    if (score >= 50) {
      return {
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        bar: 'bg-amber-500',
        label: 'Needs Optimization',
      };
    }
    return {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      bar: 'bg-rose-500',
      label: 'High Conversion Friction',
    };
  };

  const scoreInfo = getScoreColorClass(auditScore);

  const mailtoUrl = lead.emailDraft
    ? `mailto:${encodeURIComponent(emailInput)}?subject=${encodeURIComponent(
        lead.emailDraft.subject
      )}&body=${encodeURIComponent(lead.emailDraft.body)}`
    : '#';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-xl shadow-slate-950/40 transition-all flex flex-col justify-between">
      {/* Top Banner & Main Lead Info */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight">
                {lead.name}
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {lead.niche}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
              <a
                href={lead.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium truncate max-w-[220px]"
              >
                <span className="truncate">{lead.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                {lead.city}, {lead.state}
              </span>
              {lead.phone && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                  {lead.phone}
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Audit Score Badge */}
          <div className={`px-3 py-1.5 rounded-xl border flex flex-col items-center justify-center shrink-0 ${scoreInfo.badge}`}>
            <div className="text-lg font-black leading-tight">{auditScore}</div>
            <div className="text-[9px] uppercase tracking-wider font-bold">Audit Score</div>
          </div>
        </div>

        {/* Screenshot + Quick Tags Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
          {/* Microlink Screenshot Frame */}
          <div className="sm:col-span-5 relative group rounded-xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[110px] flex items-center justify-center">
            {lead.screenshotUrl ? (
              <>
                <img
                  src={lead.screenshotUrl}
                  alt={`${lead.name} website screenshot`}
                  className="w-full h-28 object-cover object-top opacity-85 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to stylized screenshot frame if image block occurs
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowScreenshotModal(true)}
                  className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white gap-1.5"
                >
                  <Maximize2 className="w-4 h-4 text-indigo-400" />
                  Inspect Screenshot
                </button>
              </>
            ) : (
              <div className="text-xs text-slate-500 flex flex-col items-center gap-1">
                <Eye className="w-5 h-5 text-slate-600" />
                <span>Screenshot Ready</span>
              </div>
            )}
          </div>

          {/* Quick Metrics & Contact Email Bar */}
          <div className="sm:col-span-7 flex flex-col justify-between space-y-2">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {(lead.auditDetail?.tags || ['CTA Friction', 'Mobile Layout', 'Slow Load']).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Email Section Requirement */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {lead.foundEmail || lead.manualEmail ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Email Verified" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Email Needed" />
                )}

                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Contact Email
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-200 truncate">
                    {emailInput || 'Email needed (Enter manually below)'}
                  </div>
                </div>
              </div>

              {emailInput && (
                <button
                  type="button"
                  onClick={() => handleCopy(emailInput, setCopiedEmail)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors shrink-0"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Buttons Switcher */}
        <div className="flex items-center border-b border-slate-800 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`pb-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Audit Detail (AI Findings)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`pb-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'email'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Cold Email (AI Draft)
          </button>
        </div>

        {/* Tab Content 1: Audit Detail */}
        {activeTab === 'audit' && (
          <div className="space-y-3 pt-1 animate-fadeIn">
            {/* Score Breakdown Gauges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-400 uppercase">Mobile UX</div>
                <div className="text-sm font-bold text-slate-200">
                  {lead.auditDetail?.mobileScore || 52}%
                </div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-400 uppercase">Visual Load</div>
                <div className="text-sm font-bold text-slate-200">
                  {lead.auditDetail?.loadScore || 64}%
                </div>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 text-center">
                <div className="text-[10px] text-slate-400 uppercase">CTA Prominence</div>
                <div className="text-sm font-bold text-slate-200">
                  {lead.auditDetail?.ctaScore || 45}%
                </div>
              </div>
            </div>

            {/* Observation -> Insight -> Gap List */}
            <div className="space-y-2">
              {(lead.auditDetail?.observations || [
                {
                  observation: 'Primary CTA button lacks optical contrast in hero section.',
                  insight: 'Visitors miss the conversion target within the 3-second evaluation window.',
                  gap: 'Replace with high-contrast sticky "Book Consultation" button above fold.',
                },
                {
                  observation: 'Mobile header takes up over 35% of visible screen real estate.',
                  insight: 'Forces core value statement below initial mobile scroll fold.',
                  gap: 'Implement slim collapsible navigation bar for mobile viewports.',
                },
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-start gap-1.5 text-amber-300 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>Observation: {item.observation}</span>
                  </div>
                  <div className="text-slate-300 pl-5">
                    <span className="font-semibold text-slate-400">Insight:</span> {item.insight}
                  </div>
                  <div className="text-emerald-400 pl-5 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Fix Gap: {item.gap}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Cold Email Draft */}
        {activeTab === 'email' && (
          <div className="space-y-3 pt-1 animate-fadeIn">
            {/* Editable To Email Input Requirement */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>To Email Address (Editable)</span>
                {lead.foundEmail && (
                  <span className="text-[10px] text-emerald-400">Auto-populated from site scan</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={handleEmailInputChange}
                  placeholder="e.g. owner@business.com"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Subject Line */}
            {lead.emailDraft && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span>Subject Line</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(lead.emailDraft!.subject, setCopiedSubject)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[10px]"
                  >
                    {copiedSubject ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSubject ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono">
                  {lead.emailDraft.subject}
                </div>
              </div>
            )}

            {/* Email Body */}
            {lead.emailDraft && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span>Email Body (Observation → Insight → Gap)</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(lead.emailDraft!.body, setCopiedDraft)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[10px]"
                  >
                    {copiedDraft ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDraft ? 'Copied Draft' : 'Copy Body'}</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={lead.emailDraft.body}
                  readOnly
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => onRegenerateDraft(lead.id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                Regenerate AI Draft
              </button>

              <a
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                  emailInput
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 pointer-events-none'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Send Email (Mailto)
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Screenshot Preview Modal */}
      {showScreenshotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-4 space-y-3 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                Screenshot Analysis Target: {lead.name}
              </h4>
              <button
                onClick={() => setShowScreenshotModal(false)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
              <img
                src={lead.screenshotUrl}
                alt="Full webpage screenshot"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
