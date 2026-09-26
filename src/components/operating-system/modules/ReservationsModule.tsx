import React, { useState } from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { Reservation } from '../../../types';
import { Plus, Check, X, Calendar, AlertTriangle, ShieldCheck, Search } from 'lucide-react';

export const ReservationsModule: React.FC = () => {
  const { reservations, createReservation, updateReservationStatus, cancelReservation, rooms } = useResortOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Reservation['status']>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('Villa 01');
  const [roomType, setRoomType] = useState('Cliffside Residence');
  const [checkIn, setCheckIn] = useState('2026-09-28');
  const [checkOut, setCheckOut] = useState('2026-10-02');
  const [nights, setNights] = useState(4);
  const [bookingSource, setBookingSource] = useState<Reservation['bookingSource']>('Direct VIP');
  const [totalAmount, setTotalAmount] = useState(12400);
  const [specialRequests, setSpecialRequests] = useState('');

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate overbooking warning
  const activeBookingsCount = reservations.filter((r) => r.status === 'Confirmed' || r.status === 'Checked-In').length;
  const totalResortRooms = rooms.length;
  const isOverbooked = activeBookingsCount > totalResortRooms;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) return;

    createReservation({
      guestName,
      guestEmail,
      guestPhone,
      roomNumber,
      roomType,
      checkIn,
      checkOut,
      nights,
      status: 'Confirmed',
      bookingSource,
      paymentStatus: 'Authorized',
      totalAmount,
      adults: 2,
      specialRequests,
      overbookingWarning: false,
    });

    setShowCreateModal(false);
    // Reset
    setGuestName('');
    setGuestEmail('');
    setSpecialRequests('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            01. Reservations & Yield Management
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            REAL-TIME CAPACITY FORECASTING · VIP SOURCES · AUTONOMOUS CHECK-IN LEDGER
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(200,170,110,0.2)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New VIP Reservation</span>
        </button>
      </div>

      {/* Overbooking Guardrail Alert */}
      {isOverbooked ? (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs font-mono text-amber-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <span className="font-semibold uppercase">Overbooking Threshold Alert:</span> Active confirmed bookings ({activeBookingsCount}) exceed available inventory ({totalResortRooms}). Automatic rate surges and private villa rerouting applied.
          </div>
        </div>
      ) : (
        <div className="p-3 bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Capacity Guardrail: {activeBookingsCount} / {totalResortRooms} Sanctuaries Committed ({Math.round((activeBookingsCount/totalResortRooms)*100)}% Booked)</span>
          </div>
          <span className="text-emerald-400">OPTIMAL YIELD ALLOCATION</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guest name, booking ref, or villa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c8aa6e]/60 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/10 text-xs font-mono">
          {(['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                statusFilter === st ? 'bg-white/[0.1] text-white font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="border border-white/[0.08] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/[0.03] text-neutral-400 border-b border-white/[0.08]">
            <tr>
              <th className="py-3 px-4 uppercase tracking-wider">Ref / Guest</th>
              <th className="py-3 px-4 uppercase tracking-wider">Sanctuary</th>
              <th className="py-3 px-4 uppercase tracking-wider">Dates</th>
              <th className="py-3 px-4 uppercase tracking-wider">Booking Channel</th>
              <th className="py-3 px-4 uppercase tracking-wider">Payment</th>
              <th className="py-3 px-4 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filteredReservations.map((res) => (
              <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="text-white font-medium">{res.guestName}</div>
                  <div className="text-[11px] text-neutral-500">{res.bookingRef} · {res.adults} Adults</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="text-neutral-200">{res.roomNumber}</div>
                  <div className="text-[11px] text-neutral-500">{res.roomType}</div>
                </td>
                <td className="py-3.5 px-4 text-neutral-300">
                  <div>{res.checkIn} → {res.checkOut}</div>
                  <div className="text-[11px] text-neutral-500">{res.nights} Nights</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-[#c8aa6e]">{res.bookingSource}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-neutral-300 font-medium tabular-nums">${res.totalAmount.toLocaleString()}</span>
                  <div className="text-[11px] text-emerald-400">{res.paymentStatus}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider ${
                      res.status === 'Checked-In'
                        ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
                        : res.status === 'Confirmed'
                        ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20'
                        : res.status === 'Cancelled'
                        ? 'text-red-400 bg-red-400/10 border border-red-400/20'
                        : 'text-neutral-400 bg-white/[0.04]'
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  {res.status === 'Confirmed' && (
                    <button
                      onClick={() => updateReservationStatus(res.id, 'Checked-In')}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] transition-colors cursor-pointer"
                      title="Check In Guest"
                    >
                      Check In
                    </button>
                  )}
                  {res.status === 'Checked-In' && (
                    <button
                      onClick={() => updateReservationStatus(res.id, 'Checked-Out')}
                      className="px-2.5 py-1 bg-white/[0.05] hover:bg-white/10 text-white border border-white/20 text-[11px] transition-colors cursor-pointer"
                      title="Check Out Guest"
                    >
                      Check Out
                    </button>
                  )}
                  {res.status !== 'Cancelled' && res.status !== 'Checked-Out' && (
                    <button
                      onClick={() => cancelReservation(res.id)}
                      className="px-2 py-1 text-red-400 hover:text-red-300 text-[11px] transition-colors cursor-pointer"
                      title="Cancel Booking"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create VIP Reservation */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#090b10] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">FOLIO PROVISIONING</span>
                <h3 className="text-lg font-editorial text-white">Create New VIP Reservation</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Lady Genevieve Cross"
                    className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="e.g. g.cross@mayfair-consortium.com"
                    className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Sanctuary</label>
                  <select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  >
                    {rooms.map((rm) => (
                      <option key={rm.id} value={rm.number}>
                        {rm.number} ({rm.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Check-In</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Booking Channel</label>
                  <select
                    value={bookingSource}
                    onChange={(e) => setBookingSource(e.target.value as Reservation['bookingSource'])}
                    className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  >
                    <option value="Direct VIP">Direct VIP</option>
                    <option value="Amex Centurion">Amex Centurion</option>
                    <option value="Virtuoso">Virtuoso</option>
                    <option value="Private Jet Consortia">Private Jet Consortia</option>
                    <option value="Direct Web">Direct Web</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Total Rate ($ USD)</label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 block">VIP Itinerary Nuances & Requests</label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Specify yacht transfer, vintage wine preferences, or hypoallergenic linen requirements..."
                  className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-white/10 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] font-semibold tracking-wider uppercase"
                >
                  Commit Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
