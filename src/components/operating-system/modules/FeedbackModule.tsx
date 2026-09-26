import React from 'react';
import { useResortOS } from '../../../context/ResortOSContext';
import { Star, CheckCircle2, Gift, HeartHandshake } from 'lucide-react';

export const FeedbackModule: React.FC = () => {
  const { feedbackItems, resolveFeedback } = useResortOS();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
            10. Guest Sentiment & Service Recovery
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            REAL-TIME REPUTATION · NLP SENTIMENT CLUSTERING · AUTONOMOUS SERVICE RECOVERY
          </p>
        </div>

        <div className="text-xs font-mono text-neutral-300">
          AVERAGE SCORE: <span className="text-[#c8aa6e] font-medium">4.98 / 5.0 (99.2% Positive)</span>
        </div>
      </div>

      <div className="space-y-4">
        {feedbackItems.map((fb) => (
          <div
            key={fb.id}
            className="p-5 bg-white/[0.02] border border-white/[0.07] hover:border-white/15 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">{fb.guestName}</span>
                <span className="text-xs font-mono text-[#c8aa6e]">[{fb.roomNumber}]</span>
                <span className="text-[11px] font-mono text-neutral-500">{fb.category}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(fb.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#c8aa6e] fill-[#c8aa6e]" />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 ${
                    fb.sentiment === 'Positive' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                  }`}
                >
                  {fb.sentiment}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 font-light italic leading-relaxed">
              &ldquo;{fb.comment}&rdquo;
            </p>

            <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-500">Submitted {fb.date}</span>

              <div className="flex items-center gap-2">
                {fb.serviceRecoveryStatus === 'Action Pending' ? (
                  <button
                    onClick={() => resolveFeedback(fb.id)}
                    className="px-3 py-1 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] font-semibold text-[11px] uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Dispatch Recovery & Resolve</span>
                  </button>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Recovery Closed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
