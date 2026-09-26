import React, { useState } from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { GuestProfile } from '../../../types';
import { Compass, Sparkles, Plus, Send, HeartHandshake } from 'lucide-react';

export const GuestsModule: React.FC = () => {
  const { guests, addGuestRequest, locateOn3DTwin } = useResortOS();
  const [selectedGuestId, setSelectedGuestId] = useState(guests[0]?.id);
  const [requestText, setRequestText] = useState('');
  const [commText, setCommText] = useState('');
  const [commSent, setCommSent] = useState(false);

  const activeGuest = guests.find((g) => g.id === selectedGuestId) || guests[0];

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    addGuestRequest(activeGuest.id, requestText.trim());
    setRequestText('');
  };

  const handleSendComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commText.trim()) return;
    setCommSent(true);
    setCommText('');
    setTimeout(() => setCommSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            03. Guest Profiles & VIP Intelligence
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            HYPER-PERSONALIZED PROFILES · ENCRYPTED PREFERENCES · BESPOKE DISPATCH
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Guest Roster */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-1">
            Active In-Residence Dossiers
          </div>
          <div className="space-y-2">
            {guests.map((g) => {
              const isSelected = g.id === selectedGuestId;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuestId(g.id)}
                  className={`w-full text-left p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.06] border-[#c8aa6e]/60 shadow-[0_0_20px_rgba(200,170,110,0.1)]'
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{g.name}</span>
                    <span className="text-[10px] font-mono text-[#c8aa6e] uppercase">{g.vipTier}</span>
                  </div>
                  <div className="text-xs font-mono text-neutral-400 mt-1">
                    {g.currentRoom} · {g.stayCount} Stays
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 mt-1">
                    Lifetime: ${g.lifetimeSpend.toLocaleString()} USD
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Guest Intelligence Dossier */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#c8aa6e] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeGuest.vipTier} · {activeGuest.stayCount} Previous Stays</span>
              </div>
              <h3 className="text-2xl font-editorial text-white mt-1">{activeGuest.name}</h3>
              <p className="text-xs font-mono text-neutral-400">
                {activeGuest.email} · {activeGuest.phone}
              </p>
            </div>

            <button
              onClick={() => locateOn3DTwin('ocean-villas')}
              className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-[#c8aa6e] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Locate {activeGuest.currentRoom} on Twin</span>
            </button>
          </div>

          {/* Preferences Matrix */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
              Curated Nuances & Preferences
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[11px] text-neutral-500">Dietary & Nutrition:</div>
                <div className="text-neutral-200 mt-0.5">{activeGuest.preferences.dietary}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[11px] text-neutral-500">Wine & Cellar:</div>
                <div className="text-neutral-200 mt-0.5">{activeGuest.preferences.wine}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[11px] text-neutral-500">Pillow & Bedding:</div>
                <div className="text-neutral-200 mt-0.5">{activeGuest.preferences.pillow}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/[0.05]">
                <div className="text-[11px] text-neutral-500">Privacy Window:</div>
                <div className="text-neutral-200 mt-0.5">{activeGuest.preferences.privacyWindow}</div>
              </div>
            </div>
          </div>

          {/* Active Service Requests */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Active Butler & Service Inquiries
              </span>
              <span className="text-xs font-mono text-[#c8aa6e]">
                {activeGuest.activeRequests.length} Requests Logged
              </span>
            </div>

            <div className="space-y-2">
              {activeGuest.activeRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="text-white">{req.service}</span>
                    <span className="text-neutral-500 text-[11px] ml-2">({req.time})</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase ${
                      req.status === 'Fulfilled' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Form to log new service request */}
            <form onSubmit={handleAddRequest} className="flex gap-2 pt-2">
              <input
                type="text"
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="Log internal VIP service request (e.g. Helipad transfer confirmation)..."
                className="flex-1 p-2 bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-[#c8aa6e] font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] text-xs font-mono uppercase font-semibold transition-colors cursor-pointer"
              >
                Log Request
              </button>
            </form>
          </div>

          {/* Secure Guest Direct Communication */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.05] space-y-3">
            <span className="text-xs font-mono uppercase text-[#c8aa6e] block">
              Direct Guest Dispatch
            </span>
            <form onSubmit={handleSendComm} className="flex gap-2">
              <input
                type="text"
                value={commText}
                onChange={(e) => setCommText(e.target.value)}
                placeholder={`Send private concierge message directly to ${activeGuest.name}'s suite tablet...`}
                className="flex-1 p-2 bg-white/[0.03] border border-white/10 text-xs text-white focus:outline-none focus:border-[#c8aa6e] font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-white text-xs font-mono uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
            {commSent && (
              <div className="text-[11px] font-mono text-emerald-400">
                Message transmitted to in-suite console at {activeGuest.currentRoom}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
