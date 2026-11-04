import React from 'react';
import { PhoneCall, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';

export const EmergencyBanner: React.FC = () => {
  const { setIsEmergencyModalOpen, setActiveNavTab } = useBloodBridge();

  return (
    <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white text-xs md:text-sm py-2 px-4 shadow-sm border-b border-red-900/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white font-bold text-xs">
            !
          </span>
          <span className="font-semibold tracking-wide">
            24/7 Solapur Emergency Blood Network Helpline:
          </span>
          <a
            href="tel:+912172740300"
            className="font-mono font-bold tracking-tight underline decoration-white/40 hover:decoration-white transition-all text-white flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            0217-2740300
          </a>
          <span className="hidden lg:inline text-red-200">·</span>
          <span className="hidden lg:inline text-red-100">
            Civil Hospital Blood Centre & 4 Partner Hubs Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 font-semibold rounded-md bg-white text-red-700 hover:bg-red-50 active:scale-95 transition-all shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Raise Emergency Blood Request
          </button>
        </div>
      </div>
    </div>
  );
};
