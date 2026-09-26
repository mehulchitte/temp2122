import React, { useState } from 'react';
import { useAuth, SEED_ACCOUNTS } from '../../context/AuthContext';
import { X, Lock, Shield, User, Key, Check, AlertCircle } from 'lucide-react';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, switchRolePersona } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleQuickPersona = (role: UserRole) => {
    switchRolePersona(role);
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#090b10] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        {/* Top Gold Hairline */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent" />

        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-[#c8aa6e] tracking-widest block">
              SECURE ACCESS GATEWAY
            </span>
            <h2 className="text-xl sm:text-2xl font-editorial text-white tracking-wide">
              Smart Resort 360 Authentication
            </h2>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-white/[0.06] hover:border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-neutral-400 block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. guest@smartresort360.com or admin@smartresort360.com"
              className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#c8aa6e]/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-400 block">Encrypted Passkey</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your confidential passkey..."
              className="w-full p-2.5 bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#c8aa6e]/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#c8aa6e] hover:bg-[#d8bc7f] text-[#050505] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,170,110,0.25)]"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? 'Authenticating Enclave...' : 'Authenticate Credentials'}</span>
          </button>
        </form>

        {/* Quick Demo Personas (Single-Click Test Login) */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="uppercase tracking-wider">ONE-CLICK TESTING PERSONAS</span>
            <span className="text-[10px] text-[#c8aa6e]">INSTANT SWITCH</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Customer Persona */}
            <button
              onClick={() => handleQuickPersona('CUSTOMER')}
              className="p-2.5 text-left bg-white/[0.03] hover:bg-white/[0.08] border border-[#c8aa6e]/40 hover:border-[#c8aa6e] text-white transition-colors cursor-pointer group"
            >
              <div className="text-[#c8aa6e] font-semibold truncate">Lord Harrington</div>
              <div className="text-neutral-400 text-[10px]">Resident Guest · Villa 12</div>
            </button>

            {/* Super Admin Persona */}
            <button
              onClick={() => handleQuickPersona('SUPER_ADMIN')}
              className="p-2.5 text-left bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
            >
              <div className="text-cyan-400 font-semibold truncate">Marcus Sterling</div>
              <div className="text-neutral-400 text-[10px]">Super Administrator</div>
            </button>

            {/* General Manager Persona */}
            <button
              onClick={() => handleQuickPersona('GENERAL_MANAGER')}
              className="p-2.5 text-left bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
            >
              <div className="text-emerald-400 font-semibold truncate">Claire Delacroix</div>
              <div className="text-neutral-400 text-[10px]">General Manager</div>
            </button>

            {/* Front Desk Persona */}
            <button
              onClick={() => handleQuickPersona('FRONT_DESK')}
              className="p-2.5 text-left bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
            >
              <div className="text-purple-400 font-semibold truncate">Julian Thorne</div>
              <div className="text-neutral-400 text-[10px]">Front Desk & Concierge</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
