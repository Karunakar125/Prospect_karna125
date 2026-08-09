import React from 'react';
import { Target, Mail, ShieldCheck, FileCheck, Award } from 'lucide-react';
import { Lead } from '../types';

interface StatsOverviewProps {
  leads: Lead[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ leads }) => {
  if (leads.length === 0) return null;

  const totalLeads = leads.length;
  const emailsFoundCount = leads.filter((l) => l.foundEmail || l.manualEmail).length;
  const emailRate = Math.round((emailsFoundCount / totalLeads) * 100);

  const auditedLeads = leads.filter((l) => l.auditDetail?.score !== undefined);
  const avgScore = auditedLeads.length
    ? Math.round(
        auditedLeads.reduce((acc, curr) => acc + (curr.auditDetail?.score || 0), 0) /
          auditedLeads.length
      )
    : 0;

  const readyDraftsCount = leads.filter((l) => l.emailDraft?.body).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Total Scraped */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <div className="text-lg font-bold text-white">{totalLeads}</div>
          <div className="text-[11px] text-slate-400 font-medium">Leads Discovered</div>
        </div>
      </div>

      {/* Email Extraction Rate */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <div className="text-lg font-bold text-white">
            {emailsFoundCount} <span className="text-xs font-normal text-emerald-400">({emailRate}%)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">Emails Identified</div>
        </div>
      </div>

      {/* Avg Audit Score */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <div className="text-lg font-bold text-white">{avgScore} / 100</div>
          <div className="text-[11px] text-slate-400 font-medium">Avg Site Audit Score</div>
        </div>
      </div>

      {/* Cold Email Drafts */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <FileCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-lg font-bold text-white">{readyDraftsCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">Outreach Drafts Ready</div>
        </div>
      </div>
    </div>
  );
};
