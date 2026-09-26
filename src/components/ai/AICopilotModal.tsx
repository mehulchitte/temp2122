import React, { useState, useEffect } from 'react';
import { aiService, OperationsBriefing, ConsequentialActionRequest } from '../../services/aiService';
import {
  X,
  Sparkles,
  Send,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Wrench,
  Package,
  Layers,
  ShieldAlert,
  Clock,
  MessageSquare,
  HelpCircle,
  Database,
} from 'lucide-react';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  userRole,
}) => {
  const [activeTab, setActiveTab] = useState<
    'copilot' | 'briefing' | 'housekeeping' | 'maintenance' | 'inventory' | 'anomalies' | 'consequential'
  >('copilot');

  // Copilot Chat
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatLog, setChatLog] = useState<
    Array<{ sender: 'user' | 'ai'; text: string; sources?: string[] }>
  >([
    {
      sender: 'ai',
      text: 'Good afternoon. I am your AI Resort Copilot. I analyze live telemetry, PMS reservations, and engineering sensors across Smart Resort 360. What operational questions can I answer for you?',
      sources: ['Resort Database', 'PMS Kernel'],
    },
  ]);

  // Operations Briefing state
  const [briefing, setBriefing] = useState<OperationsBriefing | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  // Consequential Action state
  const [actionType, setActionType] = useState<ConsequentialActionRequest['actionType']>('CANCEL_RESERVATION');
  const [actionTarget, setActionTarget] = useState('Reservation SR-2026-9041 (Lord Harrington)');
  const [pendingConfirmation, setPendingConfirmation] = useState<ConsequentialActionRequest | null>(null);
  const [actionExecutedNotice, setActionExecutedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !briefing) {
      loadBriefing();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const loadBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const data = await aiService.getOperationsBriefing();
      setBriefing(data.briefing);
    } catch (err) {
      console.error('Failed to load briefing:', err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const handleSendQuery = async (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    setChatLog((prev) => [...prev, { sender: 'user', text }]);
    setQueryInput('');
    setIsLoading(true);

    try {
      const res = await aiService.askCopilot(text, userRole);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.answer,
          sources: res.groundedSources,
        },
      ]);
    } catch (err: any) {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Operational retrieval error: ${err.message || 'Unable to query resort engine.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerConsequentialAction = (e: React.FormEvent) => {
    e.preventDefault();
    // Intercept action and require human confirmation!
    setPendingConfirmation({
      actionType,
      payload: { target: actionTarget, initiatedBy: userRole, timestamp: new Date().toISOString() },
      userConfirmed: false,
    });
  };

  const handleApproveAction = async () => {
    if (!pendingConfirmation) return;
    try {
      const res = await aiService.executeConsequentialAction({
        ...pendingConfirmation,
        userConfirmed: true,
      });
      setActionExecutedNotice(
        `Action '${pendingConfirmation.actionType}' approved and executed. Audit receipt: ${res.auditReceipt || 'AUD-OK'}`
      );
      setPendingConfirmation(null);
      setTimeout(() => setActionExecutedNotice(null), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  const quickPrompts = [
    'How many guests are currently staying?',
    'Which rooms are unavailable?',
    'Which reservations arrive today?',
    'What housekeeping tasks are overdue?',
    'Which maintenance issues are critical?',
    'Which inventory items need attention?',
    'Why did occupancy change this week?',
    "Show today's operational priorities.",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#050505]/95 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] bg-[#090b10] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Gold Hairline */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent" />

        {/* Master Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c8aa6e]/10 border border-[#c8aa6e]/30 text-[#c8aa6e]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c8aa6e]">
                ENTERPRISE OPERATIONAL INTELLIGENCE
              </div>
              <h2 className="text-lg sm:text-xl font-editorial text-white">
                Smart Resort 360 AI Engine
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400 bg-white/[0.03] px-3 py-1 border border-white/10">
              ROLE: {userRole}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Intelligence Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.08] px-6 py-2 bg-white/[0.015] text-xs font-mono">
          {[
            { id: 'copilot', label: 'RESORT COPILOT Q&A', icon: MessageSquare },
            { id: 'briefing', label: 'OPERATIONS BRIEFING', icon: FileText },
            { id: 'housekeeping', label: 'HOUSEKEEPING ASSISTANT', icon: Clock },
            { id: 'maintenance', label: 'MAINTENANCE INTELLIGENCE', icon: Wrench },
            { id: 'inventory', label: 'INVENTORY RISKS', icon: Package },
            { id: 'anomalies', label: 'ANOMALY DETECTION', icon: AlertTriangle },
            { id: 'consequential', label: 'CONSEQUENTIAL ACTIONS', icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? 'border-[#c8aa6e]/60 bg-white/[0.06] text-white font-medium'
                    : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c8aa6e]' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: RESORT COPILOT CHAT WITH TOOL CALLING */}
        {activeTab === 'copilot' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-6 space-y-4">
            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block tracking-wider">
                Grounded Operational Queries (Tool-Driven Retrieval):
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendQuery(prompt)}
                    className="px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-[#c8aa6e]/50 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Conversation Thread */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 text-xs font-mono leading-relaxed space-y-2 max-w-[90%] ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-[#c8aa6e]/15 border border-[#c8aa6e]/40 text-white'
                      : 'mr-auto bg-white/[0.02] border border-white/[0.07] text-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pb-1 border-b border-white/[0.05]">
                    <span className="font-semibold uppercase tracking-wider">
                      {msg.sender === 'user' ? `Query by ${userRole}` : 'AI Resort Copilot'}
                    </span>
                    {msg.sources && (
                      <span className="text-[#c8aa6e] flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        <span>Sources: {msg.sources.join(', ')}</span>
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-line font-light">{msg.text}</p>
                </div>
              ))}
              {isLoading && (
                <div className="p-4 bg-white/[0.02] border border-white/[0.05] text-xs font-mono text-[#c8aa6e] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Retrieving live telemetry via backend API tools...</span>
                </div>
              )}
            </div>

            {/* Query Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(queryInput);
              }}
              className="flex gap-2 pt-2 border-t border-white/[0.08]"
            >
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask about occupancy, arrivals, overdue housekeeping, critical maintenance, or inventory..."
                className="flex-1 p-3 bg-white/[0.03] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c8aa6e] font-mono"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-3 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Execute</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: AI OPERATIONS BRIEFING */}
        {activeTab === 'briefing' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">EXECUTIVE COCKPIT</span>
                <h3 className="text-xl font-editorial text-white">Daily Operational Briefing</h3>
              </div>
              <button
                onClick={loadBriefing}
                className="px-3 py-1.5 text-xs font-mono uppercase text-neutral-300 hover:text-white bg-white/[0.04] border border-white/10 cursor-pointer"
              >
                Refresh Data
              </button>
            </div>

            {briefing && (
              <div className="space-y-6 text-xs font-mono">
                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <span className="text-neutral-500 block">OCCUPANCY</span>
                    <span className="text-white text-base font-medium">{briefing.occupancy}</span>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <span className="text-neutral-500 block">RESTAURANT LOAD</span>
                    <span className="text-white text-base font-medium">{briefing.restaurantLoad}</span>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <span className="text-neutral-500 block">HOUSEKEEPING</span>
                    <span className="text-amber-400 text-base font-medium">{briefing.housekeepingBacklog}</span>
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] space-y-1">
                    <span className="text-neutral-500 block">CRITICAL TICKETS</span>
                    <span className="text-red-400 text-base font-medium">1 Active Ticket</span>
                  </div>
                </div>

                {/* Narrative Sections */}
                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[#c8aa6e] uppercase tracking-wider block">Arrivals & Departures:</span>
                    <p className="text-neutral-300 leading-relaxed font-light">{briefing.arrivalsSummary}</p>
                    <p className="text-neutral-400 font-light">{briefing.departuresSummary}</p>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[#c8aa6e] uppercase tracking-wider block">Critical Maintenance & Plant Health:</span>
                    <p className="text-neutral-300 leading-relaxed font-light">{briefing.criticalMaintenance}</p>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[#c8aa6e] uppercase tracking-wider block">Inventory Par Threshold Warnings:</span>
                    <p className="text-neutral-300 leading-relaxed font-light">{briefing.inventoryRisks}</p>
                  </div>

                  <div className="p-5 bg-[#c8aa6e]/10 border border-[#c8aa6e]/30 space-y-2">
                    <div className="flex items-center gap-2 text-[#c8aa6e] font-semibold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Executive Action Directives:</span>
                    </div>
                    <p className="text-white leading-relaxed font-light">{briefing.aiRecommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI HOUSEKEEPING ASSISTANT */}
        {activeTab === 'housekeeping' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">DYNAMIC FLEET DISPATCH</span>
                <h3 className="text-xl font-editorial text-white">AI Housekeeping Turnaround Optimizer</h3>
              </div>
              <span className="text-emerald-400">ARRIVAL RADAR SYNCHRONIZED</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-neutral-400 uppercase tracking-wider block">AI Suggested Turnaround Sequencing:</span>
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-white/[0.02] border-l-2 border-red-400 space-y-1">
                    <div className="flex justify-between text-white font-medium">
                      <span>#1. Villa 12 (Full Turnaround)</span>
                      <span className="text-red-400 uppercase">PRIORITY 1: URGENT VIP</span>
                    </div>
                    <p className="text-neutral-400 font-light">
                      Reasoning: Lord Harrington's private jet landed at 14:10. Guest requested 15:00 check-in. Assigned to Team Delta (~25 mins remaining).
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border-l-2 border-amber-400 space-y-1">
                    <div className="flex justify-between text-white font-medium">
                      <span>#2. Villa 02 (Post-Departure Clean)</span>
                      <span className="text-amber-400 uppercase">PRIORITY 2: HIGH</span>
                    </div>
                    <p className="text-neutral-400 font-light">
                      Reasoning: Dr. Tanaka departed at 11:00. Requires deep sanitization of glass floor viewing portal before next allocation.
                    </p>
                  </div>

                  <div className="p-3 bg-white/[0.02] border-l-2 border-cyan-400 space-y-1">
                    <div className="flex justify-between text-white font-medium">
                      <span>#3. Villa 04 (Evening Turndown)</span>
                      <span className="text-cyan-400 uppercase">PRIORITY 3: SCHEDULED</span>
                    </div>
                    <p className="text-neutral-400 font-light">
                      Reasoning: Elena Rostova has booked dinner at The Obsidian for 19:30. Turndown window scheduled 19:40-20:00 without guest disturbance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI MAINTENANCE INTELLIGENCE */}
        {activeTab === 'maintenance' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">RECURRING ANOMALY CORRELATION</span>
                <h3 className="text-xl font-editorial text-white">AI Maintenance Predictive Intelligence</h3>
              </div>
              <span className="text-[#c8aa6e]">CHILLER LOOP TELEMETRY</span>
            </div>

            <div className="p-5 bg-white/[0.02] border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Repeated Failure Pattern Detected on Villa 06:</span>
              </div>
              <p className="text-neutral-200 leading-relaxed font-light">
                &ldquo;Villa 06 Carrier Chiller B4 has triggered three pressure delta tickets in the last 28 days (ENG-012, ENG-024, ENG-039). The localized pressure drops after 18:00 when ambient thermal load dissipates.&rdquo;
              </p>

              <div className="p-4 bg-black/40 border border-white/10 space-y-2">
                <span className="text-white font-semibold block">AI Suggested Preventive Action:</span>
                <p className="text-neutral-300 font-light">
                  Replace primary return manifold elastomer seal and re-calibrate expansion valve transducer during unoccupied window tomorrow morning 06:00-08:00. Prevents sudden mid-stay HVAC shutdown.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI INVENTORY INTELLIGENCE */}
        {activeTab === 'inventory' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">PREDICTIVE REPLENISHMENT</span>
                <h3 className="text-xl font-editorial text-white">AI Supply Chain & Waste Analytics</h3>
              </div>
              <span className="text-cyan-400">PAR LEVEL TELEMETRY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-[#c8aa6e] uppercase tracking-wider block">Low Stock Alert & Velocity:</span>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Château Margaux 2010</span>
                    <span className="text-red-400">3 Bottles (Min: 5)</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Velocity: +200% weekend drawdown. Suggest auto-PO for 6 bottles ($6,900 USD).
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.05]">
                  <div className="flex justify-between">
                    <span className="text-white">Giza Cotton Sheet Sets</span>
                    <span className="text-amber-400">4 Sets (Min: 8)</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Upcoming occupancy pace will exhaust buffer by Wednesday. Suggest restock of 12 sets.
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-[#c8aa6e] uppercase tracking-wider block">Waste Prevention & Perishables:</span>
                <p className="text-neutral-300 font-light leading-relaxed">
                  Zero perishable spoilage logged this week. Seafood order quantities tuned accurately to 142 dinner covers.
                </p>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
                  F&B yield efficiency running at 98.4% optimal.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AI ANOMALY DETECTION */}
        {activeTab === 'anomalies' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">AUTOMATED RESORT TELEMETRY SCAN</span>
                <h3 className="text-xl font-editorial text-white">Live Operational Anomalies</h3>
              </div>
              <span className="text-emerald-400">SCAN FREQUENCY: REAL-TIME</span>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Chiller Delta Recurrence (Villa 06)', desc: 'Sensor loop pressure dropped past threshold 3 times in 28 days.', severity: 'HIGH', category: 'HVAC' },
                { title: 'Fine Wine Velocity Surge', desc: 'Cellar drawdown on premier grand crus outpaced standard forecast by 2.1x due to private regatta dinner.', severity: 'MEDIUM', category: 'INVENTORY' },
                { title: 'Turnaround Window Optimization', desc: 'Villa 12 check-in landed 50 mins ahead of flight manifest schedule.', severity: 'INFO', category: 'HOUSEKEEPING' },
              ].map((anomaly, idx) => (
                <div key={idx} className="p-4 bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-white font-medium">{anomaly.title}</span>
                    <p className="text-neutral-400 font-light">{anomaly.desc}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-mono ${
                    anomaly.severity === 'HIGH' ? 'text-red-400 bg-red-400/10' : anomaly.severity === 'MEDIUM' ? 'text-amber-400 bg-amber-400/10' : 'text-cyan-400 bg-cyan-400/10'
                  }`}>
                    {anomaly.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONSEQUENTIAL ACTIONS (WITH HUMAN CONFIRMATION GUARDRAIL) */}
        {activeTab === 'consequential' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400">SAFETY GUARDRAILS</span>
                <h3 className="text-xl font-editorial text-white">Consequential Actions Engine</h3>
              </div>
              <span className="text-neutral-400">HUMAN IN THE LOOP REQUIRED</span>
            </div>

            <p className="text-neutral-400 font-light">
              AI is restricted from executing consequential actions (cancellations, refunds, rate modifications, ledger charges, data deletion) without explicit human confirmation.
            </p>

            {actionExecutedNotice && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{actionExecutedNotice}</span>
              </div>
            )}

            <form onSubmit={triggerConsequentialAction} className="p-5 bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="space-y-1">
                <label className="text-neutral-400 block">Select Consequential Action</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as ConsequentialActionRequest['actionType'])}
                  className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                >
                  <option value="CANCEL_RESERVATION">CANCEL_RESERVATION (Affects revenue & availability)</option>
                  <option value="ISSUE_REFUND">ISSUE_REFUND (Financial ledger disbursement)</option>
                  <option value="CHANGE_BOOKING">CHANGE_BOOKING (Room & rate reassignment)</option>
                  <option value="CHARGE_GUEST">CHARGE_GUEST (Tokenized card capture)</option>
                  <option value="CHANGE_PERMISSIONS">CHANGE_PERMISSIONS (RBAC privilege elevation)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 block">Target Resource / Guest</label>
                <input
                  type="text"
                  value={actionTarget}
                  onChange={(e) => setActionTarget(e.target.value)}
                  className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 uppercase font-semibold transition-colors cursor-pointer"
              >
                Initiate Action Draft
              </button>
            </form>

            {/* Human Confirmation Modal Dialog */}
            {pendingConfirmation && (
              <div className="p-6 bg-red-500/10 border-2 border-red-500/40 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <span className="text-xs font-mono uppercase text-red-400 font-bold block">
                      HUMAN MANAGER CONFIRMATION REQUIRED
                    </span>
                    <h4 className="text-base font-editorial text-white">
                      Confirm Consequential Action: {pendingConfirmation.actionType}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  Are you sure you want to execute <strong className="text-white">{pendingConfirmation.actionType}</strong> on <strong className="text-white">{pendingConfirmation.payload.target}</strong>? This action directly affects sovereign resort ledgers and guest contracts.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleApproveAction}
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono uppercase font-semibold transition-colors cursor-pointer"
                  >
                    Approve & Execute Action
                  </button>
                  <button
                    onClick={() => setPendingConfirmation(null)}
                    className="px-4 py-2 border border-white/20 text-neutral-300 hover:text-white text-xs font-mono uppercase cursor-pointer"
                  >
                    Reject & Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
