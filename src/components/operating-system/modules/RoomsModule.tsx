import React, { useState } from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { Room, RoomStatus } from '../../../types';
import { Compass, CheckCircle2, AlertCircle, Wrench, Sparkles, Filter } from 'lucide-react';

export const RoomsModule: React.FC = () => {
  const { rooms, updateRoomStatus, updateRoomInspection, locateOn3DTwin } = useResortOS();
  const [filterStatus, setFilterStatus] = useState<'All' | RoomStatus>('All');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = rooms.filter((r) => filterStatus === 'All' || r.status === filterStatus);

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'Available':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Occupied':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'Reserved':
        return 'text-[#c8aa6e] bg-[#c8aa6e]/10 border-[#c8aa6e]/20';
      case 'Cleaning':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Maintenance':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Out of Service':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            02. Sanctuary & Key Management
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            SPATIAL LIVING UNITS · ENVIRONMENTAL SENSING · REAL-TIME CLEANING & INSPECTION STATUS
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.02] border border-white/10 text-xs font-mono">
          {(['All', 'Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance', 'Out of Service'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 transition-colors cursor-pointer ${
                filterStatus === st ? 'bg-white/[0.1] text-white font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((rm) => (
          <div
            key={rm.id}
            className="p-5 bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-all space-y-4"
          >
            {/* Room Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-editorial text-white tracking-wide">{rm.number}</div>
                <div className="text-[11px] font-mono text-neutral-400 mt-0.5">{rm.type} · {rm.floor}</div>
              </div>

              <span className={`px-2 py-0.5 text-[10px] font-mono uppercase border ${getStatusBadge(rm.status)}`}>
                {rm.status}
              </span>
            </div>

            {/* Current Guest or Availability */}
            <div className="p-3 bg-white/[0.02] border border-white/[0.05] text-xs font-mono space-y-1">
              <div className="text-neutral-400 text-[11px] uppercase tracking-wider">Occupancy / Assignment:</div>
              <div className="text-white font-medium">{rm.currentGuest || 'Vacant & Ready for Guest'}</div>
              <div className="text-neutral-400 text-[11px]">Nightly Rate: ${rm.ratePerNight.toLocaleString()}</div>
            </div>

            {/* Inspection & Environmental Telemetry */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/[0.05]">
              <div>
                <div className="text-[11px] text-neutral-400">Inspection:</div>
                <div className="text-neutral-200">{rm.inspectionStatus}</div>
              </div>
              <div>
                <div className="text-[11px] text-neutral-400">Sub-floor Climate:</div>
                <div className="text-neutral-200">{rm.climateTemp}°C Balance</div>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2">
              <select
                value={rm.status}
                onChange={(e) => updateRoomStatus(rm.id, e.target.value as RoomStatus)}
                className="text-[11px] font-mono p-1.5 bg-[#0e1118] border border-white/10 text-neutral-300 focus:outline-none focus:border-[#c8aa6e]"
              >
                <option value="Available">Set Available</option>
                <option value="Occupied">Set Occupied</option>
                <option value="Reserved">Set Reserved</option>
                <option value="Cleaning">Set Cleaning</option>
                <option value="Maintenance">Set Maintenance</option>
                <option value="Out of Service">Set Out of Service</option>
              </select>

              <button
                onClick={() => locateOn3DTwin(rm.zoneId)}
                className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#c8aa6e] hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Pivot camera to this zone on the 3D twin"
              >
                <Compass className="w-3 h-3 text-[#c8aa6e]" />
                <span>Locate on Twin</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
