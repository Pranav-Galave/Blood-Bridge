import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Search,
  Building2,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { ReplacementDonorTracker } from '../replacement/ReplacementDonorTracker';

export const HospitalDashboard: React.FC = () => {
  const {
    hospitals,
    emergencyRequests,
    bloodBanks,
    setIsEmergencyModalOpen,
    setSelectedRequestForRanking,
    setActiveNavTab,
    updateRequestStatus,
  } = useBloodBridge();

  // Active persona: Ashwini Sahakari Hospital (hosp-1)
  const currentHospital = hospitals.find((h) => h.id === 'hosp-1') || hospitals[0];
  const hospitalRequests = emergencyRequests.filter((r) => r.hospitalId === currentHospital.id);

  const [selectedReqForTracking, setSelectedReqForTracking] = useState<string>(
    hospitalRequests[0]?.id || emergencyRequests[0]?.id || ''
  );

  const activeTrackingRequest = emergencyRequests.find((r) => r.id === selectedReqForTracking) || emergencyRequests[0];

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                <Stethoscope className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentHospital.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                {currentHospital.accreditation}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Emergency Casualty Desk: <span className="font-mono">{currentHospital.emergencyWardContact}</span> · {currentHospital.location.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Surgical Blood Request</span>
            </button>
          </div>
        </div>

        {/* Active Requirements List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Active Surgical & Emergency Requirements</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                {hospitalRequests.length} Active
              </span>
            </h2>
            <span className="text-xs text-slate-500">Live operational dispatch</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitalRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                      {req.urgency} PRIORITY
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {req.unitsRequired} Units {req.bloodGroup} ({req.component})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Patient: <strong className="text-slate-800">{req.patientName}</strong> ({req.patientAge} yrs)
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Fulfilled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Donor Responded'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">
                      {req.unitsArranged} / {req.unitsRequired} Arranged
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 italic">
                  "{req.reasonForRequirement}"
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Req. within {req.requiredWithinHours} hrs</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReqForTracking(req.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Manage Replacement Slots
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRequestForRanking(req);
                        setActiveNavTab('matching');
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Find Matching Donors</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Replacement Donor Assistance Tracking Desk (Requirement 7) */}
        {activeTrackingRequest && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Replacement Donor Coordination for {activeTrackingRequest.patientName} ({activeTrackingRequest.id})
              </h2>
              <span className="text-xs text-slate-500">
                Hospital Transfusion Verification Desk
              </span>
            </div>
            <ReplacementDonorTracker request={activeTrackingRequest} />
          </div>
        )}

        {/* Connected Blood Banks Quick Stock Lookup */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inter-Bank Emergency Cold Stock Availability
              </h3>
              <p className="text-xs text-slate-500">
                Instant buffer availability across Solapur regional network.
              </p>
            </div>
            <button
              onClick={() => setActiveNavTab('find-blood')}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Explore Full Inventory Directory →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bloodBanks.map((bank) => (
              <div key={bank.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{bank.name}</h4>
                  <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {bank.activeUnitsCount} Units
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <a href={`tel:${bank.emergencyPhone}`} className="hover:underline text-slate-700">
                    {bank.emergencyPhone}
                  </a>
                </div>
                <div className="text-[10px] text-slate-400">{bank.operatingHours}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
