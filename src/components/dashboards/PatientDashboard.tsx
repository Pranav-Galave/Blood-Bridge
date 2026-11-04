import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  Search,
  Building2,
  Heart,
  Share2,
  Plus,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { ReplacementDonorTracker } from '../replacement/ReplacementDonorTracker';
import { formatDistance, estimateTravelMinutes } from '../../utils/geo';

export const PatientDashboard: React.FC = () => {
  const {
    emergencyRequests,
    bloodBanks,
    bloodUnits,
    donors,
    setIsEmergencyModalOpen,
    setActiveNavTab,
  } = useBloodBridge();

  // Primary urgent emergency request currently being coordinated
  const patientRequest =
    emergencyRequests.find((r) => r.id === 'REQ-SOL-2026-102') || emergencyRequests[0];

  // Matching units in blood banks for this patient's blood group
  const matchingUnitsInBanks = bloodUnits.filter(
    (u) =>
      u.bloodGroup === patientRequest.bloodGroup &&
      u.componentType === patientRequest.component &&
      u.status === 'Available'
  );

  const steps = [
    { title: 'Request Created', desc: 'Clinical requirement verified by attending physician', done: true },
    { title: 'Network Matching', desc: 'Cross-checking Solapur blood bank inventory & GPS donor queue', done: true },
    { title: 'Donors Responding', desc: '2 compatible donors alerted; screening underway', done: patientRequest.status !== 'Pending' },
    { title: 'Blood Arranged & Crossmatched', desc: 'Units reserved and pre-transfusion testing active', done: patientRequest.status === 'Blood Arranged' || patientRequest.status === 'Fulfilled' },
    { title: 'Transfusion Completed', desc: 'Patient safely received transfusion in hospital ward', done: patientRequest.status === 'Fulfilled' },
  ];

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Patient Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Emergency Blood Coordination Console
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                Patient & Family Care Desk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Coordinating for: <strong className="text-slate-800">{patientRequest.patientName}</strong> ({patientRequest.patientAge} yrs) at{' '}
              <strong className="text-slate-800">{patientRequest.hospitalName}</strong>
            </p>
          </div>

          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Blood Request</span>
          </button>
        </div>

        {/* Live Requirement Status Banner & Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded">
                {patientRequest.urgency} PRIORITY REQUEST
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5">
                {patientRequest.unitsRequired} Units {patientRequest.bloodGroup} ({patientRequest.component}) Required
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Diagnosis: <span className="italic">{patientRequest.reasonForRequirement}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-bold text-slate-500">Progress Status:</div>
              <div className="text-base font-extrabold text-purple-700 font-mono">
                {patientRequest.unitsArranged} / {patientRequest.unitsRequired} Units Secured
              </div>
            </div>
          </div>

          {/* Stepper Tracking Visual */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Emergency Request Milestone Journey:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs space-y-1 ${
                    step.done
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${step.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step.title}</span>
                  </div>
                  <p className="text-[11px] leading-tight opacity-80">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Matching Stock in Connected Solapur Blood Banks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Matching Units Stored In Nearby Certified Blood Banks
              </h3>
              <p className="text-xs text-slate-500">
                Real-time stock for your required {patientRequest.bloodGroup} {patientRequest.component}.
              </p>
            </div>
            <button
              onClick={() => setActiveNavTab('find-blood')}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              View Full Network Directory →
            </button>
          </div>

          {matchingUnitsInBanks.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
              No matching units in cold stock currently. Our automated system has activated on-call GPS donors below.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {matchingUnitsInBanks.slice(0, 3).map((unit) => (
                <div key={unit.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs font-mono text-slate-900">{unit.id}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Available Ready
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <div>Facility: <strong>{unit.bloodBankName}</strong></div>
                    <div>Chamber: <span className="font-mono text-slate-500">{unit.storageLocation}</span></div>
                    <div>Expiry: <span className="font-mono text-slate-500">{unit.expiryDate}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Replacement Donor Assistance Module (Requirement 7) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Replacement Donor Coordination Desk
            </h3>
            <span className="text-xs text-slate-500">
              Arrange and verify family/relative donors to fulfill hospital quotas
            </span>
          </div>
          <ReplacementDonorTracker request={patientRequest} />
        </div>
      </div>
    </div>
  );
};
