import React, { useState } from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { Receipt, CheckCircle2, DollarSign, Download } from 'lucide-react';

export const PaymentsModule: React.FC = () => {
  const { guestBills, settleFolio } = useResortOS();
  const [selectedBillId, setSelectedBillId] = useState(guestBills[0]?.id);

  const activeBill = guestBills.find((b) => b.id === selectedBillId) || guestBills[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            09. Sovereign Ledger & Guest Billing
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            CONSOLIDATED FOLIOS · TOKENIZED CAPTURE · MULTI-CURRENCY SETTLEMENT
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-300">
          DAILY BILLED: <span className="text-[#c8aa6e] font-medium">$48,920 USD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Folio Selector */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono uppercase text-neutral-400 block px-1">
            Active Guest Folios
          </span>
          <div className="space-y-2">
            {guestBills.map((bill) => {
              const isSelected = bill.id === selectedBillId;
              return (
                <button
                  key={bill.id}
                  onClick={() => setSelectedBillId(bill.id)}
                  className={`w-full text-left p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.06] border-[#c8aa6e]/60'
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#c8aa6e]">{bill.folioNumber}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                        bill.status === 'Settled'
                          ? 'text-emerald-400 bg-emerald-400/10'
                          : 'text-amber-400 bg-amber-400/10'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white mt-1">{bill.guestName}</div>
                  <div className="text-xs font-mono text-neutral-400 mt-1">
                    {bill.roomNumber} · Outstanding: ${bill.outstandingBalance.toLocaleString()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Folio Itemized Breakdown */}
        <div className="lg:col-span-8 bg-white/[0.02] border border-white/[0.08] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <span className="text-xs font-mono text-[#c8aa6e] uppercase">{activeBill.folioNumber}</span>
              <h3 className="text-2xl font-editorial text-white mt-1">{activeBill.guestName}</h3>
              <p className="text-xs font-mono text-neutral-400">Assigned Sanctuary: {activeBill.roomNumber}</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-neutral-400 block">TOTAL BALANCE</span>
              <span className="text-2xl font-mono text-white tabular-nums">${activeBill.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Charges List */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
              Itemized Charges & Vouchers
            </span>

            <div className="divide-y divide-white/[0.05]">
              {activeBill.charges.map((chg) => (
                <div key={chg.id} className="py-3 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="text-white">{chg.description}</div>
                    <div className="text-[11px] text-neutral-500">{chg.category} · {chg.date}</div>
                  </div>
                  <span className="text-neutral-200 font-medium tabular-nums">
                    ${chg.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settlement Bar */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-neutral-400 block">Tokenized Method:</span>
              <span className="text-white">{activeBill.paymentMethod}</span>
            </div>

            {activeBill.outstandingBalance > 0 ? (
              <button
                onClick={() => settleFolio(activeBill.id)}
                className="px-4 py-2 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] uppercase tracking-wider font-semibold transition-colors cursor-pointer"
              >
                Capture Outstanding (${activeBill.outstandingBalance})
              </button>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" /> LEDGER BALANCED & SETTLED
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
