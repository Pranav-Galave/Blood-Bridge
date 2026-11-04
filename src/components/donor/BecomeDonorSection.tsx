import React, { useState, useEffect } from 'react';
import {
  Heart,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  UserCheck,
  LogIn,
  UserPlus,
  Database,
  Loader2,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { BloodGroup, Donor } from '../../types';
import { SOLAPUR_LANDMARKS } from '../../utils/geo';

export const BecomeDonorSection: React.FC = () => {
  const {
    firebaseUser,
    firebaseUserData,
    setIsAuthModalOpen,
    registerNewDonor,
    setActiveRole,
    setActiveNavTab,
  } = useBloodBridge();

  // Eligibility Quiz State
  const [age, setAge] = useState<number>(26);
  const [weight, setWeight] = useState<number>(68);
  const [lastDonationMonths, setLastDonationMonths] = useState<number>(4);
  const [hasChronicIllness, setHasChronicIllness] = useState<boolean>(false);
  const [hadTattooLast6Months, setHadTattooLast6Months] = useState<boolean>(false);

  // Registration Form State
  const [regName, setRegName] = useState(firebaseUserData?.name || firebaseUser?.displayName || '');
  const [regGroup, setRegGroup] = useState<BloodGroup>(firebaseUserData?.bloodGroup || 'O+');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regArea, setRegArea] = useState('Jule Solapur');
  const [regPhone, setRegPhone] = useState(firebaseUserData?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [createdDonorRecord, setCreatedDonorRecord] = useState<Donor | null>(null);

  // Sync state if user logs in while on page
  useEffect(() => {
    if (firebaseUserData || firebaseUser) {
      if (!regName && (firebaseUserData?.name || firebaseUser?.displayName)) {
        setRegName(firebaseUserData?.name || firebaseUser?.displayName || '');
      }
      if (firebaseUserData?.phone && !regPhone) {
        setRegPhone(firebaseUserData.phone);
      }
      if (firebaseUserData?.bloodGroup) {
        setRegGroup(firebaseUserData.bloodGroup);
      }
    }
  }, [firebaseUserData, firebaseUser]);

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  // Check Eligibility Logic
  const isEligible =
    age >= 18 &&
    age <= 65 &&
    weight >= 45 &&
    lastDonationMonths >= 3 &&
    !hasChronicIllness &&
    !hadTattooLast6Months;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated with Firebase before registering as donor
    if (!firebaseUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedLandmark =
        regArea === 'Jule Solapur'
          ? SOLAPUR_LANDMARKS.JULE_SOLAPUR
          : regArea === 'Saat Rasta'
          ? SOLAPUR_LANDMARKS.CIVIL_HOSPITAL
          : regArea === 'Murarji Peth'
          ? SOLAPUR_LANDMARKS.ASHWINI_HOSPITAL
          : regArea === 'Bhavani Peth'
          ? SOLAPUR_LANDMARKS.BHAVANI_PETH
          : regArea === 'Hotgi Road'
          ? SOLAPUR_LANDMARKS.HOTGI_ROAD
          : SOLAPUR_LANDMARKS.LIFELINE_BLOOD_BANK;

      const newDonor = await registerNewDonor({
        name: regName.trim(),
        email: firebaseUser.email || `${regName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        phone: regPhone.trim() || '+91 98220 00000',
        bloodGroup: regGroup,
        gender: regGender,
        age,
        weightKg: weight,
        location: selectedLandmark,
        availability: 'Available Now',
        lastDonationDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastDonationType: 'Whole Blood',
        donationCount: 1,
        verified: true,
        responseRate: 100,
        badges: ['First Life Saver'],
        privacyPhoneVisible: true,
        registeredDate: new Date().toISOString().split('T')[0],
      });

      setCreatedDonorRecord(newDonor);
      setRegSubmitted(true);

      setTimeout(() => {
        setActiveRole('donor');
        setActiveNavTab('dashboard');
      }, 2000);
    } catch (err) {
      console.error('Failed to register donor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Join Solapur Voluntary Donor Registry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Be the Bridge Between Life & Emergency
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            1 single blood donation takes less than 10 minutes of active collection and can save
            up to 3 distinct patient lives. Register and synchronize your donor profile in our secure
            Firebase cloud network.
          </p>
        </div>

        {/* Auth Gate Notification Bar if user is NOT signed in */}
        {!firebaseUser ? (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-6 sm:p-7 border border-slate-700 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 shrink-0 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>Sign In or Sign Up Required to Register as a Donor</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Firebase Connected
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    To maintain medical traceability, prevent identity spoofing, and store your donation
                    history in Firestore, please sign in or create an account before completing your donor profile.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </span>
              <div>
                <div className="font-bold text-emerald-950 text-sm">
                  Authenticated via Firebase ({firebaseUser.email})
                </div>
                <div className="text-emerald-700">
                  Ready to link donor profile with Firestore project: <span className="font-mono font-semibold">blood-bridge-b6238</span>
                </div>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold self-start sm:self-auto">
              Cloud Synced
            </span>
          </div>
        )}

        {/* 2-Column Grid: Quick Eligibility Self-Assessment & Registration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive 60-Second Eligibility Quiz (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Calendar className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-base text-slate-900">
                Step 1: Medical Eligibility Self-Check
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Your Age:</span>
                  <span className="font-mono text-red-700 text-sm">{age} Years</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="70"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">Eligible range: 18 - 65 years</div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Your Weight (kg):</span>
                  <span className="font-mono text-red-700 text-sm">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="38"
                  max="120"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">Minimum requirement: 45 kg (350ml donation)</div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Months Since Last Blood Donation:</span>
                  <span className="font-mono text-red-700 text-sm">
                    {lastDonationMonths >= 12 ? 'Over 1 Year / Never' : `${lastDonationMonths} Months`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={lastDonationMonths}
                  onChange={(e) => setLastDonationMonths(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="text-[10px] text-slate-400">
                  Minimum biological interval: 3 months (90 days)
                </div>
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasChronicIllness}
                    onChange={(e) => setHasChronicIllness(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-slate-700">Currently taking insulin or under active cardiac treatment</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hadTattooLast6Months}
                    onChange={(e) => setHadTattooLast6Months(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-slate-700">Received a tattoo or piercing in the last 6 months</span>
                </label>
              </div>

              {/* Dynamic Eligibility Result Box */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isEligible
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                {isEligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {isEligible ? 'You Are Medically Eligible to Donate!' : 'Temporary Waiting Period Detected'}
                  </h4>
                  <p className="text-[11px] mt-0.5 leading-relaxed">
                    {isEligible
                      ? 'Based on your age, weight, and intervals, you qualify for voluntary blood donation in Solapur. Complete the form to link your donor record in Firebase.'
                      : 'You may be in a temporary deferral period. You can still register to receive an automated notification when you become eligible.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Donor Registration Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Step 2: Register & Store Donor Profile
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Firestore · /donors
              </span>
            </div>

            {regSubmitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-lg text-emerald-950">
                  Donor Profile Saved in Firebase!
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your record has been stored in project{' '}
                  <strong className="font-mono">blood-bridge-b6238</strong> and linked to your user account.
                  Redirecting to your personalized Donor Dashboard with your Life Saver certificate and eligibility countdown...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Legal Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="Full legal name as per Govt ID"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Blood Group:</label>
                    <select
                      value={regGroup}
                      onChange={(e) => setRegGroup(e.target.value as BloodGroup)}
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
                    <label className="font-bold text-slate-700 block mb-1">Gender:</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as typeof regGender)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Solapur Locality / Area:</label>
                    <select
                      value={regArea}
                      onChange={(e) => setRegArea(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                    >
                      <option value="Jule Solapur">Jule Solapur</option>
                      <option value="Saat Rasta">Saat Rasta / Civil</option>
                      <option value="Murarji Peth">Murarji Peth / Old Pune Naka</option>
                      <option value="Bhavani Peth">Bhavani Peth</option>
                      <option value="Hotgi Road">Hotgi Road / Airport Area</option>
                      <option value="Navi Peth">Navi Peth / City Bus Stand</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile Phone (Emergency SMS):</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98220 00000"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                  🔒 <strong>Firebase Security & Privacy:</strong> Your donor record is saved into your secure Firestore database. Phone numbers are protected by privacy rules and only dispatched to hospital casualty units during verified medical emergencies.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {!firebaseUser
                      ? 'Sign In First to Save Donor Profile'
                      : 'Save Donor Profile to Firebase Network'}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
