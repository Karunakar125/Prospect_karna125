import React from 'react';
import { Target, Sparkles, Key, CheckCircle2, AlertCircle } from 'lucide-react';

interface HeaderProps {
  hasGeoapifyKey: boolean;
  hasGeminiKey: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasGeoapifyKey,
  hasGeminiKey,
  onOpenSettings,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Prospect<span className="text-indigo-400">Pilot</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Vision Outreach Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Scrape local US leads • AI Vision Website Audit • Smart Email Extraction • One-Click Cold Outreach
            </p>
          </div>
        </div>

        {/* Status Indicators & Settings */}
        <div className="flex items-center gap-3 text-xs">
          {/* Gemini AI Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium text-emerald-400">Gemini 3.6 Vision</span>
          </div>

          {/* Geoapify Key Status */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              hasGeoapifyKey
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="font-medium">
              Geoapify: {hasGeoapifyKey ? 'Live API Active' : 'Demo Mode / Custom Key'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
