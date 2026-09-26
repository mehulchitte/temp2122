import React, { useState } from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { ShieldCheck, Lock, Key, Terminal, Search } from 'lucide-react';

export const AuditModule: React.FC = () => {
  const { auditLogs } = useResortOS();
  const [filterAction, setFilterAction] = useState('All');

  const filteredLogs = auditLogs.filter(
    (log) => filterAction === 'All' || log.actionType === filterAction
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            12. Cryptographic Audit Trail & Security
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            IMMUTABLE EVENT STREAM · HARDWARE SECURITY ENCLAVE · RBAC PRIVILEGE LOGS
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>ZERO-TRUST ENCLAVE ACTIVE</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        {['All', 'AUTH_LOGIN', 'RESERVATION_CREATED', 'ROOM_STATUS_CHANGE', 'PAYMENT_CAPTURE', 'MAINTENANCE_DISPATCH', 'ROLE_PERMISSION_CHANGE'].map((act) => (
          <button
            key={act}
            onClick={() => setFilterAction(act)}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              filterAction === act
                ? 'bg-white/[0.1] border-[#c8aa6e]/60 text-white font-medium'
                : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white'
            }`}
          >
            {act}
          </button>
        ))}
      </div>

      {/* Audit Log Terminal / Table */}
      <div className="border border-white/[0.08] overflow-x-auto bg-[#07090d]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/[0.03] text-neutral-400 border-b border-white/[0.08]">
            <tr>
              <th className="py-3 px-4 uppercase tracking-wider">Timestamp</th>
              <th className="py-3 px-4 uppercase tracking-wider">Actor / Role</th>
              <th className="py-3 px-4 uppercase tracking-wider">Action Type</th>
              <th className="py-3 px-4 uppercase tracking-wider">Target Resource</th>
              <th className="py-3 px-4 uppercase tracking-wider">Cryptographic Details</th>
              <th className="py-3 px-4 uppercase tracking-wider">Node IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3 px-4">
                  <div className="text-white font-medium">{log.actor}</div>
                  <div className="text-[11px] text-[#c8aa6e]">{log.role}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 text-[10px] uppercase font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
                    {log.actionType}
                  </span>
                </td>
                <td className="py-3 px-4 text-white font-medium">{log.targetResource}</td>
                <td className="py-3 px-4 text-neutral-300 max-w-xs truncate">{log.details}</td>
                <td className="py-3 px-4 text-neutral-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
