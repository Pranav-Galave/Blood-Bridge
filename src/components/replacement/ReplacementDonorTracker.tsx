import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  UserPlus,
  ShieldCheck,
  Share2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { BloodGroup, EmergencyRequest } from '../../types';

interface ReplacementDonorTrackerProps {
  request: EmergencyRequest;
}

export const ReplacementDonorTracker: React.FC<ReplacementDonorTrackerProps> = ({ request }) => {
  const { updateReplacementSlot, verifyReplacementSlot, activeRole } = useBloodBridge();

  const [activeSlotModal, setActiveSlotModal] = useState<string | null>(null);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorGroup, setDonorGroup] = useState<BloodGroup>(request.bloodGroup);
  const [copiedLink, setCopiedLink] = useState(false);

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const handleSaveSlot = (slotId: string) => {
    if (!donorName.trim()) return;
    updateReplacementSlot(request.id, slotId, donorName, donorPhone, donorGroup);
    setActiveSlotModal(null);
    setDonorName('');
    setDonorPhone('');
  };

  const completedCount = request.replacementSlots.filter(
    (s) => s.status === 'Donation Completed' || s.status === 'Transfusion Verified'
  ).length;

  const handleCopyInviteLink = () => {
    navigator.clipboard?.writeText(
      `https://bloodbridge.org/replacement-donor?reqId=${request.id}&patient=${encodeURIComponent(
        request.patientName
      )}&hospital=${encodeURIComponent(request.hospitalName)}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Replacement Donor Assistance Desk
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Slot Tracking
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Coordinating voluntary replacement donors for {request.patientName} at {request.hospitalName}.
            Maintains structured accountability between family members, donors, and hospital transfusion officers.
          </p>
        </div>

        {/* Share Invite Button */}
        <button
          onClick={handleCopyInviteLink}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors shrink-0"
        >
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copiedLink ? 'Invite Link Copied!' : 'Share Invite Link with Relatives'}</span>
        </button>
      </div>

      {/* Progress Metric Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Donor Replacement Quota Progress:
          </span>
          <span className="font-bold font-mono text-purple-800">
            {completedCount} of {request.replacementDonorsNeeded} Donors Verified
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-purple-600 h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (completedCount / request.replacementDonorsNeeded) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Structured Donor Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {request.replacementSlots.map((slot) => {
          const isCompleted = slot.status === 'Donation Completed';
          const isAssigned = slot.status === 'Slot Reserved' || slot.status === 'Screening Passed';

          return (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : isAssigned
                  ? 'bg-purple-50/40 border-purple-200'
                  : 'bg-white border-dashed border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Donor Slot #{slot.slotNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : isAssigned
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {slot.status}
                </span>
              </div>

              {slot.donorName ? (
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{slot.donorName}</div>
                    <div className="text-slate-500 font-mono">{slot.donorPhone}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                      {slot.donorBloodGroup || 'Group TBD'}
                    </span>
                    {slot.verifiedByHospital ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Hospital Verified
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold text-[11px]">
                        Pending Hospital Clearance
                      </span>
                    )}
                  </div>

                  {slot.hospitalStaffNote && (
                    <div className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                      "{slot.hospitalStaffNote}"
                    </div>
                  )}

                  {/* Hospital role can verify donation */}
                  {activeRole === 'hospital' && !slot.verifiedByHospital && (
                    <div className="pt-2">
                      <button
                        onClick={() =>
                          verifyReplacementSlot(
                            request.id,
                            slot.id,
                            true,
                            'Donation verified at Blood Bank. 1 Unit credited for patient.'
                          )
                        }
                        className="w-full py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        Verify Completed Donation
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    Slot open. Assign a family member, friend, or registered volunteer.
                  </p>
                  <button
                    onClick={() => setActiveSlotModal(slot.id)}
                    className="w-full py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Donor</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assign Donor Modal */}
      {activeSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm">Assign Replacement Donor</h4>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Full Name of Replacement Donor:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Relative / Family donor name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Mobile Contact Number:
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98220 12345"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">
                  Donor Blood Group:
                </label>
                <select
                  value={donorGroup}
                  onChange={(e) => setDonorGroup(e.target.value as BloodGroup)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveSlotModal(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSlot(activeSlotModal)}
                disabled={!donorName.trim()}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                Confirm Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
