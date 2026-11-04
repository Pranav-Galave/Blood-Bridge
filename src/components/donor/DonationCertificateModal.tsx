import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, Download, Share2, ShieldCheck, X } from 'lucide-react';
import { Donor } from '../../types';
import { generateCertificateQRCode } from '../../utils/qr';

interface DonationCertificateModalProps {
  donor: Donor;
  onClose: () => void;
}

export const DonationCertificateModal: React.FC<DonationCertificateModalProps> = ({
  donor,
  onClose,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const certId = `BB-CERT-MH-${donor.id.toUpperCase()}-${donor.donationCount.toString().padStart(3, '0')}`;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#dc2626', '#b91c1c', '#f59e0b', '#10b981'],
    });

    generateCertificateQRCode(certId, donor.name, donor.bloodGroup).then(setQrUrl);
  }, [donor, certId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Official Blood Donation Life Saver Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-base p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Content Body */}
        <div id="printable-certificate" className="p-8 sm:p-10 bg-[#fffdfa] border-8 border-double border-red-900/30 m-4 rounded-xl relative text-center">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96 text-red-900" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold tracking-widest uppercase text-red-700">
              SOLAPUR DISTRICT VOLUNTARY BLOOD DONATION NETWORK
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-serif">
              Certificate of Appreciation
            </h2>
            <div className="text-xs text-slate-500 font-medium">
              National Blood Transfusion Services & Blood Bridge Foundation
            </div>
          </div>

          <div className="my-6 w-24 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto" />

          {/* Certificate Citation */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
            <p className="italic text-slate-600">This certificate of honor is proudly presented to</p>
            <h3 className="text-2xl font-bold text-slate-900 font-serif tracking-tight border-b-2 border-red-800 pb-1 inline-block px-4">
              {donor.name}
            </h3>
            <p>
              In sincere gratitude for voluntary blood donation of group{' '}
              <strong className="text-red-700 font-black text-base">{donor.bloodGroup}</strong>.
              Your noble and selfless act of giving blood represents a gift of life to emergency
              patients, accident survivors, and surgery cases in Solapur.
            </p>
          </div>

          {/* Milestone Stat Badge */}
          <div className="my-6 inline-flex items-center gap-3 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs font-semibold">
            <Award className="w-4 h-4 text-red-600" />
            <span>Lifetime Verified Donations: <strong>{donor.donationCount} Units Donated</strong></span>
            <span>·</span>
            <span>Badge Earned: <strong>{donor.badges[donor.badges.length - 1] || 'Life Saver'}</strong></span>
          </div>

          {/* Footer Signatures & QR Code */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-center gap-4 text-xs">
            {/* Left Signatory */}
            <div className="space-y-1">
              <div className="font-serif italic text-sm text-slate-800">Dr. Ananya Kulkarni</div>
              <div className="h-px bg-slate-300 w-32 mx-auto" />
              <div className="text-[10px] text-slate-500">Chief Medical Officer</div>
              <div className="text-[9px] text-slate-400">Civil Hospital Blood Centre</div>
            </div>

            {/* Center Verified QR Stamp */}
            <div className="flex flex-col items-center">
              {qrUrl ? (
                <img src={qrUrl} alt="Verify Certificate QR" className="w-20 h-20 shadow-xs border border-slate-200 p-1 bg-white rounded" />
              ) : (
                <div className="w-20 h-20 bg-slate-100 rounded animate-pulse" />
              )}
              <div className="text-[9px] font-mono text-slate-400 mt-1">Scan to Verify Authenticity</div>
            </div>

            {/* Right Signatory */}
            <div className="space-y-1">
              <div className="font-mono text-xs font-bold text-slate-800">{issueDate}</div>
              <div className="h-px bg-slate-300 w-32 mx-auto" />
              <div className="text-[10px] text-slate-500">Date of Recognition</div>
              <div className="text-[9px] font-mono text-slate-400">ID: {certId}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
