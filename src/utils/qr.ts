import QRCode from 'qrcode';
import { BloodUnit } from '../types';

/**
 * Generate a high resolution QR code data URL for a blood unit
 */
export async function generateBloodUnitQRCode(unit: BloodUnit): Promise<string> {
  const payload = {
    app: 'BLOOD_BRIDGE',
    unitId: unit.id,
    bloodGroup: unit.bloodGroup,
    component: unit.componentType,
    bankId: unit.bloodBankId,
    bankName: unit.bloodBankName,
    collected: unit.collectionDate,
    expiry: unit.expiryDate,
    storage: unit.storageLocation,
    tested: unit.testedHepatitisHIV,
    v: '1.0',
  };

  try {
    return await QRCode.toDataURL(JSON.stringify(payload), {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 256,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

/**
 * Generate QR code for donor certificate verification
 */
export async function generateCertificateQRCode(certificateId: string, donorName: string, bloodGroup: string): Promise<string> {
  const payload = {
    app: 'BLOOD_BRIDGE_VERIFY',
    certId: certificateId,
    donor: donorName,
    bloodGroup: bloodGroup,
    verified: true,
  };

  try {
    return await QRCode.toDataURL(JSON.stringify(payload), {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 180,
      color: {
        dark: '#991b1b',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Error generating certificate QR:', err);
    return '';
  }
}
