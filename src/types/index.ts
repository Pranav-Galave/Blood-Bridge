export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ComponentType = 
  | 'Whole Blood'
  | 'Packed Red Cells'
  | 'Platelets'
  | 'Fresh Frozen Plasma'
  | 'Cryoprecipitate';

export type UrgencyLevel = 'Critical' | 'Urgent' | 'Standard';

export type RequestStatus = 
  | 'Pending'
  | 'Matching'
  | 'Donor Responded'
  | 'Blood Arranged'
  | 'Fulfilled'
  | 'Cancelled';

export type UnitStatus = 'Available' | 'Reserved' | 'Issued' | 'Expired';

export type UserRole = 'donor' | 'blood_bank' | 'hospital' | 'patient';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  area: string;
  city: string;
}

export interface BloodUnit {
  id: string; // e.g. BB-SOL-2026-O-4091
  bloodBankId: string;
  bloodBankName: string;
  bloodGroup: BloodGroup;
  componentType: ComponentType;
  collectionDate: string; // ISO date
  expiryDate: string; // ISO date
  status: UnitStatus;
  storageLocation: string; // e.g. "Cold Room B-2", "Agitator #1"
  donorAge?: number;
  donorGender?: 'Male' | 'Female' | 'Other';
  testedHepatitisHIV: boolean;
  notes?: string;
}

export interface BloodBank {
  id: string;
  name: string;
  licenseNumber: string;
  verified: boolean;
  location: LocationCoordinates;
  phone: string;
  emergencyPhone: string;
  email: string;
  operatingHours: string;
  totalCapacity: number;
  activeUnitsCount: number;
}

export interface Hospital {
  id: string;
  name: string;
  accreditation: string;
  verified: boolean;
  location: LocationCoordinates;
  phone: string;
  emergencyWardContact: string;
  email: string;
  activeRequestsCount: number;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  weightKg: number;
  location: LocationCoordinates;
  availability: 'Available Now' | 'On Call' | 'Unavailable';
  lastDonationDate: string; // ISO date
  lastDonationType: ComponentType;
  donationCount: number;
  verified: boolean;
  responseRate: number; // e.g. 96 (%)
  badges: string[];
  privacyPhoneVisible: boolean;
  avatarUrl?: string;
  registeredDate: string;
}

export interface ReplacementSlot {
  id: string;
  slotNumber: number;
  donorName?: string;
  donorPhone?: string;
  donorBloodGroup?: BloodGroup;
  status: 'Required' | 'Slot Reserved' | 'Screening Passed' | 'Donation Completed' | 'Transfusion Verified';
  verifiedByHospital: boolean;
  hospitalStaffNote?: string;
  completedAt?: string;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  patientAge: number;
  bloodGroup: BloodGroup;
  component: ComponentType;
  unitsRequired: number;
  unitsArranged: number;
  urgency: UrgencyLevel;
  requiredWithinHours: number;
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalLocation: LocationCoordinates;
  contactPerson: string;
  contactPhone: string;
  reasonForRequirement: string;
  status: RequestStatus;
  createdAt: string;
  replacementDonorsNeeded: number;
  arrangedDonors: number;
  replacementSlots: ReplacementSlot[];
  matchedBankId?: string;
  matchedBankName?: string;
  respondingDonorIds: string[];
}

export interface RankedDonor {
  donor: Donor;
  suitabilityScore: number; // 0 - 100
  distanceKm: number;
  isCompatible: boolean;
  compatibilityNote: string;
  eligibilityStatus: 'Eligible' | 'Waiting Period' | 'Unavailable';
  daysUntilEligible: number;
  scoreBreakdown: {
    compatibility: number; // 0-40
    distance: number; // 0-25
    availability: number; // 0-15
    eligibility: number; // 0-10
    history: number; // 0-5
    verification: number; // 0-5
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  entityId?: string; // Links to donorId, bankId, or hospitalId
  entityName?: string;
  avatar?: string;
}
