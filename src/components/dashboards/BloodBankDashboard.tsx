import React, { useState } from 'react';
import {
  Building2,
  Plus,
  QrCode,
  Scan,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { BloodGroup, BloodUnit, ComponentType, UnitStatus } from '../../types';
import { calculateExpiryDate } from '../../utils/compatibility';

export const BloodBankDashboard: React.FC = () => {
  const {
    bloodBanks,
    bloodUnits,
    addBloodUnit,
    updateUnitStatus,
    setSelectedUnitForQR,
    setIsQRScannerOpen,
  } = useBloodBridge();

  // Active bank: Civil Hospital Blood Centre (bank-1)
  const currentBank = bloodBanks.find((b) => b.id === 'bank-1') || bloodBanks[0];
  const bankUnits = bloodUnits.filter((u) => u.bloodBankId === currentBank.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus | 'ALL'>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | 'ALL'>('ALL');

  // Add Unit Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState<BloodGroup>('O+');
  const [newComponent, setNewComponent] = useState<ComponentType>('Packed Red Cells');
  const [newCollectionDate, setNewCollectionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newStorage, setNewStorage] = useState('Cold Chamber A-1 (Shelf 3)');
  const [newDonorAge, setNewDonorAge] = useState<number>(28);
  const [newDonorGender, setNewDonorGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  // Check Expiry Status (expiring within 3 days / 72 hours)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiringUnits = bankUnits.filter((u) => {
    if (u.status !== 'Available') return false;
    const exp = new Date(u.expiryDate);
    exp.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  });

  const expiredUnits = bankUnits.filter((u) => {
    const exp = new Date(u.expiryDate);
    exp.setHours(0, 0, 0, 0);
    return exp.getTime() < today.getTime();
  });

  const availableUnits = bankUnits.filter((u) => u.status === 'Available');
  const reservedUnits = bankUnits.filter((u) => u.status === 'Reserved');
  const issuedUnits = bankUnits.filter((u) => u.status === 'Issued');

  // Filtered unit table
  const displayedUnits = bankUnits.filter((u) => {
    if (selectedGroup !== 'ALL' && u.bloodGroup !== selectedGroup) return false;
    if (selectedStatus !== 'ALL' && u.status !== selectedStatus) return false;
    if (selectedComponent !== 'ALL' && u.componentType !== selectedComponent) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.id.toLowerCase().includes(q) || u.storageLocation.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryDate = calculateExpiryDate(newCollectionDate, newComponent);

    addBloodUnit({
      bloodBankId: currentBank.id,
      bloodBankName: currentBank.name,
      bloodGroup: newGroup,
      componentType: newComponent,
      collectionDate: newCollectionDate,
      expiryDate,
      status: 'Available',
      storageLocation: newStorage,
      testedHepatitisHIV: true,
      donorAge: newDonorAge,
      donorGender: newDonorGender,
    });

    setIsAddModalOpen(false);
  };

  const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const components: ComponentType[] = [
    'Packed Red Cells',
    'Whole Blood',
    'Platelets',
    'Fresh Frozen Plasma',
    'Cryoprecipitate',
  ];

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Quick Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentBank.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Govt. Licensed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Lic: <span className="font-mono">{currentBank.licenseNumber}</span> · {currentBank.location.address} · Operating 24/7
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
            >
              <Scan className="w-4 h-4 text-sky-400" />
              <span>Scan QR Code</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Blood Unit</span>
            </button>
          </div>
        </div>

        {/* Automated Expiry Alerts Banner (Requirement 5) */}
        {expiringUnits.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-amber-900">
                  Critical Expiry Warning: {expiringUnits.length} Units Expiring in Less Than 72 Hours
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Alert! {expiringUnits.filter((u) => u.bloodGroup === 'O+').length} O+ units and{' '}
                  {expiringUnits.filter((u) => u.componentType === 'Platelets').length} Platelet units at Cold Chamber A-1
                  are approaching viability deadlines. Prioritize dispatch to pending surgery queues to prevent wastage.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedStatus('Available');
                setSelectedGroup('O+');
              }}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-800 hover:bg-amber-900 text-white transition-colors shrink-0"
            >
              Filter Expiring Units
            </button>
          </div>
        )}

        {/* 5-Card Inventory Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl font-black font-mono text-emerald-700 tabular-nums">
              {availableUnits.length}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">Available Stock</div>
            <div className="text-[10px] text-slate-400">Tested & Cleared</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
            <div className="text-2xl font-black font-mono text-amber-600 tabular-nums">
              {expiringUnits.length}
            </div>
            <div className="text-xs font-semibold text-amber-900 mt-0.5">Expiring Soon</div>
            <div className="text-[10px] text-amber-700 font-medium">&lt; 72 Hours Left</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl font-black font-mono text-purple-700 tabular-nums">
              {reservedUnits.length}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">Reserved Units</div>
            <div className="text-[10px] text-slate-400">Locked for OR / ICU</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="text-2xl font-black font-mono text-sky-700 tabular-nums">
              {issuedUnits.length}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">Issued Transfusions</div>
            <div className="text-[10px] text-slate-400">Dispatched Today</div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
            <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
              {bankUnits.length}
            </div>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">Total Registered</div>
            <div className="text-[10px] text-slate-400">Capacity: {currentBank.totalCapacity} Units</div>
          </div>
        </div>

        {/* Inventory Table & Filters Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">
                Blood Stock Registry & QR Tag Index
              </h2>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by Unit ID or Chamber..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-semibold text-slate-500">Group:</span>
              <button
                onClick={() => setSelectedGroup('ALL')}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedGroup === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-200/70 text-slate-700'
                }`}
              >
                All
              </button>
              {bloodGroups.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedGroup === g ? 'bg-red-600 text-white font-bold' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}

              <span className="font-semibold text-slate-500 ml-2">Status:</span>
              {(['ALL', 'Available', 'Reserved', 'Issued', 'Expired'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedStatus === st ? 'bg-slate-900 text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Unit Barcode ID</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Component Type</th>
                  <th className="py-3 px-4">Storage Location</th>
                  <th className="py-3 px-4">Collection Date</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedUnits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      No blood units found matching the active filter.
                    </td>
                  </tr>
                ) : (
                  displayedUnits.map((unit) => {
                    const exp = new Date(unit.expiryDate);
                    exp.setHours(0, 0, 0, 0);
                    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = diffDays >= 0 && diffDays <= 3 && unit.status === 'Available';

                    return (
                      <tr key={unit.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {unit.id}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-xs font-black bg-red-50 text-red-700 border border-red-200">
                            {unit.bloodGroup}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {unit.componentType}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {unit.storageLocation}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {unit.collectionDate}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className={isExpiringSoon ? 'font-bold text-amber-700 flex items-center gap-1' : 'text-slate-800'}>
                            {unit.expiryDate}
                            {isExpiringSoon && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">Exp Soon</span>}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              unit.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : unit.status === 'Reserved'
                                ? 'bg-purple-100 text-purple-800'
                                : unit.status === 'Issued'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {unit.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedUnitForQR(unit)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                              title="Generate & View QR Code"
                            >
                              <QrCode className="w-4 h-4 text-slate-600" />
                            </button>

                            {unit.status === 'Available' && (
                              <button
                                onClick={() => updateUnitStatus(unit.id, 'Reserved')}
                                className="px-2 py-1 text-[11px] font-semibold rounded bg-amber-50 text-amber-800 hover:bg-amber-100"
                              >
                                Reserve
                              </button>
                            )}

                            {unit.status === 'Reserved' && (
                              <button
                                onClick={() => updateUnitStatus(unit.id, 'Issued')}
                                className="px-2 py-1 text-[11px] font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                Issue
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Blood Unit Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Add Tested Blood Unit to Inventory
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUnit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Blood Group:
                    </label>
                    <select
                      value={newGroup}
                      onChange={(e) => setNewGroup(e.target.value as BloodGroup)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                    >
                      {bloodGroups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Component Type:
                    </label>
                    <select
                      value={newComponent}
                      onChange={(e) => setNewComponent(e.target.value as ComponentType)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      {components.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Collection / Donation Date:
                  </label>
                  <input
                    type="date"
                    value={newCollectionDate}
                    onChange={(e) => setNewCollectionDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                  <div className="text-[10px] text-slate-500 mt-1">
                    Auto-calculated expiry for {newComponent}:{' '}
                    <strong className="text-red-700 font-mono">
                      {calculateExpiryDate(newCollectionDate, newComponent)}
                    </strong>
                  </div>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Storage Chamber / Rack / Shelf:
                  </label>
                  <input
                    type="text"
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-[11px] leading-relaxed">
                  ✓ Pre-donation donor screening & mandatory viral marker tests (HIV 1&2, Hepatitis B, Hepatitis C, Syphilis, Malaria) verified.
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white"
                  >
                    Add Unit & Generate QR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
