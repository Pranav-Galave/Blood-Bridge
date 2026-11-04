import React from 'react';
import { Building2, Phone, MapPin, Clock, ShieldCheck, QrCode, Search } from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { formatDistance, estimateTravelMinutes, calculateDistanceKm } from '../../utils/geo';

export const BloodBanksDirectory: React.FC = () => {
  const { bloodBanks, userLocation, setActiveNavTab, bloodUnits } = useBloodBridge();

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Network Infrastructure
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Certified Blood Banks & Component Centres
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Official licensed facilities in Solapur with dedicated cold-chain storage, serological
            screening, and real-time inventory synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bloodBanks.map((bank) => {
            const dist = calculateDistanceKm(
              userLocation.lat,
              userLocation.lng,
              bank.location.lat,
              bank.location.lng
            );
            const unitsInBank = bloodUnits.filter(
              (u) => u.bloodBankId === bank.id && u.status === 'Available'
            ).length;

            return (
              <div
                key={bank.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                        <Building2 className="w-5 h-5" />
                      </span>
                      <h3 className="font-bold text-base text-slate-900">{bank.name}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Govt. License: {bank.licenseNumber}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-slate-900">{formatDistance(dist)}</div>
                    <div className="text-[10px] text-slate-500">~{estimateTravelMinutes(dist)} mins drive</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{bank.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{bank.operatingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={`tel:${bank.emergencyPhone}`} className="font-mono text-emerald-700 font-bold hover:underline">
                      {bank.emergencyPhone} (24/7 Emergency)
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Tested Ready Stock: <strong className="text-slate-900 font-mono">{unitsInBank} Units</strong>
                  </span>

                  <button
                    onClick={() => setActiveNavTab('find-blood')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    View Units In Stock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
