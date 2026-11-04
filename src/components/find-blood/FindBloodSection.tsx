import React, { useState } from 'react';
import {
  Search,
  Filter,
  Building2,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Navigation,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { BloodGroup, ComponentType } from '../../types';
import { calculateDistanceKm, formatDistance, estimateTravelMinutes } from '../../utils/geo';
import { RBC_COMPATIBILITY } from '../../utils/compatibility';

export const FindBloodSection: React.FC = () => {
  const {
    bloodBanks,
    bloodUnits,
    userLocation,
    setSelectedUnitForQR,
    setIsEmergencyModalOpen,
    setActiveNavTab,
  } = useBloodBridge();

  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [includeCompatible, setIncludeCompatible] = useState(true);

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components: ComponentType[] = [
    'Packed Red Cells',
    'Whole Blood',
    'Platelets',
    'Fresh Frozen Plasma',
    'Cryoprecipitate',
  ];

  // Calculate available units per bank matching criteria
  const filteredBanks = bloodBanks.map((bank) => {
    const distanceKm = calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      bank.location.lat,
      bank.location.lng
    );

    const bankUnits = bloodUnits.filter((unit) => {
      if (unit.bloodBankId !== bank.id) return false;
      if (unit.status !== 'Available') return false;

      // Group matching logic (exact or medically compatible)
      if (selectedGroup !== 'ALL') {
        if (includeCompatible) {
          const compatibleDonors = RBC_COMPATIBILITY[selectedGroup]?.canReceiveFrom || [];
          if (!compatibleDonors.includes(unit.bloodGroup)) return false;
        } else {
          if (unit.bloodGroup !== selectedGroup) return false;
        }
      }

      // Component matching
      if (selectedComponent !== 'ALL' && unit.componentType !== selectedComponent) {
        return false;
      }

      return true;
    });

    return {
      ...bank,
      distanceKm,
      matchingUnits: bankUnits,
      travelTimeMins: estimateTravelMinutes(distanceKm),
    };
  }).filter((bank) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      bank.name.toLowerCase().includes(q) ||
      bank.location.address.toLowerCase().includes(q) ||
      bank.location.area.toLowerCase().includes(q)
    );
  }).sort((a, b) => a.distanceKm - b.distanceKm); // Closest first!

  const totalMatchingUnits = filteredBanks.reduce((acc, b) => acc + b.matchingUnits.length, 0);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
              <span>Verified Blood Inventory Directory</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">Solapur City Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Live Blood Availability Finder
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Search real-time tested blood units stored in cold-chain facilities across Solapur.
              Results are sorted by GPS distance from your current position ({userLocation.area}).
            </p>
          </div>

          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm whitespace-nowrap self-start md:self-auto"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Post Emergency Requirement</span>
          </button>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
          {/* Blood Group Selector Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Required Blood Group:
              </label>
              {selectedGroup !== 'ALL' && (
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCompatible}
                    onChange={(e) => setIncludeCompatible(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                  />
                  <span>Include medically compatible groups (e.g. O- red cells)</span>
                </label>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedGroup('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedGroup === 'ALL'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Groups
              </button>
              {bloodGroups.map((grp) => {
                const isSel = selectedGroup === grp;
                return (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      isSel
                        ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-400'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {grp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Component & Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
            {/* Component Filter */}
            <div className="md:col-span-5">
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Blood Component:
              </label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value as ComponentType | 'ALL')}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="ALL">All Components (PRBC, Whole Blood, Platelets, FFP)</option>
                {components.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Search */}
            <div className="md:col-span-7">
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Filter by Hospital / Area / Landmark:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Civil Hospital, Saat Rasta, Jule Solapur, Ashwini..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter & Map Quick-Link */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <span className="font-bold font-mono text-slate-900">{totalMatchingUnits}</span> available tested units across{' '}
            <span className="font-bold text-slate-900">{filteredBanks.length}</span> Solapur blood centres
          </div>
          <button
            onClick={() => setActiveNavTab('matching')}
            className="text-red-600 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Donors needed instead? Launch Donor Ranking Engine →</span>
          </button>
        </div>

        {/* Blood Banks Inventory Cards List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredBanks.map((bank) => (
            <div
              key={bank.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition-all"
            >
              {/* Bank Header Strip */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {bank.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Govt. Verified
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {bank.location.address}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {bank.operatingHours}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-500">Lic: {bank.licenseNumber}</span>
                  </div>
                </div>

                {/* Distance & Contact Badges */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {formatDistance(bank.distanceKm)}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ~{bank.travelTimeMins} mins drive
                    </div>
                  </div>

                  <a
                    href={`tel:${bank.emergencyPhone}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Blood Bank</span>
                  </a>
                </div>
              </div>

              {/* Units Inventory Grid for this Bank */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Available Units In Stock ({bank.matchingUnits.length} matching)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    ISBT Barcoded & Serologically Cleared
                  </span>
                </div>

                {bank.matchingUnits.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500">
                      No units matching the selected filter currently stored at this facility.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedGroup('ALL');
                        setSelectedComponent('ALL');
                      }}
                      className="text-xs text-red-600 font-semibold hover:underline mt-1"
                    >
                      Clear filters to view all stock
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bank.matchingUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="p-3 rounded-xl border border-slate-200 hover:border-red-300 bg-white shadow-xs space-y-2 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-red-50 text-red-700 font-black text-sm flex items-center justify-center border border-red-100">
                              {unit.bloodGroup}
                            </span>
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {unit.componentType}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">
                                {unit.id}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Tested Ready
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2">
                          <div className="flex justify-between">
                            <span>Storage:</span>
                            <span className="font-medium text-slate-700">{unit.storageLocation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expiry:</span>
                            <span className="font-mono text-slate-700 font-medium">{unit.expiryDate}</span>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUnitForQR(unit)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                          >
                            <QrCode className="w-3 h-3 text-slate-600" />
                            <span>View QR Code</span>
                          </button>
                          <button
                            onClick={() => setIsEmergencyModalOpen(true)}
                            className="flex-1 py-1.5 text-[11px] font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
                          >
                            Reserve Unit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
