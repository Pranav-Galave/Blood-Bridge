import React from 'react';
import {
  Search,
  Heart,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Stethoscope,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { BloodGroup } from '../../types';

export const Hero: React.FC = () => {
  const {
    setActiveNavTab,
    setIsEmergencyModalOpen,
    bloodUnits,
    bloodBanks,
    emergencyRequests,
    donors,
  } = useBloodBridge();

  const availableUnits = bloodUnits.filter((u) => u.status === 'Available').length;
  const criticalRequests = emergencyRequests.filter((r) => r.status === 'Matching' || r.status === 'Donor Responded').length;

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden py-14 sm:py-20 border-b border-slate-800">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#ef4444" />
              <path d="M 0 30 L 60 30 M 30 0 L 30 60" stroke="#334155" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission, Tagline & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mission Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Connected Solapur Blood Ecosystem · 4-Way Real-Time Network</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              One Network. Every Donor.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-red-500">
                Every Drop. Every Life.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Blood Bridge eliminates frantic calls during emergencies. We unite certified blood banks,
              trauma hospitals, patients, and GPS-ranked voluntary donors into an intelligent, transparent
              transfusion network.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl transition-all shadow-lg shadow-red-600/30"
              >
                <AlertTriangle className="w-4 h-4 text-white" />
                <span>Need Blood Urgently</span>
              </button>

              <button
                onClick={() => setActiveNavTab('find-blood')}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-100 bg-slate-800/90 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl transition-all"
              >
                <Search className="w-4 h-4 text-sky-400" />
                <span>Check Live Inventory</span>
              </button>

              <button
                onClick={() => setActiveNavTab('become-donor')}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-red-200 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 rounded-xl transition-all"
              >
                <Heart className="w-4 h-4 text-red-400" />
                <span>Register as Donor</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Government & NABH Accredited Labs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Unique QR Unit Cold-Chain Tracking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Medically Ranked GPS Matching</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4-Way Ecosystem Visual Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl border border-slate-700/80 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Live Solapur Network Snapshot
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  ● Real-Time Sync
                </span>
              </div>

              {/* Four Stakeholder Network Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Stakeholder 1: Blood Banks */}
                <div
                  onClick={() => setActiveNavTab('blood-banks')}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-red-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-lg font-bold font-mono text-white tabular-nums">{bloodBanks.length}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-200 group-hover:text-red-400 transition-colors">
                    Verified Blood Banks
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {availableUnits} units ready in cold stock
                  </div>
                </div>

                {/* Stakeholder 2: Hospitals */}
                <div
                  onClick={() => setActiveNavTab('hospitals')}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-red-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <Stethoscope className="w-4 h-4 text-sky-400" />
                    <span className="text-lg font-bold font-mono text-white tabular-nums">4</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-200 group-hover:text-red-400 transition-colors">
                    Partner Hospitals
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Ashwini, Civil & Trauma Centres
                  </div>
                </div>

                {/* Stakeholder 3: Voluntary Donors */}
                <div
                  onClick={() => setActiveNavTab('matching')}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-red-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-lg font-bold font-mono text-white tabular-nums">{donors.length}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-200 group-hover:text-red-400 transition-colors">
                    On-Call Donors
                  </div>
                  <div className="text-[11px] text-slate-400">
                    GPS ranked by compatibility & km
                  </div>
                </div>

                {/* Stakeholder 4: Patients & Relatives */}
                <div
                  onClick={() => setActiveNavTab('dashboard')}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-red-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-lg font-bold font-mono text-white tabular-nums">{criticalRequests}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-200 group-hover:text-red-400 transition-colors">
                    Active Requirements
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Replacement donor coordinator
                  </div>
                </div>
              </div>

              {/* Quick Blood Group Availabilities Mini-Bar */}
              <div className="pt-2 border-t border-slate-700/60">
                <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center justify-between">
                  <span>Available Tested Units by Group:</span>
                  <span className="text-red-400 cursor-pointer hover:underline" onClick={() => setActiveNavTab('find-blood')}>
                    Search All →
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  {(['O+', 'B+', 'A+', 'O-'] as BloodGroup[]).map((grp) => {
                    const count = bloodUnits.filter((u) => u.bloodGroup === grp && u.status === 'Available').length;
                    return (
                      <div key={grp} className="bg-slate-900/90 py-1.5 px-2 rounded-lg border border-slate-700/60">
                        <span className="font-bold text-red-400">{grp}</span>
                        <div className="text-[11px] font-mono text-slate-300 font-semibold">{count} Units</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
