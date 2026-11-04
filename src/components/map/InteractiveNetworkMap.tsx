import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Building2,
  Stethoscope,
  UserCheck,
  AlertCircle,
  Phone,
  Clock,
  ExternalLink,
  Layers,
  Compass,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { calculateDistanceKm, estimateTravelMinutes, formatDistance } from '../../utils/geo';
import { BloodGroup } from '../../types';

export const InteractiveNetworkMap: React.FC = () => {
  const { bloodBanks, hospitals, donors, emergencyRequests, userLocation, setSelectedRequestForRanking, setActiveNavTab } = useBloodBridge();

  const [activeFilter, setActiveFilter] = useState<'all' | 'requests' | 'banks' | 'hospitals' | 'donors'>('all');
  const [selectedPin, setSelectedPin] = useState<{
    type: 'request' | 'bank' | 'hospital' | 'donor';
    id: string;
    title: string;
    subtitle: string;
    bloodGroup?: BloodGroup;
    distanceKm: number;
    phone: string;
    address: string;
    extra?: string;
  } | null>(null);

  const [navigationModal, setNavigationModal] = useState<{
    destTitle: string;
    distanceKm: number;
    travelMinutes: number;
    steps: string[];
  } | null>(null);

  // Solapur coordinates bounding box mapping to SVG viewport
  // Lat: 17.620 to 17.685 (South to North)
  // Lng: 75.890 to 75.950 (West to East)
  const mapWidth = 800;
  const mapHeight = 520;

  const latMin = 17.615;
  const latMax = 17.685;
  const lngMin = 75.890;
  const lngMax = 75.945;

  const projectToSvg = (lat: number, lng: number) => {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * mapWidth;
    // Invert Y because SVG coordinates go down from top
    const y = ((latMax - lat) / (latMax - latMin)) * mapHeight;
    return {
      x: Math.max(30, Math.min(mapWidth - 30, x)),
      y: Math.max(30, Math.min(mapHeight - 30, y)),
    };
  };

  const userSvgPos = projectToSvg(userLocation.lat, userLocation.lng);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Map Header Toolbar */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-base text-white tracking-tight">
              Solapur Live Blood Logistics & GPS Map
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial tracking connecting emergency wards, blood banks, and verified voluntary donors.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs">
          {(['all', 'requests', 'banks', 'hospitals', 'donors'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-md transition-colors capitalize ${
                activeFilter === filter
                  ? 'bg-red-600 text-white font-medium shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {filter === 'requests' ? '🚨 Emergencies' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Viewport & Interactive SVG */}
      <div className="relative bg-slate-950 h-[480px] w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-full object-cover"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="solapur-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeOpacity="0.4" />
            </pattern>
          </defs>
          <rect width={mapWidth} height={mapHeight} fill="#0b132b" />
          <rect width={mapWidth} height={mapHeight} fill="url(#solapur-grid)" />

          {/* Solapur Major Roads (Stylized representation) */}
          {/* Pune-Solapur Highway / Murarji Peth */}
          <path d="M 40 180 Q 250 200 450 220 T 780 250" fill="none" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          {/* Saat Rasta to Jule Solapur Axis */}
          <path d="M 320 80 Q 360 260 480 460" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          {/* Hotgi Road Axis */}
          <path d="M 450 220 Q 560 320 700 470" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          {/* Old Employment Chowk to Bhavani Peth */}
          <path d="M 180 300 Q 380 240 650 180" fill="none" stroke="#1e293b" strokeWidth="2.5" />

          {/* Solapur Area Labels on Canvas */}
          <text x="260" y="90" fill="#475569" fontSize="11" fontWeight="bold">Saat Rasta</text>
          <text x="140" y="240" fill="#475569" fontSize="11" fontWeight="bold">Murarji Peth</text>
          <text x="470" y="160" fill="#475569" fontSize="11" fontWeight="bold">Bhavani Peth</text>
          <text x="390" y="440" fill="#475569" fontSize="11" fontWeight="bold">Jule Solapur</text>
          <text x="610" y="420" fill="#475569" fontSize="11" fontWeight="bold">Hotgi Road</text>
          <text x="350" y="280" fill="#334155" fontSize="10">Navi Peth</text>

          {/* User Location Radar Pulse & Pin */}
          <g transform={`translate(${userSvgPos.x}, ${userSvgPos.y})`}>
            <circle r="36" fill="#3b82f6" fillOpacity="0.1" />
            <circle r="20" fill="#3b82f6" fillOpacity="0.2" />
            <circle r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <text x="10" y="4" fill="#93c5fd" fontSize="11" fontWeight="bold">You ({userLocation.area})</text>
          </g>

          {/* Hospitals */}
          {(activeFilter === 'all' || activeFilter === 'hospitals') &&
            hospitals.map((hosp) => {
              const pos = projectToSvg(hosp.location.lat, hosp.location.lng);
              const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, hosp.location.lat, hosp.location.lng);
              return (
                <g
                  key={hosp.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() =>
                    setSelectedPin({
                      type: 'hospital',
                      id: hosp.id,
                      title: hosp.name,
                      subtitle: hosp.accreditation,
                      distanceKm: dist,
                      phone: hosp.emergencyWardContact,
                      address: hosp.location.address,
                      extra: `${hosp.activeRequestsCount} active emergency requirement(s)`,
                    })
                  }
                >
                  <circle r="14" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1.5" />
                  <path d="M -5 0 L 5 0 M 0 -5 L 0 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <text x="16" y="4" fill="#e0f2fe" fontSize="10" fontWeight="600">
                    {hosp.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}

          {/* Blood Banks */}
          {(activeFilter === 'all' || activeFilter === 'banks') &&
            bloodBanks.map((bank) => {
              const pos = projectToSvg(bank.location.lat, bank.location.lng);
              const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, bank.location.lat, bank.location.lng);
              return (
                <g
                  key={bank.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() =>
                    setSelectedPin({
                      type: 'bank',
                      id: bank.id,
                      title: bank.name,
                      subtitle: `Lic: ${bank.licenseNumber} · ${bank.operatingHours}`,
                      distanceKm: dist,
                      phone: bank.emergencyPhone,
                      address: bank.location.address,
                      extra: `${bank.activeUnitsCount} tested units ready in inventory`,
                    })
                  }
                >
                  <rect x="-12" y="-12" width="24" height="24" rx="6" fill="#16a34a" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="4" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">BB</text>
                  <text x="16" y="4" fill="#bbf7d0" fontSize="10" fontWeight="600">
                    {bank.name.split(' ')[0]} Bank
                  </text>
                </g>
              );
            })}

          {/* Donors */}
          {(activeFilter === 'all' || activeFilter === 'donors') &&
            donors.map((donor) => {
              const pos = projectToSvg(donor.location.lat, donor.location.lng);
              const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, donor.location.lat, donor.location.lng);
              return (
                <g
                  key={donor.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() =>
                    setSelectedPin({
                      type: 'donor',
                      id: donor.id,
                      title: donor.name,
                      subtitle: `${donor.gender}, ${donor.age} yrs · ${donor.availability}`,
                      bloodGroup: donor.bloodGroup,
                      distanceKm: dist,
                      phone: donor.phone,
                      address: donor.location.address,
                      extra: `${donor.donationCount} verified donations · ${donor.badges.join(', ')}`,
                    })
                  }
                >
                  <circle r="10" fill="#9333ea" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="3.5" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {donor.bloodGroup}
                  </text>
                </g>
              );
            })}

          {/* Active Emergency Requests (Pulsing Red Marker) */}
          {(activeFilter === 'all' || activeFilter === 'requests') &&
            emergencyRequests.map((req) => {
              const pos = projectToSvg(req.hospitalLocation.lat, req.hospitalLocation.lng);
              const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, req.hospitalLocation.lat, req.hospitalLocation.lng);
              return (
                <g
                  key={req.id}
                  transform={`translate(${pos.x + 8}, ${pos.y - 8})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() =>
                    setSelectedPin({
                      type: 'request',
                      id: req.id,
                      title: `EMERGENCY: ${req.unitsRequired} Units ${req.bloodGroup} Required`,
                      subtitle: `Patient: ${req.patientName} (${req.urgency} Urgency)`,
                      bloodGroup: req.bloodGroup,
                      distanceKm: dist,
                      phone: req.contactPhone,
                      address: req.hospitalAddress,
                      extra: req.reasonForRequirement,
                    })
                  }
                >
                  {/* Warning pulse ring */}
                  <circle r="18" fill="#ef4444" fillOpacity="0.3" className="animate-ping" />
                  <circle r="12" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="4" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                    !
                  </text>
                  <text x="16" y="4" fill="#fca5a5" fontSize="10" fontWeight="bold">
                    {req.bloodGroup} Needed
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md rounded-lg p-2.5 border border-slate-700 text-white text-[11px] space-y-1">
          <div className="font-semibold text-slate-300 pb-1 border-b border-slate-700/60">Solapur Network Map</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span>Emergency Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span>
            <span>Blood Banks</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Partner Hospitals</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <span>Registered Donors</span>
          </div>
        </div>

        {/* Selected Pin Bottom Sheet */}
        {selectedPin && (
          <div className="absolute bottom-3 right-3 max-w-sm w-full bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-2 text-slate-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                  {selectedPin.type.toUpperCase()} SPOTLIGHT
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-0.5 leading-snug">
                  {selectedPin.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{selectedPin.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-700 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Distance from you:</span>
                <span className="font-semibold font-mono text-slate-900">
                  {formatDistance(selectedPin.distanceKm)} (~{estimateTravelMinutes(selectedPin.distanceKm)} mins drive)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Contact / Helpline:</span>
                <a
                  href={`tel:${selectedPin.phone}`}
                  className="font-medium text-red-600 hover:underline flex items-center gap-1 font-mono"
                >
                  <Phone className="w-3 h-3" />
                  {selectedPin.phone}
                </a>
              </div>
              {selectedPin.extra && (
                <div className="pt-1 text-slate-700 italic text-[11px] bg-slate-50 p-2 rounded">
                  "{selectedPin.extra}"
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() =>
                  setNavigationModal({
                    destTitle: selectedPin.title,
                    distanceKm: selectedPin.distanceKm,
                    travelMinutes: estimateTravelMinutes(selectedPin.distanceKm),
                    steps: [
                      `Start from your location at ${userLocation.area}, Solapur.`,
                      `Head towards Saat Rasta / Pune-Solapur Road (NH 65).`,
                      `Turn towards ${selectedPin.address}.`,
                      `Arrive at destination: ${selectedPin.title}.`,
                    ],
                  })
                }
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-400" />
                <span>Get GPS Directions</span>
              </button>

              {selectedPin.type === 'request' && (
                <button
                  onClick={() => {
                    const req = emergencyRequests.find((r) => r.id === selectedPin.id);
                    if (req) {
                      setSelectedRequestForRanking(req);
                      setActiveNavTab('matching');
                    }
                  }}
                  className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Match Donors
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Directions Modal */}
      {navigationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900">Solapur GPS Route Guidance</h3>
              </div>
              <button
                onClick={() => setNavigationModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-red-50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-500">Destination:</div>
                  <div className="font-bold text-slate-900">{navigationModal.destTitle}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-red-700 text-sm">{navigationModal.distanceKm} km</div>
                  <div className="text-slate-500">~{navigationModal.travelMinutes} mins drive</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-700">Turn-by-Turn Route Navigation:</div>
                {navigationModal.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] leading-relaxed">
                Emergency Priority Corridors: Solapur Traffic Police grants green light coordination for authenticated blood transit ambulances and donor transport.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setNavigationModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Done / Back to Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
