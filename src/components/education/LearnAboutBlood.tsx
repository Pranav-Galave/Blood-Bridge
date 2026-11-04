import React, { useState } from 'react';
import {
  BookOpen,
  Heart,
  Droplet,
  Activity,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Apple,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { BloodGroup } from '../../types';
import {
  BLOOD_COMPATIBILITY_PROFILES,
  DONATION_MYTHS_FACTS,
  HEMOGLOBIN_GUIDE_DATA,
} from '../../data/educationData';
import { MEDICAL_DISCLAIMER } from '../../utils/compatibility';

export const LearnAboutBlood: React.FC = () => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O+');
  const [activeTab, setActiveTab] = useState<'compatibility' | 'donation' | 'transfusion' | 'hemoglobin' | 'wellness'>('compatibility');

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const profile = BLOOD_COMPATIBILITY_PROFILES[selectedBloodGroup];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Blood Education Centre</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Learn About Your Blood
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Understanding ABO/Rh compatibility, cellular components, donation safety, and maintaining
            healthy hemoglobin levels. Verified clinical education for everyday users.
          </p>
        </div>

        {/* 5-Category Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-4xl mx-auto text-xs sm:text-sm font-semibold">
          {[
            { id: 'compatibility', label: 'A. Compatibility & ABO/Rh', icon: Droplet },
            { id: 'donation', label: 'B. Blood Donation Guide', icon: Heart },
            { id: 'transfusion', label: 'C. Receiving Blood & Transfusion', icon: Activity },
            { id: 'hemoglobin', label: 'D. Hemoglobin & Nutrition', icon: Apple },
            { id: 'wellness', label: 'E. Blood Wellness & Anatomy', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                  isSel
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSel ? 'text-red-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB A: BLOOD GROUP COMPATIBILITY */}
        {activeTab === 'compatibility' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Interactive Blood Group Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Interactive Blood Group Compatibility Explorer
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select your blood group to see who you can donate to and who you can receive from.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-red-700 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                  Prevalence in India: {profile.populationPercentageIndia}
                </div>
              </div>

              {/* Group Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {bloodGroups.map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedBloodGroup(grp)}
                    className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                      selectedBloodGroup === grp
                        ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>

              {/* Compatibility Breakdown Card for Selected Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Can Donate Red Cells To */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Red Cells Can Be Donated To:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.redCellsCanDonateTo.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-950 font-black text-xs font-mono shadow-xs"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed pt-1">
                    {selectedBloodGroup === 'O-'
                      ? 'Universal Red Blood Cell Donor. O- red blood cells have neither A nor B antigens, nor the Rh(D) antigen, making them safe for any recipient in emergencies.'
                      : `A person with ${selectedBloodGroup} red blood cells can donate PRBC units safely to recipients carrying these compatible antigen profiles.`}
                  </p>
                </div>

                {/* Can Receive Red Cells From */}
                <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-3">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                    <Droplet className="w-5 h-5 text-sky-600" />
                    <span>Can Safely Receive Red Cells From:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.redCellsCanReceiveFrom.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-950 font-black text-xs font-mono shadow-xs"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-sky-800 leading-relaxed pt-1">
                    {selectedBloodGroup === 'AB+'
                      ? 'Universal Red Blood Cell Recipient. AB+ individuals have both A, B, and Rh antigens, so their immune system will not produce antibodies against any ABO/Rh donor red cells.'
                      : `Patients with ${selectedBloodGroup} can receive red cell transfusions from these compatible donor blood groups.`}
                  </p>
                </div>
              </div>

              {/* Antigens and Antibodies Table */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800">Biological Antigen & Antibody Profile for {selectedBloodGroup}:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-700">Antigens on Red Cells:</span>{' '}
                    <span>{profile.antigensPresent}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Antibodies in Plasma:</span>{' '}
                    <span>{profile.antibodiesInPlasma}</span>
                  </div>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 italic border-t border-slate-200">
                  "{profile.specialNotes}"
                </div>
              </div>
            </div>

            {/* General Blood Group Educational Foundations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">The ABO System</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discovered by Karl Landsteiner in 1900. Your blood type is inherited from biological parents.
                  Red blood cells carry carbohydrates and glycoproteins called antigens (A or B), while plasma
                  contains antibodies against the antigens you lack.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">The Rh (Rhesus) Factor</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rh refers to the 'D' protein antigen. If present on your red blood cells, you are Rh-positive (e.g. O+, A+).
                  If absent, you are Rh-negative (e.g. O-, A-). Rh-negative patients must only receive Rh-negative red cells.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Plasma vs Red Cell Rules</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plasma compatibility is the EXACT REVERSE of red blood cells! Because AB plasma contains zero
                  anti-A or anti-B antibodies, AB donors are universal plasma donors, while O donors are universal red cell donors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB B: LEARN ABOUT BLOOD DONATION */}
        {activeTab === 'donation' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Step-by-Step Donation Journey */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  What Happens Before, During & After Blood Donation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The entire donation visit takes roughly 35 minutes; the actual needle withdrawal takes under 10 minutes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Registration & Health History</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Brief confidential questionnaire covering travel, medications, and general wellness.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Mini Physical & Hb Check</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nurse checks blood pressure, pulse, temperature, and a quick finger-prick hemoglobin test (minimum 12.5 g/dL).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Sterile Donation (8-10 Mins)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You relax in an ergonomic recliner. Single-use, sterile needle draws 350ml or 450ml into an anticoagulated bag.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Refreshments & Rest</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Enjoy fruit juice, biscuits, and rest for 10-15 minutes. Body restores fluid volume within 24 to 48 hours.
                  </p>
                </div>
              </div>

              {/* Eligibility Checklist */}
              <div className="p-4 bg-red-50/60 border border-red-200 rounded-xl space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-red-900">
                  Basic Voluntary Donor Eligibility Criteria (India DGHS Guidelines):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-red-950">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Age: 18 to 65 years</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Weight: Minimum 45 kg (350ml) or 55 kg (450ml)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hemoglobin: Minimum 12.5 g/dL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Blood Pressure: 100/60 to 140/90 mmHg</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pulse: 60 to 100 bpm regular</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Interval: 90 days (males) / 120 days (females)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Myths vs Facts Accordion/List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-red-600" />
                <span>Common Blood Donation Myths vs. Scientific Facts</span>
              </h3>

              <div className="space-y-3">
                {DONATION_MYTHS_FACTS.map((mf, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                    <div className="flex items-start gap-2 text-rose-800 font-bold">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-rose-100 uppercase">Myth:</span>
                      <span>"{mf.myth}"</span>
                    </div>
                    <div className="flex items-start gap-2 text-emerald-900 pt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 uppercase font-bold shrink-0">Medical Fact:</span>
                      <span className="leading-relaxed">{mf.fact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB C: RECEIVING BLOOD & TRANSFUSION */}
        {activeTab === 'transfusion' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Understanding Clinical Blood Transfusion & Component Therapy
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modern medicine rarely transfuses whole blood. Instead, one donation is separated into multiple components to treat 3 different patients.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-2">
                  <span className="text-xs font-bold text-red-700 uppercase">1. Packed Red Blood Cells (PRBC)</span>
                  <h4 className="font-bold text-sm text-slate-900">Oxygen Delivery</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Contains concentrated erythrocytes. Used for severe acute blood loss (trauma, surgical hemorrhage, postpartum hemorrhage) and severe chronic anemia.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono">Shelf Life: 42 Days (2°C - 6°C)</div>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                  <span className="text-xs font-bold text-amber-700 uppercase">2. Platelets (RDP / SDP)</span>
                  <h4 className="font-bold text-sm text-slate-900">Clot Formation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cellular fragments essential for halting bleeding. Vital for dengue hemorrhagic fever, leukemia patients undergoing chemotherapy, and bone marrow failure.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono">Shelf Life: 5 Days (Agitation 20°C - 24°C)</div>
                </div>

                <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/30 space-y-2">
                  <span className="text-xs font-bold text-sky-700 uppercase">3. Fresh Frozen Plasma (FFP)</span>
                  <h4 className="font-bold text-sm text-slate-900">Coagulation Factors</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The fluid portion of blood containing all coagulation clotting factors. Prescribed for liver disease, massive transfusion protocols, and warfarin reversal.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono">Shelf Life: 365 Days (&lt; -30°C)</div>
                </div>
              </div>

              {/* Crossmatching & Pathological Verification */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm">
                  The Clinical Safeguard: Major & Minor Crossmatching
                </div>
                <p className="leading-relaxed">
                  Before any blood bag touches a patient's IV line, the hospital blood bank performs laboratory crossmatching:
                  mixing the patient's serum with the donor's red blood cells (Major Crossmatch) and patient's cells with donor serum (Minor Crossmatch).
                  This detects unexpected non-ABO antibodies (e.g. Kell, Duffy, Kidd) that could cause hemolytic transfusion reactions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB D: HEMOGLOBIN GUIDE */}
        {activeTab === 'hemoglobin' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Comprehensive Hemoglobin (Hb) & Iron Guide
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {HEMOGLOBIN_GUIDE_DATA.overview}
                </p>
              </div>

              {/* Normal Reference Ranges Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Demographic Group</th>
                      <th className="py-2.5 px-4">Normal Clinical Range</th>
                      <th className="py-2.5 px-4">Minimum for Blood Donation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {HEMOGLOBIN_GUIDE_DATA.normalRanges.map((nr) => (
                      <tr key={nr.group} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{nr.group}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-700">{nr.range}</td>
                        <td className="py-2.5 px-4 font-mono font-medium text-red-700">{nr.minForDonation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dietary Sources for Boosting Hemoglobin */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900">
                  Nutritional Strategies & Iron-Rich Indian Dietary Guidance
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HEMOGLOBIN_GUIDE_DATA.dietarySources.map((ds) => (
                    <div key={ds.category} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="font-bold text-slate-900 text-xs">{ds.category}</div>
                      <ul className="space-y-1 text-slate-600 list-disc list-inside">
                        {ds.items.map((item, idx) => (
                          <li key={idx} className="leading-snug">{item}</li>
                        ))}
                      </ul>
                      <div className="pt-2 text-[11px] font-medium text-emerald-800 border-t border-slate-200">
                        💡 {ds.tip}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Symptoms of Low Hemoglobin & When to Consult Doctor */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>When Should You Consult a Physician? (Warning Symptoms)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-rose-950">
                  {HEMOGLOBIN_GUIDE_DATA.warningSymptoms.map((sym, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-rose-800/90 pt-1 italic">
                  Note: Never start high-dose iron supplements without complete blood count (CBC) and serum ferritin testing prescribed by a certified doctor, as iron overload (hemochromatosis) can damage internal organs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB E: GENERAL BLOOD WELLNESS */}
        {activeTab === 'wellness' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  General Blood Health, Lifestyle & Cellular Anatomy
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  An adult human body contains approximately 5 liters (about 7-8% of total body weight) of blood circulating continuously through 96,000 kilometers of blood vessels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 text-sm">Hydration Habits</div>
                  <p className="text-slate-600 leading-relaxed">
                    Plasma is 90% water. Drinking 2.5 to 3 liters of water daily maintains optimal vascular volume and reduces blood viscosity.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 text-sm">Exercise & Marrow</div>
                  <p className="text-slate-600 leading-relaxed">
                    Aerobic exercise stimulates erythropoietin (EPO) release from kidneys, encouraging bone marrow to generate fresh erythrocytes.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 text-sm">Sleep & Recovery</div>
                  <p className="text-slate-600 leading-relaxed">
                    Cellular repair and immune leukocyte regeneration peak during deep delta sleep phases (7-8 hours nightly).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 text-sm">Annual Checkups</div>
                  <p className="text-slate-600 leading-relaxed">
                    A yearly Complete Blood Count (CBC) reveals early anemia, infection indicators, and platelet fluctuations before symptoms arise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Medical Disclaimer Banner */}
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed text-center">
          <strong>Medical Notice:</strong> Information in the Blood Education Centre is intended for general informational purposes only and does not substitute for qualified clinical advice, pathology diagnosis, or physician treatment.
        </div>
      </div>
    </div>
  );
};
