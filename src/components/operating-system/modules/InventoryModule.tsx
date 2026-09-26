import React from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { Package, AlertCircle, ShoppingCart, CheckCircle2, TrendingDown } from 'lucide-react';

export const InventoryModule: React.FC = () => {
  const { inventoryItems, reorderInventoryItem } = useResortOS();

  const lowStockCount = inventoryItems.filter((i) => i.status === 'Low Stock' || i.status === 'Critical Alert').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            07. Autonomous Supply Chain & Cellar Inventory
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            WEIGHT-PAD TRACKING · PREDICTIVE PAR LEVELS · ONE-CLICK RESTOCK PO ENGINE
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>{lowStockCount} Items Below Reorder Threshold</span>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="border border-white/[0.08] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-white/[0.03] text-neutral-400 border-b border-white/[0.08]">
            <tr>
              <th className="py-3 px-4 uppercase tracking-wider">SKU / Item</th>
              <th className="py-3 px-4 uppercase tracking-wider">Category</th>
              <th className="py-3 px-4 uppercase tracking-wider">Current Stock</th>
              <th className="py-3 px-4 uppercase tracking-wider">Min Threshold</th>
              <th className="py-3 px-4 uppercase tracking-wider">Supplier</th>
              <th className="py-3 px-4 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 uppercase tracking-wider text-right">Autonomous Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {inventoryItems.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="text-white font-medium">{item.name}</div>
                  <div className="text-[11px] text-neutral-500">{item.sku}</div>
                </td>
                <td className="py-3.5 px-4 text-[#c8aa6e]">{item.category}</td>
                <td className="py-3.5 px-4 font-medium text-white tabular-nums">
                  {item.currentStock} {item.unit}
                </td>
                <td className="py-3.5 px-4 text-neutral-400 tabular-nums">
                  {item.minThreshold} {item.unit}
                </td>
                <td className="py-3.5 px-4 text-neutral-300">{item.supplier}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase ${
                      item.status === 'Optimal'
                        ? 'text-emerald-400 bg-emerald-400/10'
                        : 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {item.status !== 'Optimal' ? (
                    <button
                      onClick={() => reorderInventoryItem(item.id)}
                      className="px-3 py-1.5 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] font-semibold text-[11px] uppercase transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Reorder (+{item.reorderQuantity})</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-neutral-500 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Stock Sufficient
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
