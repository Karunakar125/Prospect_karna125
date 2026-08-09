import React from 'react';
import { Search, Mail, Camera, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  currentStep: 'scraping' | 'extracting' | 'screenshot' | 'auditing' | 'drafting' | 'completed' | 'idle';
  progressPercent: number;
  currentLeadIndex: number;
  totalLeads: number;
  statusMessage?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  progressPercent,
  currentLeadIndex,
  totalLeads,
  statusMessage,
}) => {
  if (currentStep === 'idle') return null;

  const steps = [
    { id: 'scraping', label: 'Scraping Leads', icon: Search },
    { id: 'extracting', label: 'Extracting Contact Info', icon: Mail },
    { id: 'screenshot', label: 'Capturing Screenshots', icon: Camera },
    { id: 'auditing', label: 'AI Vision Audit', icon: Eye },
    { id: 'drafting', label: 'Drafting Cold Emails', icon: FileText },
  ];

  const getStepIndex = (stepId: string) => {
    const map: Record<string, number> = {
      scraping: 0,
      extracting: 1,
      screenshot: 2,
      auditing: 3,
      drafting: 4,
      completed: 5,
    };
    return map[stepId] ?? 0;
  };

  const activeIndex = getStepIndex(currentStep);

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl shadow-indigo-500/10 space-y-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Processing Outreach Pipeline
          </h3>
          {totalLeads > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Lead {Math.min(currentLeadIndex + 1, totalLeads)} of {totalLeads}
            </span>
          )}
        </div>
        <span className="text-xs font-mono font-bold text-indigo-400">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 relative">
        <div
          className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Pipeline Steps Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={s.id}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition-all ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-indigo-400 animate-bounce' : ''}`} />
              )}
              <span className="font-medium truncate">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Status Detail Message */}
      {statusMessage && (
        <p className="text-xs text-slate-400 italic text-center sm:text-left pt-1">
          {statusMessage}
        </p>
      )}
    </div>
  );
};
