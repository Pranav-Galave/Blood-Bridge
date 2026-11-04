import React from 'react';
import { Phone, MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';
import { Logo } from './Logo';
import { useBloodBridge } from '../../context/BloodBridgeContext';

export const Footer: React.FC = () => {
  const { setActiveNavTab, setIsEmergencyModalOpen } = useBloodBridge();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 inline-block">
              <Logo size="md" showTagline={true} />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Blood Bridge is an intelligent blood donation and management platform connecting
              donors, blood banks, hospitals, and patients. Making blood availability faster, smarter,
              and more transparent during medical emergencies in Solapur, Maharashtra.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-red-400 tracking-wide">
              "One Network. Every Donor. Every Drop. Every Life."
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Network Portal
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveNavTab('find-blood')}
                  className="hover:text-white transition-colors"
                >
                  Find Available Blood
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNavTab('become-donor')}
                  className="hover:text-white transition-colors"
                >
                  Become a Voluntary Donor
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNavTab('matching')}
                  className="hover:text-white transition-colors"
                >
                  Emergency Donor Ranking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNavTab('education')}
                  className="hover:text-white transition-colors"
                >
                  Learn About Your Blood
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Solapur Blood Centres */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Connected Solapur Hubs
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>District Civil Hospital Blood Centre</li>
              <li>Ashwini Hospital Component Lab</li>
              <li>Rotary Lifeline Blood Centre</li>
              <li>Indian Red Cross Society Solapur</li>
              <li>Dr. V.M. GMC Referral Hospital</li>
            </ul>
          </div>

          {/* Col 5: 24/7 Helpline */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
              Emergency Helpline
            </h4>
            <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl space-y-1 text-xs">
              <div className="text-red-400 font-bold">24x7 Trauma Dispatch:</div>
              <a href="tel:+912172740300" className="font-mono text-white font-bold block text-sm">
                0217-2740300
              </a>
              <div className="text-[10px] text-slate-400">Civil Hospital Blood Desk</div>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-900 text-center sm:flex sm:items-center sm:justify-between text-[11px] text-slate-500 space-y-2 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} Blood Bridge Healthcare Network. Designed for emergency medical response in Solapur.
          </div>
          <div className="flex items-center justify-center gap-4">
            <span>ISBT-128 Standard Compatible</span>
            <span>·</span>
            <span>DGHS / NACO Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
