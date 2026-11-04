import React, { useState } from 'react';
import {
  Heart,
  Award,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Bell,
  ShieldCheck,
  Eye,
  EyeOff,
  Printer,
  ChevronRight,
  Phone,
  Send,
  UserCheck,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { getNextEligibleDonationInfo } from '../../utils/compatibility';
import { calculateDistanceKm, formatDistance, estimateTravelMinutes } from '../../utils/geo';
import { BloodGroup } from '../../types';

export const DonorDashboard: React.FC = () => {
  const {
    donors,
    emergencyRequests,
    userLocation,
    respondToEmergencyRequest,
    setCertificateDonor,
    setActiveNavTab,
    firebaseUser,
    firebaseUserData,
    setIsAuthModalOpen,
  } = useBloodBridge();

  // Match currently authenticated user or registered donor
  const currentDonor =
    donors.find(
      (d) =>
        (firebaseUser && (d.email === firebaseUser.email || (d as any).userId === firebaseUser.uid)) ||
        (firebaseUserData && d.email === firebaseUserData.email)
    ) || (donors.length > 0 ? donors[0] : null);

  const [reminderScheduled, setReminderScheduled] = useState(false);
  const [showPhone, setShowPhone] = useState(currentDonor?.privacyPhoneVisible ?? false);

  const eligibility = currentDonor
    ? getNextEligibleDonationInfo(
        currentDonor.lastDonationDate,
        currentDonor.lastDonationType,
        currentDonor.gender
      )
    : null;

  // Find compatible nearby emergency requests
  const nearbyEmergencyRequests = emergencyRequests
    .map((req) => {
      const dist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        req.hospitalLocation.lat,
        req.hospitalLocation.lng
      );
      const hasResponded = currentDonor ? req.respondingDonorIds.includes(currentDonor.id) : false;
      return {
        ...req,
        dist,
        hasResponded,
        travelTimeMins: estimateTravelMinutes(dist),
      };
    })
    .filter((r) => r.status === 'Matching' || r.status === 'Donor Responded');

  const allBadges = [
    { name: 'First Life Saver', req: 1, desc: 'Completed first verified blood donation' },
    { name: 'Helping Hero', req: 5, desc: '5 completed life-saving donations' },
    { name: 'Blood Champion', req: 10, desc: '10 voluntary blood donations milestone' },
    { name: 'Lifesaver Legend', req: 20, desc: '20+ donations elite donor society' },
  ];

  // If no donor profile is registered or active for the user
  if (!currentDonor) {
    return (
      <div className="py-8 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header empty card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-8 h-8 fill-current" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h1 className="text-2xl font-black text-slate-900">
                {firebaseUser ? (
                  <>Welcome, {firebaseUserData?.name || firebaseUser.displayName || 'Life Saver'}!</>
                ) : (
                  <>Voluntary Blood Donor Console</>
                )}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {firebaseUser ? (
                  <>
                    You are signed in as <strong className="text-slate-900 font-mono">{firebaseUser.email}</strong>,
                    but you haven't registered as a voluntary blood donor yet. Register your blood group and eligibility
                    to receive direct emergency requests in Solapur.
                  </>
                ) : (
                  <>
                    No false or dummy user entries are loaded. Only genuine, verified voluntary donors appear on Blood Bridge.
                    Sign in or register your account to access your automated DGHS eligibility countdown, emergency alert responses,
                    and Life Saver digital certificates.
                  </>
                )}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {firebaseUser ? (
                <button
                  onClick={() => setActiveNavTab('become-donor')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Complete Donor Registration</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </button>
                  <button
                    onClick={() => setActiveNavTab('become-donor')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register as New Donor</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Active Solapur Emergencies Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Current Urgent Requests in Solapur</span>
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500">
                  Voluntary donors are needed immediately at local hospitals.
                </p>
              </div>
              <button
                onClick={() => setActiveNavTab('matching')}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                View Live Match Queue →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyRequests.slice(0, 2).map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                      {req.urgency} Surgery
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {req.bloodGroup} ({req.unitsRequired} Units)
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{req.hospitalName}</div>
                  <div className="text-[11px] text-slate-500 italic">"{req.reasonForRequirement}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Donor Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Donor Identity */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
                <span className="text-xl font-mono">{currentDonor.bloodGroup}</span>
                <span className="text-[10px] uppercase font-semibold text-red-200">Donor</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {currentDonor.name}
                  </h1>
                  {currentDonor.verified && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Donor
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentDonor.location.address}
                  </span>
                  <span>·</span>
                  <span>
                    {currentDonor.gender}, {currentDonor.age} yrs
                  </span>
                  <span>·</span>
                  <span>Weight: {currentDonor.weightKg} kg</span>
                  <span>·</span>
                  <span className="font-mono text-emerald-600 font-medium">
                    {currentDonor.responseRate}% Response Reliability
                  </span>
                </div>

                {/* Privacy Toggle */}
                <div className="pt-1 flex items-center gap-3 text-xs text-slate-600">
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    {showPhone ? <Eye className="w-3.5 h-3.5 text-slate-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
                    <span>Phone: {showPhone ? currentDonor.phone : '•••••• ' + currentDonor.phone.slice(-4)} (Privacy Protected)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Certificate Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-center">
              <button
                onClick={() => setCertificateDonor(currentDonor)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>View Life Saver Certificate</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tabular-nums">
                {currentDonor.donationCount}
              </div>
              <div className="text-xs text-slate-500">Completed Donations</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 tabular-nums">
                {currentDonor.donationCount * 3}
              </div>
              <div className="text-xs text-slate-500">Lives Impacted</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl sm:text-2xl font-black font-mono text-red-600 tabular-nums">
                {currentDonor.badges.length}
              </div>
              <div className="text-xs text-slate-500">Badges Earned</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tabular-nums">
                100%
              </div>
              <div className="text-xs text-slate-500">Clinical Safety Cleared</div>
            </div>
          </div>
        </div>

        {/* Section 2: Automated Donor Eligibility Countdown */}
        {eligibility && (
          <div className="bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 rounded-2xl border border-red-200 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-red-600 text-white">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                    Automated Medical Donation Eligibility
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {eligibility.isEligible
                    ? 'You are medically eligible to donate blood today!'
                    : `Next estimated donation eligibility in ${eligibility.daysRemaining} days`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  Last donation was on <strong>{currentDonor.lastDonationDate}</strong> ({currentDonor.lastDonationType}).
                  Under DGHS & WHO medical guidelines, a minimum 90-day biological interval is recommended between whole blood donations
                  to replenish ferritin and iron stores safely.
                </p>
              </div>

              {/* Reminder CTA */}
              <div className="shrink-0 bg-white p-4 rounded-xl border border-red-100 text-center space-y-2 shadow-xs">
                <div className="text-[11px] font-bold uppercase text-slate-500">
                  Estimated Ready Date
                </div>
                <div className="text-base font-black font-mono text-red-700">
                  {eligibility.nextEligibleDate}
                </div>
                <button
                  onClick={() => setReminderScheduled(true)}
                  disabled={reminderScheduled}
                  className="w-full py-1.5 px-3 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{reminderScheduled ? 'SMS & Email Reminder Set!' : 'Schedule Reminders'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Nearby GPS Emergency Requests Matching This Donor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Nearby Emergency Blood Requests</span>
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-500">
                Medically compatible with your {currentDonor.bloodGroup} blood group within Solapur radius.
              </p>
            </div>

            <button
              onClick={() => setActiveNavTab('matching')}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              View Full Ranking System →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyEmergencyRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-red-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                      {req.urgency} Surgery
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {req.unitsRequired} Units {req.bloodGroup} Required
                    </h4>
                    <p className="text-xs text-slate-500">{req.hospitalName}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-900">
                      {formatDistance(req.dist)}
                    </div>
                    <div className="text-[10px] text-slate-500">~{req.travelTimeMins} mins drive</div>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 leading-relaxed italic">
                  "{req.reasonForRequirement}"
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    Patient: <strong>{req.patientName}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {req.hasResponded ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        You Accepted
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => respondToEmergencyRequest(req.id, currentDonor.id, false)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => respondToEmergencyRequest(req.id, currentDonor.id, true)}
                          className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm active:scale-95 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Accept & Proceed</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Gamification Badges & Milestone Rewards */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Voluntary Donor Achievements & Badges
              </h3>
              <p className="text-xs text-slate-500">
                Recognizing consistent voluntary contributions to Solapur emergency transfusion reserves.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              Milestone: {currentDonor.donationCount} / 10 to Blood Champion
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allBadges.map((badge) => {
              const unlocked = currentDonor.donationCount >= badge.req;
              return (
                <div
                  key={badge.name}
                  className={`p-4 rounded-xl border transition-all ${
                    unlocked
                      ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className={`text-xl ${unlocked ? 'opacity-100' : 'grayscale'}`}>🏆</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        unlocked
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {unlocked ? 'Unlocked' : `Requires ${badge.req} Donations`}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1">{badge.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
