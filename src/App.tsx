import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { ProgressBar } from './components/ProgressBar';
import { StatsOverview } from './components/StatsOverview';
import { LeadCard } from './components/LeadCard';
import { Lead, SearchForm as SearchFormType } from './types';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [hasGeoapifyKey, setHasGeoapifyKey] = useState<boolean>(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  // Pipeline State
  const [pipelineStep, setPipelineStep] = useState<
    'idle' | 'scraping' | 'extracting' | 'screenshot' | 'auditing' | 'drafting' | 'completed'
  >('idle');
  const [pipelineProgress, setPipelineProgress] = useState<number>(0);
  const [currentLeadIndex, setCurrentLeadIndex] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Filter & Search state
  const [filterEmailOnly, setFilterEmailOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'auditScoreAsc' | 'auditScoreDesc' | 'name'>('auditScoreAsc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Check backend keys status on load
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHasGeoapifyKey(data.hasGeoapifyKey);
        setHasGeminiKey(data.hasGeminiKey);
      })
      .catch(() => {
        setHasGeoapifyKey(false);
      });
  }, []);

  // Handler: Start Lead Scraping & AI Audit Pipeline
  const handleSearch = async (form: SearchFormType) => {
    setIsProcessing(true);
    setLeads([]);
    setPipelineStep('scraping');
    setPipelineProgress(10);
    setStatusMessage(`Scrape initiating for ${form.niche} in ${form.city}, ${form.state}...`);

    try {
      // Step 1: Fetch Scraped Leads
      const scrapeRes = await fetch('/api/scrape-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: form.niche,
          city: form.city,
          state: form.state,
          customKey: form.customKey,
          sampleMode: form.sampleMode,
          maxResults: form.maxResults,
        }),
      });

      const scrapeData = await scrapeRes.json();
      const initialLeads: Lead[] = scrapeData.leads || [];

      if (initialLeads.length === 0) {
        setPipelineStep('idle');
        setIsProcessing(false);
        setStatusMessage('No leads returned. Try selecting another city or niche.');
        return;
      }

      setLeads(initialLeads);
      const total = initialLeads.length;

      // Step 2: Sequential Processing for each lead
      for (let i = 0; i < total; i++) {
        setCurrentLeadIndex(i);
        const lead = initialLeads[i];

        // 2A: Extract Contact Emails
        setPipelineStep('extracting');
        setPipelineProgress(20 + Math.round((i / total) * 70) + 5);
        setStatusMessage(`[${i + 1}/${total}] Extracting emails from ${lead.website}...`);

        let foundEmail: string | undefined = undefined;
        try {
          const emailRes = await fetch('/api/extract-contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteUrl: lead.website }),
          });
          const emailData = await emailRes.json();
          foundEmail = emailData.foundEmail;
        } catch (err) {
          console.warn('Email extraction error:', err);
        }

        // Update lead with email
        setLeads((prev) =>
          prev.map((l, idx) =>
            idx === i
              ? {
                  ...l,
                  foundEmail,
                  manualEmail: foundEmail,
                  status: 'screenshot',
                }
              : l
          )
        );

        // 2B: Capturing Screenshot & AI Auditing
        setPipelineStep('auditing');
        setPipelineProgress(20 + Math.round(((i + 0.5) / total) * 70));
        setStatusMessage(`[${i + 1}/${total}] Gemini Vision analyzing ${lead.name} website screenshot...`);

        try {
          const auditRes = await fetch('/api/audit-and-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              leadName: lead.name,
              websiteUrl: lead.website,
              niche: lead.niche,
              city: lead.city,
              state: lead.state,
              foundEmail,
            }),
          });

          const auditData = await auditRes.json();

          setLeads((prev) =>
            prev.map((l, idx) =>
              idx === i
                ? {
                    ...l,
                    auditScore: auditData.auditDetail?.score || 55,
                    auditDetail: auditData.auditDetail,
                    emailDraft: auditData.emailDraft,
                    status: 'ready',
                  }
                : l
            )
          );
        } catch (auditErr) {
          console.error('Audit Error for lead:', lead.name, auditErr);
          setLeads((prev) =>
            prev.map((l, idx) =>
              idx === i
                ? {
                    ...l,
                    status: 'failed',
                    statusMessage: 'AI Audit request failed',
                  }
                : l
            )
          );
        }
      }

      setPipelineStep('completed');
      setPipelineProgress(100);
      setStatusMessage(`Completed! Successfully audited ${total} leads with cold email drafts.`);
    } catch (err: any) {
      console.error('Pipeline Error:', err);
      setStatusMessage(`Pipeline error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler: Update Lead Manual Email
  const handleUpdateEmail = (leadId: string, email: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, manualEmail: email } : l))
    );
  };

  // Handler: Single Lead Regenerate Draft
  const handleRegenerateDraft = async (leadId: string) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    try {
      const res = await fetch('/api/audit-and-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: targetLead.name,
          websiteUrl: targetLead.website,
          niche: targetLead.niche,
          city: targetLead.city,
          state: targetLead.state,
          foundEmail: targetLead.manualEmail || targetLead.foundEmail,
        }),
      });
      const data = await res.json();
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? {
                ...l,
                auditDetail: data.auditDetail || l.auditDetail,
                emailDraft: data.emailDraft || l.emailDraft,
              }
            : l
        )
      );
    } catch (err) {
      console.error('Failed to regenerate draft', err);
    }
  };

  // Export All Drafts as JSON/CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Business Name', 'Niche', 'City', 'State', 'Website', 'Email', 'Audit Score', 'Subject', 'Email Body'];
    const rows = leads.map((l) => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.niche}"`,
      `"${l.city}"`,
      `"${l.state}"`,
      `"${l.website}"`,
      `"${l.manualEmail || l.foundEmail || ''}"`,
      `"${l.auditDetail?.score || l.auditScore || ''}"`,
      `"${l.emailDraft?.subject || ''}"`,
      `"${(l.emailDraft?.body || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ProspectPilot_Outreach_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyAllDrafts = () => {
    const textToCopy = leads
      .map(
        (l, i) =>
          `LEAD #${i + 1}: ${l.name} (${l.website})
To: ${l.manualEmail || l.foundEmail || 'Unknown'}
Subject: ${l.emailDraft?.subject || ''}
------------------------------------------------
${l.emailDraft?.body || ''}
================================================\n`
      )
      .join('\n');

    navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Filter & Sort Logic
  const filteredLeads = leads
    .filter((l) => {
      if (filterEmailOnly && !(l.foundEmail || l.manualEmail)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          l.name.toLowerCase().includes(query) ||
          l.website.toLowerCase().includes(query) ||
          l.city.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const scoreA = a.auditDetail?.score || a.auditScore || 0;
      const scoreB = b.auditDetail?.score || b.auditScore || 0;
      if (sortBy === 'auditScoreAsc') return scoreA - scoreB; // Worst websites first for outreach!
      if (sortBy === 'auditScoreDesc') return scoreB - scoreA;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        hasGeoapifyKey={hasGeoapifyKey}
        hasGeminiKey={hasGeminiKey}
        onOpenSettings={() => {
          // Toast or helper message for API settings
          alert('Geoapify Key is configured in your server environment variable GEOAPIFY_API_KEY. You can also paste a key directly in the Search Form advanced section.');
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search & Audit Control Dashboard */}
        <section className="space-y-4">
          <SearchForm
            onSearch={handleSearch}
            isLoading={isProcessing}
            defaultGeoapifyKey={process.env.GEOAPIFY_API_KEY}
          />
        </section>

        {/* Real-time Processing Pipeline Progress Bar */}
        <ProgressBar
          currentStep={pipelineStep}
          progressPercent={pipelineProgress}
          currentLeadIndex={currentLeadIndex}
          totalLeads={leads.length}
          statusMessage={statusMessage}
        />

        {/* Metrics & Analytics Overview */}
        <StatsOverview leads={leads} />

        {/* Results Controls & Lead Cards Feed */}
        {leads.length > 0 && (
          <section className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center gap-3 flex-wrap text-xs text-slate-300 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-52">
                  <input
                    type="text"
                    placeholder="Search results..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filterEmailOnly}
                    onChange={(e) => setFilterEmailOnly(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Email Found Only</span>
                </label>

                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="auditScoreAsc">Audit Score: Lowest First (Best Prospects)</option>
                    <option value="auditScoreDesc">Audit Score: Highest First</option>
                    <option value="name">Business Name (A-Z)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCopyAllDrafts}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Copied All' : 'Copy All Drafts'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Staggered Motion List Entrance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                  >
                    <LeadCard
                      lead={lead}
                      onUpdateEmail={handleUpdateEmail}
                      onRegenerateDraft={handleRegenerateDraft}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Empty State / Welcome Section */}
        {leads.length === 0 && !isProcessing && (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                Find Local Businesses & Generate Hyper-Personalized Cold Emails
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-lg mx-auto">
                Select a local business niche (e.g., Dentists, Roofing, Legal) and choose from 100+ US cities above. ProspectPilot will scrape verified local websites, run Gemini 3.6 Vision website audits, extract direct emails, and compose no-flattery cold emails following the Observation → Insight → Gap framework.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                No Flattery Rules
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Microlink Vision Analysis
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Smart Email Extraction
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
