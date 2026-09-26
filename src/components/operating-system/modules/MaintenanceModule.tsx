import React, { useState } from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { MaintenanceIssue, ZoneId } from '../../../types';
import { Compass, Wrench, Plus, CheckCircle2, AlertOctagon, X } from 'lucide-react';

export const MaintenanceModule: React.FC = () => {
  const { maintenanceIssues, createWorkOrder, updateIssueStatus, locateOn3DTwin } = useResortOS();
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [roomOrFacility, setRoomOrFacility] = useState('Villa 06 Sub-floor');
  const [zoneId, setZoneId] = useState<ZoneId>('ocean-villas');
  const [equipment, setEquipment] = useState('Geothermal Chiller Loop B');
  const [priority, setPriority] = useState<MaintenanceIssue['priority']>('High');
  const [severity, setSeverity] = useState<MaintenanceIssue['severity']>('Precautionary');
  const [assignedTechnician, setAssignedTechnician] = useState('Chief Eng. Victor Hansen');
  const [estDowntime, setEstDowntime] = useState('30 mins');
  const [isPreventive, setIsPreventive] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createWorkOrder({
      title,
      roomOrFacility,
      zoneId,
      equipment,
      priority,
      severity,
      assignedTechnician,
      status: 'Dispatched',
      estDowntime,
      isPreventive,
    });
    setShowModal(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            05. Plant Health & Predictive Maintenance
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            VIBRATION SENSING · ACOUSTIC ANOMALIES · GEOTHERMAL & OZONE TELEMETRY
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(200,170,110,0.2)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {maintenanceIssues.map((issue) => (
          <div
            key={issue.id}
            className="p-5 bg-white/[0.02] border border-white/[0.07] hover:border-white/15 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#c8aa6e]">{issue.ticketId}</span>
                <span className="text-sm font-medium text-white">{issue.title}</span>
                {issue.isPreventive && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 text-cyan-400 bg-cyan-400/10 border border-cyan-400/20">
                    PREVENTIVE
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                    issue.priority === 'Critical'
                      ? 'text-red-400 bg-red-400/10 border border-red-400/30'
                      : issue.priority === 'High'
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-neutral-400 bg-white/[0.04]'
                  }`}
                >
                  {issue.priority} Priority
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                    issue.status === 'Resolved'
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : issue.status === 'Dispatched'
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-amber-400 bg-amber-400/10'
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-2 border-t border-white/[0.05] text-neutral-400">
              <div>
                <span className="text-[11px] text-neutral-500 block">Facility / Equipment:</span>
                <span className="text-neutral-200">{issue.equipment}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block">Assigned Specialist:</span>
                <span className="text-neutral-200">{issue.assignedTechnician}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block">Est. Downtime:</span>
                <span className="text-neutral-200">{issue.estDowntime}</span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 block">Severity Classification:</span>
                <span className="text-neutral-200">{issue.severity}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
              <div className="flex items-center gap-2">
                {issue.status !== 'Resolved' && (
                  <button
                    onClick={() => updateIssueStatus(issue.id, 'Resolved')}
                    className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono uppercase transition-colors cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                )}
                {issue.status === 'Open' && (
                  <button
                    onClick={() => updateIssueStatus(issue.id, 'Dispatched')}
                    className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono uppercase transition-colors cursor-pointer"
                  >
                    Dispatch Tech
                  </button>
                )}
              </div>

              <button
                onClick={() => locateOn3DTwin(issue.zoneId)}
                className="px-3 py-1.5 text-xs font-mono uppercase text-[#c8aa6e] hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Locate Issue on 3D Twin</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Work Order */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#090b10] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono uppercase text-[#c8aa6e]">FACILITIES ENGINEERING</span>
                <h3 className="text-lg font-editorial text-white">Issue Work Order Ticket</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-neutral-400 block">Work Order Title & Anomaly</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Infinity Pool Basin Heated Circulation Loop Valve Sensor Failure..."
                  className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Equipment Component</label>
                  <input
                    type="text"
                    required
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    placeholder="e.g. Chiller Pump B4"
                    className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Property Zone</label>
                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value as ZoneId)}
                    className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  >
                    <option value="ocean-villas">Overwater Villa Enclave</option>
                    <option value="central-pavilion">Central Grand Pavilion</option>
                    <option value="infinity-pool">Horizon Infinity Pool</option>
                    <option value="culinary-pavilion">The Obsidian Restaurant</option>
                    <option value="wellness-spa">Thermal Spa Sanctuary</option>
                    <option value="arrival-pier">North Arrival Pier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as MaintenanceIssue['priority'])}
                    className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as MaintenanceIssue['severity'])}
                    className="w-full p-2.5 bg-[#0e1118] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  >
                    <option value="Operational Impact">Operational Impact</option>
                    <option value="Precautionary">Precautionary</option>
                    <option value="Cosmetic">Cosmetic</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400 block">Est. Downtime</label>
                  <input
                    type="text"
                    value={estDowntime}
                    onChange={(e) => setEstDowntime(e.target.value)}
                    className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white focus:outline-none focus:border-[#c8aa6e]/60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-white/10 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] font-semibold tracking-wider uppercase"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
