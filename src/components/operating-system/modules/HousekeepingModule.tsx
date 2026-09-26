import React from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { HousekeepingTask } from '../../../types';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, Box } from 'lucide-react';

export const HousekeepingModule: React.FC = () => {
  const { housekeepingTasks, updateTaskStatus, lostAndFound } = useResortOS();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            04. Housekeeping & Environmental Care
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            DYNAMIC TASK QUEUE · SENSOR-TRIGGERED TURNAROUND · LINEN TELEMETRY & VAULT
          </p>
        </div>
      </div>

      {/* Housekeeping Tasks Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Active Turnaround Queue ({housekeepingTasks.length} Units Scheduled)
          </span>
          <span className="text-xs font-mono text-[#c8aa6e]">
            MEAN TURNAROUND VELOCITY: 38 MIN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {housekeepingTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-editorial text-white">{task.roomNumber}</div>
                  <div className="text-[11px] font-mono text-neutral-400">{task.taskType}</div>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase ${
                    task.priority === 'Urgent VIP'
                      ? 'text-red-400 bg-red-400/10 border border-red-400/30'
                      : task.priority === 'High'
                      ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30'
                      : 'text-neutral-400 bg-white/[0.04]'
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                {task.notes}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-white/[0.05] text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Assigned:</span>
                  <span className="text-white">{task.assignedStaff}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Est. Completion:</span>
                  <span className="text-neutral-200">~{task.estMinutes} minutes remaining</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Linen Status:</span>
                  <span className="text-[#c8aa6e]">{task.linenStatus}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <span
                  className={`text-[11px] font-mono uppercase px-2 py-0.5 ${
                    task.status === 'Completed' || task.status === 'Inspected'
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : task.status === 'In Progress'
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-amber-400 bg-amber-400/10'
                  }`}
                >
                  {task.status}
                </span>

                <div className="flex items-center gap-1.5">
                  {task.status !== 'In Progress' && task.status !== 'Completed' && task.status !== 'Inspected' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'In Progress')}
                      className="px-2.5 py-1 text-[11px] font-mono text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 cursor-pointer"
                    >
                      Start
                    </button>
                  )}
                  {task.status === 'In Progress' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Completed')}
                      className="px-2.5 py-1 text-[11px] font-mono text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 cursor-pointer"
                    >
                      Complete
                    </button>
                  )}
                  {task.status === 'Completed' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Inspected')}
                      className="px-2.5 py-1 text-[11px] font-mono text-[#c8aa6e] bg-[#c8aa6e]/20 hover:bg-[#c8aa6e]/30 border border-[#c8aa6e]/30 cursor-pointer"
                    >
                      Certify
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lost and Found Vault Records */}
      <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c8aa6e]">
            <Box className="w-4 h-4" />
            <span>Secure Lost & Found Vault Ledger</span>
          </div>
          <span className="text-xs font-mono text-neutral-400">BIOMETRIC SECURITY LOCKER</span>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {lostAndFound.map((item) => (
            <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div>
                <span className="text-white font-medium">{item.item}</span>
                <div className="text-[11px] text-neutral-500">
                  Location: {item.location} · Found by: {item.foundBy} on {item.date}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] uppercase self-start sm:self-auto ${
                  item.status === 'Stored in Vault' ? 'text-amber-400 bg-amber-400/10' : 'text-emerald-400 bg-emerald-400/10'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
