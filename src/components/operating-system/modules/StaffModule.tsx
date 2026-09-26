import React from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { StaffMember } from '../../../types';
import { Users, Shield, Clock, CheckCircle2 } from 'lucide-react';

export const StaffModule: React.FC = () => {
  const { staffMembers, updateStaffAttendance } = useResortOS();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            08. Staff Roster & Operational Choreography
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            DYNAMIC SHIFTS · ATTENDANCE MONITORING · SPECIALIST WORKLOAD CAPACITIES
          </p>
        </div>

        <div className="text-xs font-mono text-[#c8aa6e]">
          48 TOTAL IN SERVICE · 4 DEPARTMENTS BALANCED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="p-5 bg-white/[0.02] border border-white/[0.07] hover:border-white/15 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-medium text-white">{staff.name}</div>
                <div className="text-xs font-mono text-[#c8aa6e]">{staff.role}</div>
                <div className="text-[11px] font-mono text-neutral-500">{staff.department} · {staff.contact}</div>
              </div>

              <select
                value={staff.attendance}
                onChange={(e) => updateStaffAttendance(staff.id, e.target.value as StaffMember['attendance'])}
                className={`text-[11px] font-mono p-1 border uppercase ${
                  staff.attendance === 'On Duty'
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
                    : 'text-neutral-400 bg-[#0e1118] border-white/10'
                }`}
              >
                <option value="On Duty">On Duty</option>
                <option value="Scheduled">Scheduled</option>
                <option value="On Break">On Break</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-white/[0.05]">
              <div>
                <span className="text-[11px] text-neutral-500 block">Shift Timing:</span>
                <span className="text-neutral-300">{staff.shift}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block">Workload & Rating:</span>
                <span className="text-white">{staff.activeTasks} Active Tasks · {staff.performanceRating}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
