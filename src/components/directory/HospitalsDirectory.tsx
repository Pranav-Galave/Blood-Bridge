import React from 'react';
import { Stethoscope, Phone, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { formatDistance, estimateTravelMinutes, calculateDistanceKm } from '../../utils/geo';

export const HospitalsDirectory: React.FC = () => {
  const { hospitals, userLocation, setIsEmergencyModalOpen, setActiveNavTab } = useBloodBridge();

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Emergency Trauma & Surgical Network
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Partner Hospitals in Solapur
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Equipped with 24/7 casualty trauma centers, ICU surgical suites, and direct integration
              into the Blood Bridge emergency dispatch network.
            </p>
          </div>

          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm self-start sm:self-auto"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Post Requirement for Hospital</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map((hosp) => {
            const dist = calculateDistanceKm(
              userLocation.lat,
              userLocation.lng,
              hosp.location.lat,
              hosp.location.lng
            );

            return (
              <div
                key={hosp.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-sky-50 text-sky-800">
                        <Stethoscope className="w-5 h-5" />
                      </span>
                      <h3 className="font-bold text-base text-slate-900">{hosp.name}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {hosp.accreditation}
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
                    <span>{hosp.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-mono text-slate-900 font-semibold">
                      Casualty: {hosp.emergencyWardContact}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Active Surgery Requests: <strong className="text-red-700 font-mono">{hosp.activeRequestsCount}</strong>
                  </span>

                  <button
                    onClick={() => setActiveNavTab('matching')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    View Emergency Queue
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
