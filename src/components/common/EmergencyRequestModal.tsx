import React, { useState } from 'react';
import { AlertTriangle, X, Stethoscope, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { BloodGroup, ComponentType, UrgencyLevel } from '../../types';

export const EmergencyRequestModal: React.FC = () => {
  const {
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    createEmergencyRequest,
    hospitals,
    setSelectedRequestForRanking,
    setActiveNavTab,
  } = useBloodBridge();

  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(38);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [component, setComponent] = useState<ComponentType>('Packed Red Cells');
  const [unitsRequired, setUnitsRequired] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('Critical');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>(hospitals[0]?.id || 'hosp-1');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reason, setReason] = useState('');
  const [replacementNeeded, setReplacementNeeded] = useState<number>(2);

  if (!isEmergencyModalOpen) return null;

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components: ComponentType[] = [
    'Packed Red Cells',
    'Whole Blood',
    'Platelets',
    'Fresh Frozen Plasma',
    'Cryoprecipitate',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const chosenHosp = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

    const newReq = createEmergencyRequest({
      patientName: patientName.trim(),
      patientAge: Number(patientAge) || 35,
      bloodGroup,
      component,
      unitsRequired: Number(unitsRequired) || 2,
      urgency,
      requiredWithinHours: urgency === 'Critical' ? 3 : urgency === 'Urgent' ? 8 : 24,
      hospitalId: chosenHosp.id,
      hospitalName: chosenHosp.name,
      hospitalAddress: chosenHosp.location.address,
      hospitalLocation: chosenHosp.location,
      contactPerson: contactPerson.trim() || 'Attending Relative',
      contactPhone: contactPhone.trim() || '+91 98220 00000',
      reasonForRequirement: reason.trim() || 'Emergency surgical intervention',
      replacementDonorsNeeded: Number(replacementNeeded) || 2,
    });

    setIsEmergencyModalOpen(false);
    setSelectedRequestForRanking(newReq);
    setActiveNavTab('matching');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900">
                Raise Emergency Blood Request
              </h2>
              <p className="text-xs text-slate-500">
                Instant Solapur network broadcast to blood banks and GPS-ranked donors.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 text-sm p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Patient Full Name:</label>
              <input
                type="text"
                required
                placeholder="Patient full legal name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Patient Age:</label>
              <input
                type="number"
                min="1"
                max="105"
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Blood Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Blood Group:</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {bloodGroups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Component:</label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as ComponentType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {components.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Units Needed:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsRequired}
                onChange={(e) => setUnitsRequired(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Hospital & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Treating Hospital:</label>
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.location.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Urgency Priority:</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="Critical">Critical (&lt; 3 Hours - Immediate OR / Trauma)</option>
                <option value="Urgent">Urgent (&lt; 8 Hours - Scheduled Surgery / ICU)</option>
                <option value="Standard">Standard (&lt; 24 Hours - Routine Quota)</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Attendant / Doctor Name:</label>
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh / Smt. Sunita"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Emergency Phone Number:</label>
              <input
                type="tel"
                placeholder="e.g. +91 98220 12345"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Clinical Reason */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Clinical Reason / Diagnosis:</label>
            <input
              type="text"
              placeholder="e.g. Road accident polytrauma, postpartum hemorrhage, dengue platelets..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Replacement Slots */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Replacement Donor Slots to Configure:
            </label>
            <select
              value={replacementNeeded}
              onChange={(e) => setReplacementNeeded(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="1">1 Donor Slot</option>
              <option value="2">2 Donor Slots (Recommended)</option>
              <option value="3">3 Donor Slots</option>
              <option value="4">4 Donor Slots</option>
            </select>
          </div>

          {/* Disclaimer */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900 leading-relaxed">
            By submitting, this emergency broadcast will simultaneously check certified Solapur blood bank inventory
            and notify GPS-verified compatible voluntary donors nearby.
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95 transition-all"
            >
              Broadcast Emergency Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
