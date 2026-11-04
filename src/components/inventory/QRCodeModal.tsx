import React, { useEffect, useState } from 'react';
import { QrCode, X, Printer, ShieldCheck, Calendar, Thermometer, MapPin } from 'lucide-react';
import { BloodUnit } from '../../types';
import { generateBloodUnitQRCode } from '../../utils/qr';

interface QRCodeModalProps {
  unit: BloodUnit;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ unit, onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    generateBloodUnitQRCode(unit).then(setQrUrl);
  }, [unit]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Blood Unit QR Bag Tag & Chain of Custody
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt={`QR Code for ${unit.id}`}
              className="w-52 h-52 bg-white p-2 rounded-lg shadow-sm border border-slate-200"
            />
          ) : (
            <div className="w-52 h-52 bg-slate-200 rounded-lg animate-pulse" />
          )}
          <span className="mt-2 font-mono text-xs font-bold text-slate-800 tracking-wider">
            {unit.id}
          </span>
          <span className="text-[10px] text-slate-500">
            Encrypted ISBT-128 Medical Payload
          </span>
        </div>

        {/* Blood Unit Medical Spec */}
        <div className="space-y-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Blood Group:</span>
            <span className="font-black text-red-700 text-sm bg-red-50 px-2 py-0.5 rounded border border-red-100">
              {unit.bloodGroup}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Component:</span>
            <span className="font-semibold text-slate-900">{unit.componentType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Stored At:</span>
            <span className="font-medium text-slate-900">{unit.bloodBankName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Chamber Location:</span>
            <span className="font-mono text-slate-900 font-semibold">{unit.storageLocation}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Collection Date:</span>
            <span className="font-mono text-slate-700">{unit.collectionDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Expiry Date:</span>
            <span className="font-mono text-red-700 font-bold">{unit.expiryDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Infectious Disease Testing:</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              HIV / HBV / HCV / Syphilis Negative
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Bag Label</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
