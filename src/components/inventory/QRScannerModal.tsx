import React, { useState } from 'react';
import { QrCode, Scan, X, CheckCircle2, AlertTriangle, ShieldCheck, Search } from 'lucide-react';
import { useBloodBridge } from '../../context/BloodBridgeContext';
import { BloodUnit } from '../../types';

interface QRScannerModalProps {
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose }) => {
  const { bloodUnits, updateUnitStatus } = useBloodBridge();

  const [scannedUnit, setScannedUnit] = useState<BloodUnit | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSimulateScan = (unitId: string) => {
    setIsScanning(true);
    setErrorMsg('');
    setTimeout(() => {
      const found = bloodUnits.find((u) => u.id.toLowerCase() === unitId.toLowerCase());
      if (found) {
        setScannedUnit(found);
      } else {
        setErrorMsg(`Unit barcode "${unitId}" not found in current Solapur registry.`);
      }
      setIsScanning(false);
    }, 600);
  };

  const handleManualLookup = () => {
    if (!manualCode.trim()) return;
    handleSimulateScan(manualCode.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Blood Unit QR & Barcode Scanner
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewport Simulation */}
        <div className="relative bg-slate-950 rounded-xl h-56 flex flex-col items-center justify-center p-4 overflow-hidden border border-slate-800">
          {/* Laser scan line animation */}
          <div className="absolute inset-x-8 top-12 bottom-12 border-2 border-red-500/60 rounded-lg pointer-events-none">
            <div className="w-full h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-bounce" />
          </div>

          <p className="text-xs text-slate-300 font-medium z-10 text-center max-w-xs">
            Align unit bag QR label within the crosshairs to verify storage history & serological clearance.
          </p>

          {isScanning && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-20">
              <span className="text-xs text-red-400 font-mono animate-pulse">
                Decrypting ISBT-128 cryptographic tag...
              </span>
            </div>
          )}
        </div>

        {/* Quick Test Barcode Buttons */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
            Test Scan Existing Registry Units:
          </label>
          <div className="flex flex-wrap gap-2">
            {bloodUnits.slice(0, 4).map((u) => (
              <button
                key={u.id}
                onClick={() => handleSimulateScan(u.id)}
                className="text-xs font-mono px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors"
              >
                {u.bloodGroup} · {u.id.split('-').slice(-2).join('-')}
              </button>
            ))}
          </div>
        </div>

        {/* Manual ID Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Or type Blood Unit ID (e.g. BB-SOL-2026-O-4091)..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            onClick={handleManualLookup}
            className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Lookup
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scanned Result Details Card */}
        {scannedUnit && (
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3 text-xs animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-emerald-900">Valid Verified Unit Decoded</span>
              </div>
              <span className="font-mono text-slate-600 text-[11px]">{scannedUnit.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-500">Group:</span>{' '}
                <strong className="text-red-700 font-black">{scannedUnit.bloodGroup}</strong>
              </div>
              <div>
                <span className="text-slate-500">Component:</span>{' '}
                <strong>{scannedUnit.componentType}</strong>
              </div>
              <div>
                <span className="text-slate-500">Chamber:</span>{' '}
                <span className="font-mono font-medium">{scannedUnit.storageLocation}</span>
              </div>
              <div>
                <span className="text-slate-500">Expiry Date:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{scannedUnit.expiryDate}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-emerald-200/80">
              <span className="text-slate-600">Current Unit Status:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 uppercase">{scannedUnit.status}</span>
                {scannedUnit.status === 'Available' && (
                  <button
                    onClick={() => {
                      updateUnitStatus(scannedUnit.id, 'Reserved');
                      setScannedUnit({ ...scannedUnit, status: 'Reserved' });
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Mark Reserved
                  </button>
                )}
                {scannedUnit.status === 'Reserved' && (
                  <button
                    onClick={() => {
                      updateUnitStatus(scannedUnit.id, 'Issued');
                      setScannedUnit({ ...scannedUnit, status: 'Issued' });
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    Issue for Surgery
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
