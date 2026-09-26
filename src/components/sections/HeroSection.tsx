import React from 'react';
import { ChevronDown, Compass } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onToggleFreeOrbit?: () => void;
  isFreeOrbit?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onToggleFreeOrbit, isFreeOrbit }) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-32 pb-12 px-6 md:px-16 pointer-events-none select-none">
      {/* Top Status & Architectural Coordinate Header */}
      <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase font-mono text-neutral-400 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
          <span className="text-[#EDEDED] font-medium tracking-[0.25em]">SYSTEM ACTIVE</span>
          <span className="hidden sm:inline text-neutral-600">·</span>
          <span className="hidden sm:inline text-neutral-500">RESORT ENGINE v4.2 PRO</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-neutral-500">
          <span>LAT 08°39&apos;N</span>
          <span>·</span>
          <span>LON 115°13&apos;E</span>
          <span>·</span>
          <span className="text-neutral-400">ISLAND ARCHIPELAGO</span>
        </div>
      </div>

      {/* Main Hero Typography: Apple presentation meets luxury architectural monograph */}
      <div className="max-w-7xl mx-auto w-full my-auto py-12">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[#c8aa6e] font-medium">
            <span>RESORT OPERATING SYSTEM</span>
            <span className="w-8 h-[1px] bg-[#c8aa6e]/50" />
            <span>AUTONOMOUS LUXURY</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-[-0.03em] leading-[0.94] text-[#EDEDED] font-editorial text-balance">
            THE LIVING
            <br />
            <span className="bg-gradient-to-r from-white via-[#EDEDED] to-neutral-500 bg-clip-text text-transparent">
              ARCHITECTURE.
            </span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-neutral-400 font-light leading-relaxed tracking-wide">
            A unified digital operating system for the world&apos;s most intelligent resorts. Real-time spatial twin, predictive operations, and sentient hospitality in one living architecture.
          </p>

          {/* Interactive controls affordance */}
          <div className="pt-4 flex flex-wrap items-center gap-6 pointer-events-auto">
            <button
              onClick={onExplore}
              className="group flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-[#EDEDED] hover:text-[#c8aa6e] transition-colors cursor-pointer py-2"
            >
              <span>EXPLORE PLATFORM</span>
              <span className="w-6 h-[1px] bg-neutral-600 group-hover:bg-[#c8aa6e] group-hover:w-10 transition-all" />
            </button>

            {onToggleFreeOrbit && (
              <button
                onClick={onToggleFreeOrbit}
                className="flex items-center gap-2 px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase font-mono text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
                title="Toggle 360 degree free orbit inspection with mouse"
              >
                <Compass className={`w-3.5 h-3.5 ${isFreeOrbit ? 'text-[#c8aa6e]' : 'text-neutral-400'}`} />
                <span>{isFreeOrbit ? 'EXIT 360° ORBIT' : '360° INSPECT TWIN'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Bottom: Scroll Indicator & Property Footprint */}
      <div className="max-w-7xl mx-auto w-full flex items-end justify-between pt-6 border-t border-white/[0.06]">
        <div className="hidden sm:block text-xs text-neutral-500 font-mono tracking-wider">
          <span>SPATIAL COVERAGE: 48 HECTARES</span>
          <span className="mx-2">·</span>
          <span>18 OVERWATER RESIDENCES</span>
        </div>

        <button
          onClick={onExplore}
          className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer pointer-events-auto mx-auto sm:mx-0 group py-2"
        >
          <span className="font-mono text-[11px]">SCROLL TO EXPLORE</span>
          <ChevronDown className="w-4 h-4 text-[#c8aa6e] animate-bounce group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};
