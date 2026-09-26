import React, { useState } from 'react';
import { useResortOS } from '../../context/ResortOSContext';
import { aiService } from '../../services/aiService';
import { IssueAgentModal } from '../ai/IssueAgentModal';
import {
  Key,
  Thermometer,
  UtensilsCrossed,
  ConciergeBell,
  Receipt,
  Star,
  CheckCircle2,
  Lock,
  Unlock,
  Send,
  Sparkles,
  Calendar,
  Clock,
  Compass,
  Bell,
  AlertTriangle,
  Waves,
  ShieldCheck,
  User,
  Heart,
  Plus,
  Bot,
  MessageSquare,
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const {
    rooms,
    updateRoomClimate,
    guestBills,
    settleFolio,
    addFeedback,
    addGuestRequest,
    guests,
    kitchenOrders,
    locateOn3DTwin,
  } = useResortOS();

  const villa = rooms.find((r) => r.number === 'Villa 12') || rooms[0];
  const guest = guests[0]; // Lord Alexander Harrington
  const bill = guestBills.find((b) => b.roomNumber === 'Villa 12') || guestBills[0];

  const [activeCategory, setActiveCategory] = useState<
    'stay' | 'dining' | 'wellness' | 'concierge' | 'billing' | 'profile' | 'ai_concierge'
  >('stay');

  const [isIssueAgentOpen, setIsIssueAgentOpen] = useState(false);
  const [aiConciergeInput, setAiConciergeInput] = useState('');
  const [aiConciergeLoading, setAiConciergeLoading] = useState(false);
  const [aiConciergeLog, setAiConciergeLog] = useState<Array<{ sender: 'guest' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Good afternoon, Lord Harrington. I am your private AI Guest Concierge for Villa 12. How may I curate your in-residence experience today? I can assist with private cellar allocations, secluded catamaran charters, hydrotherapy bookings, or room nuances.',
    },
  ]);

  // Interactive UI states
  const [isLocked, setIsLocked] = useState(true);
  const [climate, setClimate] = useState(villa.climateTemp);
  const [activeMood, setActiveMood] = useState('Sunset Sanctuary');
  const [serviceCategory, setServiceCategory] = useState('Towels & Linen');
  const [serviceDetails, setServiceDetails] = useState('');
  const [serviceSuccess, setServiceSuccess] = useState(false);

  // Issue reporting state
  const [issueFacility, setIssueFacility] = useState('Sub-floor Climate');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  // Dining & room service order
  const [orderedNotice, setOrderedNotice] = useState<string | null>(null);

  // Table reservation state
  const [diningDate, setDiningDate] = useState('2026-09-27');
  const [diningTime, setDiningTime] = useState('20:00');
  const [diningCovers, setDiningCovers] = useState(2);
  const [diningSuccess, setDiningSuccess] = useState(false);

  // Wellness booking state
  const [spaService, setSpaService] = useState('Subterranean Thermal Mineral Bath');
  const [spaTime, setSpaTime] = useState('16:00 Tomorrow');
  const [spaSuccess, setSpaSuccess] = useState(false);

  // Activity booking state
  const [activitySelected, setActivitySelected] = useState('Supercatamaran Sunset Cruise');
  const [activitySuccess, setActivitySuccess] = useState(false);

  // Concierge chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Mei Lin (Head Butler)', text: 'Good afternoon Lord Harrington. Your private catamaran tender is fueled and awaiting your discretion at Jetty Alpha.', time: '14:15 PM' },
    { sender: 'Lord Harrington', text: 'Thank you Mei Lin. Please ensure the Krug is chilled to 8°C upon arrival.', time: '14:20 PM' },
    { sender: 'Mei Lin (Head Butler)', text: 'Certainly, Lord Harrington. The cellar sommelier has already prepared the 2008 vintage in an iced silver bucket in your villa.', time: '14:22 PM' },
  ]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Private Flight Radar Sync', text: 'Flight G650 cleared by island control. Luggage conveyor routed to Villa 12.', time: '14:10 PM', unread: false },
    { id: '2', title: 'Cellar Sommelier Allocation', text: 'Château Margaux 2010 Premier Grand Cru transferred to your in-villa grotto.', time: '14:30 PM', unread: true },
    { id: '3', title: 'Spa Hydrotherapy Ready', text: 'Mineral temperature in Grotto 3 stabilized at 38.5°C for your evening treatment.', time: '15:10 PM', unread: true },
  ]);

  // Feedback state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Profile preferences
  const [userPrefs, setUserPrefs] = useState({
    dietary: guest.preferences.dietary,
    pillow: guest.preferences.pillow,
    wine: guest.preferences.wine,
    privacy: guest.preferences.privacyWindow,
  });
  const [prefsSaved, setPrefsSaved] = useState(false);

  const handleClimateChange = (newTemp: number) => {
    setClimate(newTemp);
    updateRoomClimate(villa.id, newTemp);
  };

  const handleOrderRoomService = (dishName: string, price: number) => {
    setOrderedNotice(`${dishName} ($${price}) dispatched to Villa 12 hot-box transit.`);
    setTimeout(() => setOrderedNotice(null), 4000);
  };

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    setDiningSuccess(true);
    setTimeout(() => setDiningSuccess(false), 5000);
  };

  const handleBookWellness = (e: React.FormEvent) => {
    e.preventDefault();
    setSpaSuccess(true);
    setTimeout(() => setSpaSuccess(false), 5000);
  };

  const handleBookActivity = (e: React.FormEvent) => {
    e.preventDefault();
    setActivitySuccess(true);
    setTimeout(() => setActivitySuccess(false), 5000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'Lord Harrington', text: chatInput.trim(), time: 'Just now' };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    // Butler automated response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'Mei Lin (Head Butler)',
          text: 'Understood immediately, Lord Harrington. Attending to this right away.',
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  const handleRequestService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceDetails.trim()) return;
    addGuestRequest(guest.id, `${serviceCategory}: ${serviceDetails.trim()}`);
    setServiceDetails('');
    setServiceSuccess(true);
    setTimeout(() => setServiceSuccess(false), 4000);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) return;
    setIssueSubmitted(true);
    setIssueDescription('');
    setTimeout(() => setIssueSubmitted(false), 5000);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    addFeedback({
      guestName: guest.name,
      roomNumber: villa.number,
      rating,
      category: 'Villa Comfort',
      comment: feedbackComment.trim(),
      sentiment: rating >= 4 ? 'Positive' : 'Critical',
    });
    setFeedbackComment('');
    setFeedbackSuccess(true);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-neutral-300">
      {/* 1. Header Banner: Sanctuary Overview & Digital Door Key */}
      <div className="p-8 bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-[#c8aa6e] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GUEST RESIDENCE SANCTUARY · {guest.vipTier}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial text-white tracking-wide">
              {guest.name}
            </h2>
            <div className="text-xs text-neutral-400 font-mono tracking-wider flex flex-wrap items-center gap-2">
              <span>{villa.name.toUpperCase()}</span>
              <span>·</span>
              <span>WEST PIERHEAD</span>
              <span>·</span>
              <span className="text-emerald-400">IN-RESIDENCE ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsIssueAgentOpen(true)}
              className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Report villa maintenance or anomaly via AI vision agent"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Report Issue (AI Vision)</span>
            </button>
            <button
              onClick={() => locateOn3DTwin('ocean-villas')}
              className="px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#c8aa6e]" />
              <span>View Villa on Twin</span>
            </button>
            <button
              onClick={() => setIsLocked((prev) => !prev)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isLocked
                  ? 'bg-white/[0.05] text-neutral-200 border border-white/10 hover:border-[#c8aa6e]/50'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_20px_rgba(52,211,153,0.2)]'
              }`}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isLocked ? 'SANCTUARY LOCKED' : 'SANCTUARY UNLOCKED'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Category Bar for All 17 Customer Features */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-white/[0.08] pb-1 text-xs font-mono">
        {[
          { id: 'stay', label: 'MY STAY & SANCTUARY', icon: Key },
          { id: 'ai_concierge', label: 'AI GUEST CONCIERGE', icon: Sparkles },
          { id: 'dining', label: 'ROOM SERVICE & DINING', icon: UtensilsCrossed },
          { id: 'wellness', label: 'SPA & EXPERIENCES', icon: Waves },
          { id: 'concierge', label: 'CONCIERGE & REQUESTS', icon: ConciergeBell },
          { id: 'billing', label: 'RESIDENCE BILL & FOLIO', icon: Receipt },
          { id: 'profile', label: 'PROFILE & NOTIFICATIONS', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
              className={`flex items-center gap-2 px-4 py-3 tracking-wider uppercase transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                isActive
                  ? 'border-[#c8aa6e] text-white font-medium bg-white/[0.02]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c8aa6e]' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CATEGORY 1: MY STAY, RESERVATION, ROOM SPECS & CLIMATE */}
      {activeCategory === 'stay' && (
        <div className="space-y-8">
          {/* Reservation & Check-in/Check-out Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-white/[0.02] border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-mono uppercase text-[#c8aa6e] block">
                MY RESERVATION
              </span>
              <div className="text-xl font-editorial text-white">Confirmation SR-2026-9041</div>
              <p className="text-xs font-mono text-neutral-400">
                Sept 26, 2026 → Oct 03, 2026 · 7 Nights
              </p>
              <div className="text-[11px] font-mono text-neutral-500 pt-1">
                Booking Source: Amex Centurion Private Dispatch
              </div>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-mono uppercase text-[#c8aa6e] block">
                ARRIVAL & DEPARTURE
              </span>
              <div className="text-xl font-editorial text-white">Check-in Completed</div>
              <p className="text-xs font-mono text-neutral-400">
                Scheduled Checkout: Oct 03 at 12:00 PM
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-1">
                Late 16:00 departure pre-approved for flight connection
              </div>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/[0.08] space-y-2">
              <span className="text-[11px] font-mono uppercase text-[#c8aa6e] block">
                VILLA ARCHITECTURE
              </span>
              <div className="text-xl font-editorial text-white">2,400 Sq.Ft Cantilever</div>
              <p className="text-xs font-mono text-neutral-400">
                Saltwater Plunge · Sunset Deck · Grotto
              </p>
              <div className="text-[11px] font-mono text-[#c8aa6e] pt-1">
                B&O Acoustics · Geothermal radiant flooring
              </div>
            </div>
          </div>

          {/* Sub-floor Climate & Lighting Scenarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c8aa6e]">
                  <Thermometer className="w-4 h-4" />
                  <span>Geothermal Sub-Floor Radiant Control</span>
                </div>
                <span className="text-xs font-mono text-neutral-400">ZONE 12</span>
              </div>

              <div className="text-center py-4 space-y-2">
                <div className="text-5xl font-light font-mono text-white tracking-tight">
                  {climate.toFixed(1)}°C
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  Autonomous ambient heat dissipation active
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleClimateChange(Math.max(18, climate - 0.5))}
                  className="w-10 h-10 border border-white/10 hover:border-white/30 text-white font-mono text-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest px-4">
                  SET TEMPERATURE
                </span>
                <button
                  onClick={() => handleClimateChange(Math.min(26, climate + 0.5))}
                  className="w-10 h-10 border border-white/10 hover:border-white/30 text-white font-mono text-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lighting Atmospheric Scenes */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">
                  Lutron Architectural Atmosphere
                </span>
                <span className="text-xs font-mono text-neutral-400">SCENARIO ENGINE</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Sunset Sanctuary', desc: 'Soft 2400K golden cove illumination, terrace lanterns ignited' },
                  { name: 'Deep Ocean Calm', desc: 'Diffused underwater basin wash, low glare reading lights' },
                  { name: 'Midnight Cinema', desc: 'Darkened interior, focused pin-spot sommelier illumination only' },
                  { name: 'Morning Awakening', desc: 'Circadian sunrise ramp, terrace motorized sheers drawn back' },
                ].map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => setActiveMood(mood.name)}
                    className={`w-full text-left p-3 border transition-all cursor-pointer ${
                      activeMood === mood.name
                        ? 'bg-white/[0.06] border-[#c8aa6e]/60 text-white'
                        : 'bg-white/[0.01] border-white/[0.05] hover:border-white/15 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-medium">
                      <span>{mood.name}</span>
                      {activeMood === mood.name && (
                        <span className="text-[10px] text-[#c8aa6e] uppercase">ENGAGED</span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1 font-light">{mood.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 2: ROOM SERVICE & RESTAURANT BOOKING */}
      {activeCategory === 'dining' && (
        <div className="space-y-8">
          {orderedNotice && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{orderedNotice}</span>
            </div>
          )}

          {/* In-Villa Room Service Menu */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-editorial text-white">In-Villa Gastronomy & Sommelier Menu</h3>
                <p className="text-xs font-mono text-neutral-400">Direct hot-box delivery to Villa 12 terrace</p>
              </div>
              <span className="text-xs font-mono text-[#c8aa6e]">HOT-BOX TRANSIT · 22 MIN ETA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Beluga Imperial Caviar (50g)', desc: 'Warm buckwheat blinis, organic crème fraîche, sieved farm egg', price: 420 },
                { name: 'Charred Brittany Blue Lobster', desc: 'Kombu butter glaze, saffron coral emulsion, charred sea asparagus', price: 280 },
                { name: 'Miyazaki Wagyu A5 Striploin (200g)', desc: 'Bincho-tan grilled, smoked bone marrow ponzu, wasabi snow', price: 340 },
                { name: 'Krug Clos d’Ambonnay Champagne (2002)', desc: 'Chilled in crystal ice bucket, served with Riedel sommelier flutes', price: 2850 },
                { name: 'White Alba Truffle Tagliolini', desc: 'Hand-rolled yolk pasta, cultured Normandy butter, shaved tableside', price: 195 },
                { name: 'Valrhona Grand Cru Dark Soufflé', desc: 'Madagascar bourbon vanilla pod gelato, salted caramel drip', price: 65 },
              ].map((item) => (
                <div
                  key={item.name}
                  className="p-5 bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex justify-between text-sm font-medium text-white">
                      <span>{item.name}</span>
                      <span className="text-[#c8aa6e] font-mono tabular-nums">${item.price}</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-light mt-1">{item.desc}</p>
                  </div>

                  <button
                    onClick={() => handleOrderRoomService(item.name, item.price)}
                    className="self-end px-3 py-1.5 bg-white/[0.04] hover:bg-[#c8aa6e] hover:text-[#050505] text-[#c8aa6e] border border-white/10 hover:border-transparent text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order to Villa 12</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Table Reservation */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">TABLE BOOKING</span>
                <h3 className="text-lg font-editorial text-white">The Obsidian Terrace Reservation</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">MICHELIN DINING CONCEPT</span>
            </div>

            {diningSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                Table reserved for {diningCovers} guests on {diningDate} at {diningTime}. Concierge notified.
              </div>
            )}

            <form onSubmit={handleBookTable} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-neutral-400 block">Date</label>
                <input
                  type="date"
                  value={diningDate}
                  onChange={(e) => setDiningDate(e.target.value)}
                  className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 block">Time Slot</label>
                <select
                  value={diningTime}
                  onChange={(e) => setDiningTime(e.target.value)}
                  className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                >
                  <option value="19:00">19:00 PM (Sunset Seating)</option>
                  <option value="20:00">20:00 PM (Chef Pairing)</option>
                  <option value="21:15">21:15 PM (Late Cellar)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 block">Covers (Guests)</label>
                <select
                  value={diningCovers}
                  onChange={(e) => setDiningCovers(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={6}>6 Guests (Private Cellar)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reserve Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY 3: SPA, WELLNESS & EXPERIENCES */}
      {activeCategory === 'wellness' && (
        <div className="space-y-8">
          {/* Spa Booking */}
          <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">VITALITY & RECOVERY</span>
                <h3 className="text-lg font-editorial text-white">Thermal Spa & Hydrotherapy Sanctuary</h3>
              </div>
              <span className="text-xs font-mono text-neutral-400">SUBTERRANEAN GROTTO</span>
            </div>

            {spaSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                {spaService} booked for {spaTime}. Private therapy suite confirmed.
              </div>
            )}

            <form onSubmit={handleBookWellness} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-neutral-400 block">Therapeutic Experience</label>
                <select
                  value={spaService}
                  onChange={(e) => setSpaService(e.target.value)}
                  className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                >
                  <option value="Subterranean Thermal Mineral Bath">Subterranean Thermal Mineral Bath (90 min)</option>
                  <option value="Deep Muscular Osteopathy & Sound Bath">Deep Muscular Osteopathy & Sound Bath (120 min)</option>
                  <option value="Finnish Cedar Cryotherapy & Cold Plunge">Finnish Cedar Cryotherapy & Cold Plunge (60 min)</option>
                  <option value="In-Villa Sunset Botanical Massage">In-Villa Sunset Botanical Massage (90 min)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 block">Preferred Schedule</label>
                <select
                  value={spaTime}
                  onChange={(e) => setSpaTime(e.target.value)}
                  className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                >
                  <option value="16:00 Tomorrow">Tomorrow 16:00 PM</option>
                  <option value="18:30 Tomorrow">Tomorrow 18:30 PM (Sunset)</option>
                  <option value="10:00 Morning">Morning 10:00 AM</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Book Wellness Slot
                </button>
              </div>
            </form>
          </div>

          {/* Activities & Experiences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-editorial text-white">Activities & Curated Expeditions</h3>
                <p className="text-xs font-mono text-neutral-400">Archipelago marine adventures and aviation</p>
              </div>
              <span className="text-xs font-mono text-[#c8aa6e]">NORTH PIER JETTY DISPATCH</span>
            </div>

            {activitySuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                {activitySelected} reservation submitted. Private skipper and sommelier assigned.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Supercatamaran Sunset Cruise', duration: '3 Hours', desc: 'Private twin-hull yacht sailing through the coral atolls with live oyster shucking and Dom Pérignon.', price: 4800 },
                { title: 'Outer Reef Deep Seaplane Excursion', duration: '4 Hours', desc: 'Twin-turbine seaplane flight to deserted coral sandbank with champagne picnic and private dive master.', price: 6200 },
                { title: 'Submersible Marine Safari', duration: '2 Hours', desc: 'Triton 3300 personal deep submersible dive along the continental shelf abyssal reef wall.', price: 8500 },
              ].map((act) => (
                <div key={act.title} className="p-5 bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-mono text-[#c8aa6e] block">{act.duration}</span>
                    <h4 className="text-base font-editorial text-white mt-1">{act.title}</h4>
                    <p className="text-xs text-neutral-400 font-light mt-1.5 leading-relaxed">{act.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-sm font-mono text-white tabular-nums">${act.price.toLocaleString()}</span>
                    <button
                      onClick={() => {
                        setActivitySelected(act.title);
                        setActivitySuccess(true);
                        setTimeout(() => setActivitySuccess(false), 5000);
                      }}
                      className="px-3 py-1.5 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] text-xs font-mono uppercase font-semibold transition-colors cursor-pointer"
                    >
                      Book Charter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 4: CONCIERGE, SERVICE REQUESTS & REPORT AN ISSUE */}
      {activeCategory === 'concierge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Direct Concierge Line (Butler Chat) */}
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/[0.08] p-6 space-y-4 flex flex-col justify-between h-[520px]">
            <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e] block">DEDICATED CONCIERGE LINE</span>
                <div className="text-base font-editorial text-white">Head Butler Mei Lin</div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE (14ms)
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 text-xs font-mono space-y-1 max-w-[85%] ${
                    msg.sender.includes('Lord')
                      ? 'ml-auto bg-[#c8aa6e]/15 border border-[#c8aa6e]/30 text-white'
                      : 'mr-auto bg-white/[0.03] border border-white/[0.06] text-neutral-300'
                  }`}
                >
                  <div className="text-[10px] text-neutral-400 flex justify-between gap-4">
                    <span>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="font-light">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-white/[0.06]">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message your personal butler..."
                className="flex-1 p-2.5 bg-white/[0.03] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c8aa6e] font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] text-xs font-mono uppercase font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Service Request & Report Issue Forms */}
          <div className="lg:col-span-5 space-y-6">
            {/* Request Service Form */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-4">
              <span className="text-xs font-mono uppercase text-[#c8aa6e] block">
                Quick Service Request
              </span>
              {serviceSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  Service dispatch confirmed for Villa 12.
                </div>
              )}
              <form onSubmit={handleRequestService} className="space-y-3 text-xs font-mono">
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full p-2 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                >
                  <option value="Towels & Linen">Extra Egyptian Cotton Towels & Bathrobe</option>
                  <option value="Pillow Menu">Pillow Selection Adjustment</option>
                  <option value="Ice & Bar">Artisanal Clear Ice Bucket & Bar Restock</option>
                  <option value="Luggage Transfer">Luggage Collection & Packing Service</option>
                </select>
                <input
                  type="text"
                  value={serviceDetails}
                  onChange={(e) => setServiceDetails(e.target.value)}
                  placeholder="Additional timing or notes..."
                  className="w-full p-2 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-white/[0.05] hover:bg-white/10 text-white border border-white/20 uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Request Service
                </button>
              </form>
            </div>

            {/* Report An Issue Form */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Report A Sanctuary Issue</span>
              </div>
              {issueSubmitted && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  Issue received. Engineering assigned to inspect quietly without disturbance.
                </div>
              )}
              <form onSubmit={handleReportIssue} className="space-y-3 text-xs font-mono">
                <select
                  value={issueFacility}
                  onChange={(e) => setIssueFacility(e.target.value)}
                  className="w-full p-2 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                >
                  <option value="Sub-floor Climate">Sub-floor Climate / HVAC</option>
                  <option value="Infinity Pool Heater">Private Infinity Pool Heater</option>
                  <option value="Bang & Olufsen Audio">B&O Audio & Home Automation</option>
                  <option value="High-Speed Wi-Fi">Private Satellite Wi-Fi</option>
                </select>
                <input
                  type="text"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Describe the issue observed..."
                  className="w-full p-2 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Dispatch Engineering
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 5: RESIDENCE BILL & FOLIO */}
      {activeCategory === 'billing' && (
        <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <div className="text-xs font-mono uppercase text-[#c8aa6e]">{bill.folioNumber}</div>
              <h3 className="text-xl sm:text-2xl font-editorial text-white">Itemized Folio & Charges</h3>
              <p className="text-xs font-mono text-neutral-400">Assigned Sanctuary: Villa 12 · Currency: USD</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-neutral-400">OUTSTANDING BALANCE</div>
              <div className="text-3xl font-mono text-white tabular-nums">${bill.outstandingBalance.toLocaleString()}</div>
            </div>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {bill.charges.map((charge) => (
              <div key={charge.id} className="py-3 flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-white font-medium">{charge.description}</div>
                  <div className="text-[11px] text-neutral-500">{charge.category} · {charge.date}</div>
                </div>
                <div className="text-white font-medium tabular-nums">${charge.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-400 block">Tokenized Payment Instrument:</span>
              <span className="text-white">{bill.paymentMethod}</span>
            </div>
            {bill.outstandingBalance > 0 ? (
              <button
                onClick={() => settleFolio(bill.id)}
                className="px-6 py-2.5 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-[0_0_20px_rgba(200,170,110,0.25)]"
              >
                Settle Balance (${bill.outstandingBalance.toLocaleString()})
              </button>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" /> FOLIO FULLY SETTLED & BALANCED
              </span>
            )}
          </div>
        </div>
      )}

      {/* CATEGORY 6: PROFILE, PREFERENCES, NOTIFICATIONS & FEEDBACK */}
      {activeCategory === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Notifications Feed */}
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c8aa6e]">
                <Bell className="w-4 h-4" />
                <span>Guest Push Notifications</span>
              </div>
              <span className="text-xs font-mono text-neutral-500">LIVE FEED</span>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-3 bg-white/[0.02] border border-white/[0.05] space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-medium">{notif.title}</span>
                    <span className="text-[10px] text-neutral-500">{notif.time}</span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light">{notif.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Preferences & Stay Feedback */}
          <div className="lg:col-span-7 space-y-6">
            {/* Preferences Form */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-4">
              <span className="text-xs font-mono uppercase text-[#c8aa6e] block">
                VIP Profile & Curated Preferences
              </span>
              {prefsSaved && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  Preferences updated in sovereign guest enclave.
                </div>
              )}
              <form onSubmit={handleSavePreferences} className="space-y-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Dietary & Allergen Nuances</label>
                  <input
                    type="text"
                    value={userPrefs.dietary}
                    onChange={(e) => setUserPrefs({ ...userPrefs, dietary: e.target.value })}
                    className="w-full p-2 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Pillow & Bedding Selection</label>
                  <input
                    type="text"
                    value={userPrefs.pillow}
                    onChange={(e) => setUserPrefs({ ...userPrefs, pillow: e.target.value })}
                    className="w-full p-2 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Wine & Cellar Preferences</label>
                  <input
                    type="text"
                    value={userPrefs.wine}
                    onChange={(e) => setUserPrefs({ ...userPrefs, wine: e.target.value })}
                    className="w-full p-2 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] uppercase font-semibold transition-colors cursor-pointer"
                >
                  Save Preferences
                </button>
              </form>
            </div>

            {/* In-Stay Feedback */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-4">
              <span className="text-xs font-mono uppercase text-[#c8aa6e] block">
                Stay Experience & Satisfaction
              </span>
              {feedbackSuccess ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  Thank you, Lord Harrington. Your observations are transmitted to the General Manager.
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating ? 'text-[#c8aa6e] fill-[#c8aa6e]' : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-[#c8aa6e] ml-2">{rating} / 5 Stars</span>
                  </div>
                  <textarea
                    rows={3}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Share your in-stay impressions directly with executive leadership..."
                    className="w-full p-2 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e] resize-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-white border border-white/20 uppercase font-semibold transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multimodal AI Vision Issue Agent Modal */}
      <IssueAgentModal
        isOpen={isIssueAgentOpen}
        onClose={() => setIsIssueAgentOpen(false)}
        defaultLocation="Villa 12"
        reportedBy="Lord Alexander Harrington (Guest)"
      />
    </div>
  );
};
