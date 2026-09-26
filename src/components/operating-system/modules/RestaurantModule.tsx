import React from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { UtensilsCrossed, Wine, ChefHat, Clock, CheckCircle2 } from 'lucide-react';

export const RestaurantModule: React.FC = () => {
  const { restaurantTables, kitchenOrders, updateKitchenOrderStatus } = useResortOS();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            06. Gastronomy, Cellar & Kitchen Command
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            THE OBSIDIAN TERRACE · IN-VILLA HOT BOX ROUTING · SOMMELIER DISPATCH
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-neutral-500 block">DAILY COVERS</span>
            <span className="text-white text-base font-medium">142 Seated</span>
          </div>
          <div>
            <span className="text-neutral-500 block">F&B REVENUE</span>
            <span className="text-[#c8aa6e] text-base font-medium">$18,420</span>
          </div>
        </div>
      </div>

      {/* Table Layout Overview */}
      <div className="space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
          Venue Seating & Table Availability
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {restaurantTables.map((tbl) => (
            <div
              key={tbl.id}
              className="p-4 bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-editorial text-white">{tbl.tableNumber}</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                    tbl.status === 'Available'
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : tbl.status === 'Occupied'
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-amber-400 bg-amber-400/10'
                  }`}
                >
                  {tbl.status}
                </span>
              </div>

              <div className="text-xs font-mono text-neutral-400">
                {tbl.section} · Cap: {tbl.capacity} Guests
              </div>

              {tbl.currentReservation ? (
                <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono text-[#c8aa6e]">
                  <div>{tbl.currentReservation.guestName} ({tbl.currentReservation.time})</div>
                  <div className="text-neutral-400 font-light truncate">{tbl.currentReservation.notes}</div>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/[0.05] text-[11px] font-mono text-neutral-500">
                  Ready for walk-in or tasting allocation
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Kitchen Preparation Line (Dine-in & In-Villa Dining) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#c8aa6e]">
            <ChefHat className="w-4 h-4" />
            <span>Active Kitchen Expediter Line</span>
          </div>
          <span className="text-xs font-mono text-neutral-400">CHEF DE CUISINE: LAURENT DUFOUR</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kitchenOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 bg-white/[0.02] border border-white/[0.07] hover:border-white/15 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-white">{ord.orderNumber}</span>
                  <span className="text-xs font-mono text-[#c8aa6e] ml-2">[{ord.type} · {ord.tableOrRoom}]</span>
                </div>

                <span
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase ${
                    ord.status === 'Delivered'
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : ord.status === 'Plated'
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-amber-400 bg-amber-400/10'
                  }`}
                >
                  {ord.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-neutral-300">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">Ordered at {ord.time}</span>

                <div className="flex items-center gap-2">
                  {ord.status === 'Preparing' && (
                    <button
                      onClick={() => updateKitchenOrderStatus(ord.id, 'Plated')}
                      className="px-2.5 py-1 text-[11px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 cursor-pointer"
                    >
                      Plate Order
                    </button>
                  )}
                  {ord.status === 'Plated' && (
                    <button
                      onClick={() => updateKitchenOrderStatus(ord.id, 'Delivered')}
                      className="px-2.5 py-1 text-[11px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 cursor-pointer"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
