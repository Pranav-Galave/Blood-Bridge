import React from 'react';
import { UserCheck, Building2, Stethoscope, Users, Info, Sparkles } from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { UserRole } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { activeRole, setActiveRole, activePersona, setActiveNavTab } = useBloodBridge();

  const roles: Array<{
    id: UserRole;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    subtitle: string;
    persona: string;
  }> = [
    {
      id: 'patient',
      label: 'Patient / Relatives',
      icon: Users,
      subtitle: 'Request blood, view matching banks, manage replacement donors',
      persona: 'Care Coordinator',
    },
    {
      id: 'donor',
      label: 'Blood Donor',
      icon: UserCheck,
      subtitle: 'Nearby GPS alerts, eligibility countdown, digital certificates & badges',
      persona: 'Donor Desk',
    },
    {
      id: 'blood_bank',
      label: 'Blood Bank',
      icon: Building2,
      subtitle: 'Manage inventory, QR code generation/scanning, automated expiry alerts',
      persona: 'Civil Hospital Blood Centre',
    },
    {
      id: 'hospital',
      label: 'Hospital',
      icon: Stethoscope,
      subtitle: 'Emergency surgery requests, donor ranking algorithm, verify donations',
      persona: 'Ashwini Sahakari Hospital',
    },
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Persona Switcher Explanation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="font-semibold text-white tracking-wide">Stakeholder View:</span>
            <span className="text-slate-400 hidden sm:inline">
              Switch roles to test all 4 connected viewpoints:
            </span>
          </div>
        </div>

        {/* Center: Role Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  setActiveNavTab('dashboard');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400 font-semibold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title={r.subtitle}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isActive ? 'bg-red-700 text-white' : 'bg-slate-700/60 text-slate-400'}`}>
                  {r.persona}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Firebase & Network Badge */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Firebase: blood-bridge-b6238</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Solapur Live Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
