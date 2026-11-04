import React, { useState } from 'react';
import {
  Award,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Phone,
  ShieldCheck,
  Send,
  Info,
  Clock,
  Sparkles,
  MapPin,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { rankDonorsForEmergencyRequest } from '../../utils/ranking';
import { formatDistance, estimateTravelMinutes } from '../../utils/geo';
import { MEDICAL_DISCLAIMER } from '../../utils/compatibility';
import { EmergencyRequest } from '../../types';

export const DonorRankingSection: React.FC = () => {
  const {
    emergencyRequests,
    donors,
    selectedRequestForRanking,
    setSelectedRequestForRanking,
    respondToEmergencyRequest,
    setActiveNavTab,
  } = useBloodBridge();

  const [activeRequestId, setActiveRequestId] = useState<string>(
    selectedRequestForRanking?.id || emergencyRequests[0]?.id || ''
  );
  const [filterOnlyEligible, setFilterOnlyEligible] = useState<boolean>(false);
  const [dispatchedDonors, setDispatchedDonors] = useState<Record<string, boolean>>({});

  const currentRequest: EmergencyRequest | undefined =
    emergencyRequests.find((r) => r.id === activeRequestId) || emergencyRequests[0];

  const rankedDonors = currentRequest
    ? rankDonorsForEmergencyRequest(currentRequest, donors).filter((r) => {
        if (filterOnlyEligible) return r.eligibilityStatus === 'Eligible';
        return true;
      })
    : [];

  const handleDispatchNotification = (donorId: string, donorName: string) => {
    if (!currentRequest) return;
    setDispatchedDonors((prev) => ({ ...prev, [donorId]: true }));
    respondToEmergencyRequest(currentRequest.id, donorId, true);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Intelligent Emergency Dispatch Engine · 6-Factor Algorithmic Ranking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Emergency Blood Matching & Donor Ranking
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Instead of broadcasting blindly or showing hundreds of unordered contacts, Blood Bridge
              calculates medical suitability scores in real time based on ABO/Rh antigens, driving distance in km,
              verified waiting intervals, and historical response reliability.
            </p>
          </div>

          {/* Request Selector Tabs */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Active Emergency Surgery / Trauma Requirement:
            </label>
            <div className="flex flex-wrap gap-2">
              {emergencyRequests.map((req) => {
                const isSel = req.id === activeRequestId;
                return (
                  <button
                    key={req.id}
                    onClick={() => {
                      setActiveRequestId(req.id);
                      setSelectedRequestForRanking(req);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSel
                        ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    <span>{req.patientName}</span>
                    <span className="font-bold text-white bg-black/30 px-1.5 py-0.5 rounded">
                      {req.bloodGroup}
                    </span>
                    <span className="text-[11px] opacity-80">({req.urgency})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Emergency Requirement Overview Card */}
        {currentRequest && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-extrabold uppercase rounded bg-red-100 text-red-800">
                    {currentRequest.urgency} PRIORITY
                  </span>
                  <span className="text-xs text-slate-400">· ID: {currentRequest.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {currentRequest.unitsRequired} Units {currentRequest.bloodGroup} ({currentRequest.component}) Required
                </h2>
                <p className="text-xs text-slate-600">
                  Patient: <span className="font-semibold text-slate-900">{currentRequest.patientName}</span> ({currentRequest.patientAge} yrs) ·{' '}
                  <span className="italic">{currentRequest.reasonForRequirement}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <div className="text-slate-400">Hospital:</div>
                  <div className="font-bold text-slate-900">{currentRequest.hospitalName}</div>
                </div>
                <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                <div>
                  <div className="text-slate-400">Required Within:</div>
                  <div className="font-bold font-mono text-red-700">{currentRequest.requiredWithinHours} Hours</div>
                </div>
                <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                <div>
                  <div className="text-slate-400">Attending Contact:</div>
                  <div className="font-semibold text-slate-900 font-mono">{currentRequest.contactPhone}</div>
                </div>
              </div>
            </div>

            {/* Ranking Factor Weights Explainer */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-900">1. Compatibility</span>
                <div className="text-slate-500">Max 40 Pts (ABO/Rh)</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-900">2. Proximity (km)</span>
                <div className="text-slate-500">Max 25 Pts (Haversine)</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-900">3. Availability</span>
                <div className="text-slate-500">Max 15 Pts (Now / Call)</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-900">4. Eligibility</span>
                <div className="text-slate-500">Max 10 Pts (Waiting days)</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-900">5. Reliability</span>
                <div className="text-slate-500">Max 5 Pts (% Response)</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="font-bold text-slate-900">6. Verification</span>
                <div className="text-slate-500">Max 5 Pts (Govt. ID)</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Ranked Donors List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Algorithmic Donor Leaderboard</span>
              <span className="text-xs font-normal text-slate-500">
                ({rankedDonors.length} prospective donors evaluated)
              </span>
            </h3>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={filterOnlyEligible}
                onChange={(e) => setFilterOnlyEligible(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500"
              />
              <span>Show strictly eligible donors only (past 90-day waiting period)</span>
            </label>
          </div>

          {/* Donors List */}
          <div className="grid grid-cols-1 gap-4">
            {rankedDonors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                <Heart className="w-10 h-10 text-red-500 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">No Registered Donors Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  No voluntary donors have registered for this blood group in the live network yet. Sign up through Firebase to be ranked as the first life saver!
                </p>
                <button
                  onClick={() => setActiveNavTab('become-donor')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm"
                >
                  Register as a Voluntary Donor
                </button>
              </div>
            ) : (
              rankedDonors.map((ranked, index) => {
                const { donor, suitabilityScore, distanceKm, isCompatible, compatibilityNote, eligibilityStatus, daysUntilEligible, scoreBreakdown } = ranked;
                const isDispatched = dispatchedDonors[donor.id] || currentRequest?.respondingDonorIds.includes(donor.id);

                return (
                <div
                  key={donor.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                    index === 0
                      ? 'border-red-500 ring-2 ring-red-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Left: Rank & Donor Profile */}
                    <div className="flex items-start gap-4">
                      {/* Rank Position Badge */}
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Rank</span>
                        <span className="text-lg font-black font-mono">#{index + 1}</span>
                      </div>

                      {/* Donor Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">{donor.name}</h4>
                          <span className="px-2 py-0.5 rounded text-xs font-black bg-red-50 text-red-700 border border-red-200">
                            {donor.bloodGroup}
                          </span>
                          {donor.verified && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          )}
                          {index === 0 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              ⭐ Highest Match
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {donor.location.area}, Solapur ({formatDistance(distanceKm)} away)
                          </span>
                          <span>·</span>
                          <span>{donor.gender}, {donor.age} yrs</span>
                          <span>·</span>
                          <span>{donor.donationCount} past donations</span>
                          <span>·</span>
                          <span className="font-mono text-emerald-600 font-medium">{donor.responseRate}% response</span>
                        </div>

                        {/* Compatibility & Eligibility Status Pill */}
                        <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-semibold ${
                              isCompatible
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {compatibilityNote}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-md font-semibold ${
                              eligibilityStatus === 'Eligible'
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {eligibilityStatus === 'Eligible'
                              ? 'Eligible to donate today'
                              : `In waiting interval (${daysUntilEligible} days remaining)`}
                          </span>

                          <span className="text-slate-400">
                            Status: <strong className="text-slate-800">{donor.availability}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Suitability Score & Dispatch Action */}
                    <div className="flex items-center gap-6 self-end lg:self-center shrink-0">
                      {/* Score Breakdown Circle */}
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Suitability Index
                        </div>
                        <div className="text-2xl font-black font-mono text-red-600">
                          {suitabilityScore}
                          <span className="text-xs text-slate-400 font-normal"> / 100</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Compat {scoreBreakdown.compatibility} | Dist {scoreBreakdown.distance} | Avail {scoreBreakdown.availability}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {donor.privacyPhoneVisible && (
                          <a
                            href={`tel:${donor.phone}`}
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                            title={`Call donor: ${donor.phone}`}
                          >
                            <Phone className="w-4 h-4 text-emerald-600" />
                          </a>
                        )}

                        <button
                          disabled={isDispatched || !isCompatible}
                          onClick={() => handleDispatchNotification(donor.id, donor.name)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            isDispatched
                              ? 'bg-emerald-600 text-white cursor-default'
                              : isCompatible
                              ? 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isDispatched ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Alert Dispatched</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Dispatch Priority Alert</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          </div>
        </div>

        {/* Clinical Disclaimer Footer */}
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Medical Safety & Transfusion Protocol: </span>
            {MEDICAL_DISCLAIMER}
          </div>
        </div>
      </div>
    </div>
  );
};
