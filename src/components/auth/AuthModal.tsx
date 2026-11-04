import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  UserCheck,
  Building2,
  Stethoscope,
  Users,
  Lock,
  Mail,
  Phone,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { BloodGroup, UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginUser,
    registerUser,
    loginGoogle,
    firebaseUser,
    logoutUser,
    setActiveNavTab,
  } = useBloodBridge();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password, selectedRole, phone, bloodGroup);
      }
      setIsAuthModalOpen(false);
      setActiveNavTab('dashboard');
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password. Please verify and try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await loginGoogle(selectedRole);
      setIsAuthModalOpen(false);
      setActiveNavTab('dashboard');
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setErrorMsg(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'donor' as UserRole, label: 'Blood Donor', icon: UserCheck },
    { id: 'blood_bank' as UserRole, label: 'Blood Bank', icon: Building2 },
    { id: 'hospital' as UserRole, label: 'Hospital', icon: Stethoscope },
    { id: 'patient' as UserRole, label: 'Patient / Relatives', icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 uppercase tracking-wider">
              <span>Firebase Auth & Cloud Firestore</span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900 mt-0.5">
              {mode === 'login' ? 'Sign In to Blood Bridge' : 'Create Verified Account'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'login'
                ? 'Sign in to access your donor profile, requests, and certificates.'
                : 'Register before becoming a donor to securely store your data.'}
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 text-sm p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Selection Buttons */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Select Your Role:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSel = selectedRole === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all ${
                    isSel
                      ? 'bg-red-50 text-red-900 border-red-300 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSel ? 'text-red-600' : 'text-slate-400'}`} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Google One-Click Auth */}
        <div>
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-all shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-2 text-[10px] uppercase font-bold text-slate-400">
              Or with Email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Full Name / Legal Identity:
              </label>
              <input
                type="text"
                required
                placeholder="Full name as per ID"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          )}

          <div>
            <label className="font-medium text-slate-700 block mb-1">Email Address:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="donor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {mode === 'register' && selectedRole === 'donor' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Blood Group:</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Mobile Phone:</label>
                <input
                  type="tel"
                  placeholder="+91 98220 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrorMsg('');
              }}
              className="text-red-600 font-semibold hover:underline"
            >
              {mode === 'login'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {mode === 'login'
                  ? `Sign In as ${selectedRole.toUpperCase().replace('_', ' ')}`
                  : 'Register Account & Save in Firebase'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
