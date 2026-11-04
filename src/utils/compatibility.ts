import { BloodGroup, ComponentType } from '../types';

/**
 * Medically validated Red Blood Cell compatibility rules.
 * Reference: AABB (Association for the Advancement of Blood & Biotherapies) / DGHS India.
 */
export const RBC_COMPATIBILITY: Record<BloodGroup, { canGiveTo: BloodGroup[]; canReceiveFrom: BloodGroup[] }> = {
  'O-': {
    canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal red cell donor
    canReceiveFrom: ['O-'],
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
  },
  'A-': {
    canGiveTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
  },
  'B-': {
    canGiveTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
  },
  'AB-': {
    canGiveTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'], // Universal red cell recipient
  },
};

/**
 * Check if donor's red blood cells are compatible with recipient
 */
export function isRBCCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  return RBC_COMPATIBILITY[donorGroup]?.canGiveTo.includes(recipientGroup) ?? false;
}

/**
 * Standard shelf life in days according to blood component type and preservation methods.
 * DGHS / NACO / WHO standards.
 */
export const COMPONENT_SHELF_LIFE_DAYS: Record<ComponentType, number> = {
  'Whole Blood': 35, // in CPDA-1 storage solution (2°C - 6°C)
  'Packed Red Cells': 42, // in SAGM additive solution (2°C - 6°C)
  'Platelets': 5, // with continuous gentle agitation (20°C - 24°C)
  'Fresh Frozen Plasma': 365, // frozen below -30°C
  'Cryoprecipitate': 365, // frozen below -30°C
};

/**
 * Calculate estimated expiry date for a blood unit based on component type and collection date
 */
export function calculateExpiryDate(collectionDateStr: string, component: ComponentType): string {
  const date = new Date(collectionDateStr);
  const shelfDays = COMPONENT_SHELF_LIFE_DAYS[component] || 35;
  date.setDate(date.getDate() + shelfDays);
  return date.toISOString().split('T')[0];
}

/**
 * Calculate minimum inter-donation interval in days based on component type and gender.
 * In India (DGHS guidelines):
 * - Whole Blood: 90 days for men, 120 days for women (standard: 90 days)
 * - Plateletpheresis (single donor platelets): 14 days (or max 24 times/year)
 * - Plasmapheresis: 28 days
 */
export function getMinimumDonationIntervalDays(component: ComponentType, gender: 'Male' | 'Female' | 'Other' = 'Male'): number {
  switch (component) {
    case 'Whole Blood':
    case 'Packed Red Cells':
      return gender === 'Female' ? 120 : 90;
    case 'Platelets':
      return 14;
    case 'Fresh Frozen Plasma':
    case 'Cryoprecipitate':
      return 28;
    default:
      return 90;
  }
}

/**
 * Calculate donor's next eligible donation date and remaining days
 */
export function getNextEligibleDonationInfo(
  lastDonationDateStr: string,
  component: ComponentType = 'Whole Blood',
  gender: 'Male' | 'Female' | 'Other' = 'Male'
): { nextEligibleDate: string; daysRemaining: number; isEligible: boolean } {
  const lastDate = new Date(lastDonationDateStr);
  const intervalDays = getMinimumDonationIntervalDays(component, gender);
  
  const eligibleDate = new Date(lastDate);
  eligibleDate.setDate(eligibleDate.getDate() + intervalDays);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eligibleDate.setHours(0, 0, 0, 0);

  const diffTime = eligibleDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    nextEligibleDate: eligibleDate.toISOString().split('T')[0],
    daysRemaining: Math.max(0, daysRemaining),
    isEligible: daysRemaining <= 0,
  };
}

/**
 * Medical disclaimer text for clinical safety compliance
 */
export const MEDICAL_DISCLAIMER =
  'Important Medical Note: Biological compatibility indicators provided by Blood Bridge are based on standard ABO/Rh antigens. Final compatibility, crossmatching (major/minor), antibody screening, and transfusion decisions must always be confirmed by licensed blood bank pathologists and clinical officers.';
