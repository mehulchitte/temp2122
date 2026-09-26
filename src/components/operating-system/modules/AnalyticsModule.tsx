import React from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { TrendingUp, BarChart3, Activity, DollarSign, Users, Award } from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const { analytics } = useResortOS();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            11. Executive Intelligence & Yield Analytics
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            OCCUPANCY PACE · REVPAR VELOCITY · DEPARTMENTAL EFFICIENCY MATRIX
          </p>
        </div>

        <div className="text-xs font-mono text-emerald-400">
          PROFITABILITY INDEX: 94.6% OPTIMAL
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>OCCUPANCY RATE</span>
            <Users className="w-3.5 h-3.5 text-[#c8aa6e]" />
          </div>
          <div className="text-3xl sm:text-4xl font-light font-mono text-white tabular-nums">
            {analytics.occupancyRate}%
          </div>
          <div className="text-[11px] font-mono text-emerald-400">{analytics.occupancyChange} vs Last Cycle</div>
        </div>

        <div className="p-5 bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>AVERAGE DAILY RATE</span>
            <DollarSign className="w-3.5 h-3.5 text-[#c8aa6e]" />
          </div>
          <div className="text-3xl sm:text-4xl font-light font-mono text-white tabular-nums">
            ${analytics.adr.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-neutral-400">+12.4% Luxury Consortia Peak</div>
        </div>

        <div className="p-5 bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>REVPAR YIELD</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#c8aa6e]" />
          </div>
          <div className="text-3xl sm:text-4xl font-light font-mono text-white tabular-nums">
            ${analytics.revPar.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-emerald-400">{analytics.revParChange} YoY Outperformance</div>
        </div>

        <div className="p-5 bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>GUEST SATISFACTION</span>
            <Award className="w-3.5 h-3.5 text-[#c8aa6e]" />
          </div>
          <div className="text-3xl sm:text-4xl font-light font-mono text-white tabular-nums">
            {analytics.guestSatisfaction}
          </div>
          <div className="text-[11px] font-mono text-[#c8aa6e]">99.2% Positive Sentiment</div>
        </div>
      </div>

      {/* Departmental Efficiency Matrix */}
      <div className="p-6 bg-white/[0.02] border border-white/[0.08] space-y-6">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block">
          Departmental Velocity & SLA Adherence
        </span>

        <div className="space-y-4 text-xs font-mono">
          {[
            { dept: 'Front Desk & Guest Arrival', score: 99.4, metric: 'Average Check-in Time: 2.1 mins (Pre-cleared)' },
            { dept: 'Housekeeping Turnarounds', score: 98.6, metric: 'Mean Turnaround: 38 mins (Zero Room Delay)' },
            { dept: 'The Obsidian Culinary Line', score: 97.2, metric: 'Kitchen Fire Accuracy: 99.8% on Dietary Restrictions' },
            { dept: 'Predictive Facilities Health', score: 99.8, metric: '100% Chiller & Pool Loop Sensor Uptime' },
          ].map((item) => (
            <div key={item.dept} className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-white">{item.dept}</span>
                <span className="text-[#c8aa6e] tabular-nums">{item.score}% SLA Adherence</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c8aa6e] to-emerald-400 transition-all duration-500"
                  style={{ width: `${item.score}%` }}
                />
              </div>
              <div className="text-[11px] text-neutral-500">{item.metric}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
