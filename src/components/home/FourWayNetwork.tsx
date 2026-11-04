import React, { useState } from 'react';
import {
  Building2,
  Stethoscope,
  Heart,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  QrCode,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { UserRole } from '../../types';

export const FourWayNetwork: React.FC = () => {
  const { setActiveRole, setActiveNavTab } = useBloodBridge();
  const [activeTab, setActiveTab] = useState<UserRole>('blood_bank');

  const stakeholders = [
    {
      id: 'blood_bank' as UserRole,
      title: '1. Blood Banks',
      icon: Building2,
      tag: 'Inventory & Cold-Chain',
      headline: 'Digitized Inventory, Expiry Tracking & QR Verification',
      description:
        'Blood banks no longer operate in isolation. They maintain real-time unit counts, generate QR tracking tags for individual units, monitor shelf-life dynamically, and receive immediate alerts when units are reserved for emergency surgeries.',
      bullets: [
        'Component-specific shelf life calculation (PRBC 42d, Platelets 5d, FFP 365d)',
        'Automated early warnings for units expiring within 72 hours',
        'Unique QR code generation and quick scanner lookup',
        'Multi-hospital inter-bank buffer transfers',
      ],
      actionText: 'Open Blood Bank Console',
      color: 'from-emerald-500 to-teal-700',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'hospital' as UserRole,
      title: '2. Hospitals & Trauma Centers',
      icon: Stethoscope,
      tag: 'Critical Care Logistics',
      headline: 'Immediate Blood Requirements & Transfusion Verification',
      description:
        'Surgical teams and trauma casualty wards raise emergency requests directly to the network. The system instantly checks verified blood banks within driving distance, and if stock is deficit, triggers priority donor ranking.',
      bullets: [
        'Trauma and surgical emergency requirement broadcast',
        'Direct reservation from Civil Hospital, Ashwini, or Lifeline blood banks',
        'Replacement donor arrangement and verification desk',
        'Hospital-side crossmatch confirmation logging',
      ],
      actionText: 'Open Hospital Console',
      color: 'from-sky-500 to-blue-700',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      id: 'donor' as UserRole,
      title: '3. Voluntary Blood Donors',
      icon: Heart,
      tag: 'GPS Ranked Community',
      headline: 'Intelligent Location Alerts & Eligibility Countdown',
      description:
        'Donors are not spammed randomly. Blood Bridge matches donors based on exact ABO/Rh compatibility, distance in kilometres from the hospital, response reliability, and medical waiting intervals (90 days for whole blood).',
      bullets: [
        'Automated countdown to next eligible donation date',
        'Nearby emergency alerts with distance in km and map directions',
        'Digital donor profile with privacy controls on phone numbers',
        'Gamification badges and downloadable official certificates',
      ],
      actionText: 'Open Donor Dashboard',
      color: 'from-red-500 to-rose-700',
      badgeBg: 'bg-red-50 text-red-800 border-red-200',
    },
    {
      id: 'patient' as UserRole,
      title: '4. Patients & Relatives',
      icon: Users,
      tag: 'Transparent Coordination',
      headline: 'Transparent Availability & Replacement Donor Tracker',
      description:
        'Family members facing medical emergencies no longer have to make hundreds of panicked phone calls. They can see actual live stock in Solapur, track request progress in real time, and coordinate replacement donor slots.',
      bullets: [
        'Live blood availability search across all certified Solapur banks',
        'Multi-slot replacement donor assistance coordinator',
        'Real-time status tracking (Pending → Matching → Responded → Arranged)',
        'Direct emergency helpline access without intermediaries',
      ],
      actionText: 'Open Patient / Relative Desk',
      color: 'from-purple-500 to-indigo-700',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    },
  ];

  const current = stakeholders.find((s) => s.id === activeTab) || stakeholders[0];
  const Icon = current.icon;

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-red-600 tracking-wider uppercase">
            Four-Way Connected Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Connecting All Four Pillars of Emergency Transfusion
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Unlike fragmented platforms that only register names on a list, Blood Bridge bridges
            the operational gap between clinical storage, surgical demand, voluntary donors, and anxious families.
          </p>
        </div>

        {/* Stakeholder Segmented Switcher */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-3xl mx-auto">
          {stakeholders.map((s) => {
            const SIcon = s.icon;
            const isSel = activeTab === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  isSel
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SIcon className={`w-4 h-4 ${isSel ? 'text-red-600' : 'text-slate-400'}`} />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stakeholder Deep Dive Card */}
        <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${current.badgeBg}`}>
                  {current.tag}
                </span>
                <span className="text-xs text-slate-400">· Stakeholder Flow</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {current.headline}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {current.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {current.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => {
                    setActiveRole(current.id);
                    setActiveNavTab('dashboard');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
                >
                  <span>{current.actionText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <span className="text-xs text-slate-400 hidden sm:inline">
                  Interactive demo sandbox
                </span>
              </div>
            </div>

            {/* Right Visual Architecture Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-red-50 text-red-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{current.title}</div>
                      <div className="text-[11px] text-slate-500">Connected Hub</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Active Node
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-slate-700">Four-Way Data Sync:</span>
                    <span className="font-mono text-emerald-600 font-bold">100% Verified</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-slate-700">Solapur Nodes Live:</span>
                    <span className="font-mono text-slate-900 font-bold">4 Banks / 4 Hospitals</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-slate-700">QR Code Standard:</span>
                    <span className="font-mono text-slate-900 font-bold">ISBT-128 Ready</span>
                  </div>
                </div>

                <div className="p-3 bg-red-50/60 border border-red-100 rounded-lg text-[11px] text-red-900 leading-relaxed">
                  "Every blood unit carries a verifiable chain of custody from donation bed to patient bedside."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
