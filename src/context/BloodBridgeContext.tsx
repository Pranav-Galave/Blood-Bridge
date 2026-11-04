import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import {
  BloodBank,
  BloodGroup,
  BloodUnit,
  ComponentType,
  Donor,
  EmergencyRequest,
  Hospital,
  LocationCoordinates,
  ReplacementSlot,
  UserRole,
} from '../types';
import {
  INITIAL_BLOOD_BANKS,
  INITIAL_BLOOD_UNITS,
  INITIAL_DONORS,
  INITIAL_EMERGENCY_REQUESTS,
  INITIAL_HOSPITALS,
} from '../data/mockData';
import { calculateExpiryDate } from '../utils/compatibility';
import { SOLAPUR_LANDMARKS } from '../utils/geo';
import { auth, db, testFirestoreConnection } from '../firebase/config';
import {
  FirebaseUserData,
  getUserProfileFromFirestore,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logOut,
  saveDonorToFirestore,
} from '../firebase/authService';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'urgent' | 'alert' | 'success' | 'info';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}

interface BloodBridgeContextType {
  // Navigation & Role
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  userLocation: LocationCoordinates;
  setUserLocation: (loc: LocationCoordinates) => void;
  isGpsActive: boolean;
  requestGpsPermission: () => void;

  // Firebase Auth State
  firebaseUser: User | null;
  firebaseUserData: FirebaseUserData | null;
  isFirebaseConnected: boolean;
  authLoading: boolean;
  loginUser: (email: string, pass: string) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    pass: string,
    role?: UserRole,
    phone?: string,
    bloodGroup?: BloodGroup
  ) => Promise<void>;
  loginGoogle: (role?: UserRole) => Promise<void>;
  logoutUser: () => Promise<void>;

  // Data
  bloodBanks: BloodBank[];
  hospitals: Hospital[];
  donors: Donor[];
  bloodUnits: BloodUnit[];
  emergencyRequests: EmergencyRequest[];
  notifications: AppNotification[];

  // Selected Entities for Modals
  selectedRequestForRanking: EmergencyRequest | null;
  setSelectedRequestForRanking: (req: EmergencyRequest | null) => void;
  selectedUnitForQR: BloodUnit | null;
  setSelectedUnitForQR: (unit: BloodUnit | null) => void;
  certificateDonor: Donor | null;
  setCertificateDonor: (donor: Donor | null) => void;

  // Modal Visibility
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isQRScannerOpen: boolean;
  setIsQRScannerOpen: (open: boolean) => void;

  // Actions
  createEmergencyRequest: (reqData: Partial<EmergencyRequest>) => EmergencyRequest;
  respondToEmergencyRequest: (requestId: string, donorId: string, accept: boolean) => void;
  updateRequestStatus: (requestId: string, status: EmergencyRequest['status']) => void;
  addBloodUnit: (unitData: Omit<BloodUnit, 'id'>) => BloodUnit;
  updateUnitStatus: (unitId: string, status: BloodUnit['status']) => void;
  recordCompletedDonation: (donorId: string, requestId?: string) => void;
  updateReplacementSlot: (
    requestId: string,
    slotId: string,
    donorName: string,
    donorPhone: string,
    bloodGroup: BloodGroup
  ) => void;
  verifyReplacementSlot: (
    requestId: string,
    slotId: string,
    verified: boolean,
    note?: string
  ) => void;
  registerNewDonor: (donorData: Omit<Donor, 'id'>) => Promise<Donor>;
  markNotificationAsRead: (id: string) => void;
  activePersona: {
    name: string;
    roleTitle: string;
    subtext: string;
    entityId?: string;
  };
}

const BloodBridgeContext = createContext<BloodBridgeContextType | undefined>(undefined);

export const BloodBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('patient');

  // Firebase Auth & Firestore State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firebaseUserData, setFirebaseUserData] = useState<FirebaseUserData | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Default location centered in Solapur (Jule Solapur / Saat Rasta)
  const [userLocation, setUserLocation] = useState<LocationCoordinates>(SOLAPUR_LANDMARKS.JULE_SOLAPUR);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(true);

  // Core Data
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>(INITIAL_BLOOD_BANKS);
  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [donors, setDonors] = useState<Donor[]>(INITIAL_DONORS);
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>(INITIAL_BLOOD_UNITS);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(INITIAL_EMERGENCY_REQUESTS);

  // Modals & Selected Objects
  const [selectedRequestForRanking, setSelectedRequestForRanking] = useState<EmergencyRequest | null>(null);
  const [selectedUnitForQR, setSelectedUnitForQR] = useState<BloodUnit | null>(null);
  const [certificateDonor, setCertificateDonor] = useState<Donor | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);

  // System Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: '🚨 Critical Blood Request Nearby',
      message: 'Ashwini Hospital needs 2 units of O+ Packed Red Cells immediately for emergency trauma surgery.',
      type: 'urgent',
      timestamp: '10 mins ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: '⚠️ Expiry Alert: 3 Blood Units',
      message: '3 units of O+ Packed Red Cells will expire in less than 72 hours at Civil Hospital Blood Centre.',
      type: 'alert',
      timestamp: '35 mins ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: '✅ Donation Verified',
      message: 'Emergency donation verified at Ashwini Hospital. Digital certificate is ready.',
      type: 'success',
      timestamp: '2 hours ago',
      read: true,
    },
  ]);

  // Check Firestore connection and listen for Auth state
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const profile = await getUserProfileFromFirestore(user.uid);
        if (profile) {
          setFirebaseUserData(profile);
          setActiveRole(profile.role);
        } else {
          setFirebaseUserData({
            uid: user.uid,
            name: user.displayName || 'User',
            email: user.email || '',
            role: 'donor',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setFirebaseUserData(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync donors from Firestore if available
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'donors'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteDonors: Donor[] = [];
          snapshot.forEach((doc) => {
            remoteDonors.push(doc.data() as Donor);
          });
          // Merge remote donors with local INITIAL_DONORS avoiding duplicate IDs
          setDonors((prev) => {
            const merged = [...remoteDonors];
            prev.forEach((d) => {
              if (!merged.find((m) => m.id === d.id)) {
                merged.push(d);
              }
            });
            return merged;
          });
        }
      }, (err) => {
        console.warn('Donors collection listener note:', err.message);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore snapshot setup notice:', e);
    }
  }, []);

  // Handle GPS detection
  const requestGpsPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'GPS Verified Live Position',
            area: 'Solapur Urban Zone',
            city: 'Solapur',
          });
          setIsGpsActive(true);
        },
        () => {
          setUserLocation(SOLAPUR_LANDMARKS.CIVIL_HOSPITAL);
          setIsGpsActive(true);
        }
      );
    } else {
      setUserLocation(SOLAPUR_LANDMARKS.CIVIL_HOSPITAL);
    }
  };

  // Auth Functions
  const loginUser = async (email: string, pass: string) => {
    const { user, profile } = await loginWithEmail(email, pass);
    setFirebaseUser(user);
    if (profile) {
      setFirebaseUserData(profile);
      setActiveRole(profile.role);
    }
    setNotifications((prev) => [
      {
        id: `notif-auth-${Date.now()}`,
        title: '🔐 Signed In Successfully',
        message: `Welcome back, ${profile?.name || user.email}! Connected to Firebase blood registry.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const registerUser = async (
    name: string,
    email: string,
    pass: string,
    role: UserRole = 'donor',
    phone?: string,
    bloodGroup?: BloodGroup
  ) => {
    const { user, profile } = await registerWithEmail(name, email, pass, role, phone, bloodGroup);
    setFirebaseUser(user);
    setFirebaseUserData(profile);
    setActiveRole(role);
    setNotifications((prev) => [
      {
        id: `notif-auth-${Date.now()}`,
        title: '🎉 Account Registered in Firebase',
        message: `Welcome to Blood Bridge, ${name}! Your account has been stored in project blood-bridge-b6238.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const loginGoogle = async (role: UserRole = 'donor') => {
    const { user, profile } = await loginWithGoogle(role);
    setFirebaseUser(user);
    setFirebaseUserData(profile);
    setActiveRole(profile.role);
  };

  const logoutUser = async () => {
    await logOut();
    setFirebaseUser(null);
    setFirebaseUserData(null);
  };

  // Register New Donor and persist to Firestore
  const registerNewDonor = async (donorData: Omit<Donor, 'id'>): Promise<Donor> => {
    const newId = `donor-${Date.now()}`;
    const newDonor: Donor = {
      ...donorData,
      id: newId,
    };

    // Update in-memory state
    setDonors((prev) => [newDonor, ...prev]);

    // Persist to Firestore
    try {
      await saveDonorToFirestore(newDonor);
    } catch (err) {
      console.warn('Could not persist donor to remote Firestore:', err);
    }

    setNotifications((prev) => [
      {
        id: `notif-donor-${Date.now()}`,
        title: '🩸 Voluntary Donor Registered',
        message: `${newDonor.name} (${newDonor.bloodGroup}) registered and synced to Solapur donor network.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    return newDonor;
  };

  // Create Emergency Request
  const createEmergencyRequest = (reqData: Partial<EmergencyRequest>): EmergencyRequest => {
    const newId = `REQ-SOL-2026-${Math.floor(100 + Math.random() * 900)}`;
    const replacementCount = reqData.replacementDonorsNeeded || 2;
    const initialSlots: ReplacementSlot[] = Array.from({ length: replacementCount }).map((_, i) => ({
      id: `slot-${Date.now()}-${i + 1}`,
      slotNumber: i + 1,
      status: 'Required',
      verifiedByHospital: false,
    }));

    const newRequest: EmergencyRequest = {
      id: newId,
      patientName: reqData.patientName || 'Emergency Patient',
      patientAge: reqData.patientAge || 35,
      bloodGroup: reqData.bloodGroup || 'O+',
      component: reqData.component || 'Packed Red Cells',
      unitsRequired: reqData.unitsRequired || 2,
      unitsArranged: 0,
      urgency: reqData.urgency || 'Critical',
      requiredWithinHours: reqData.requiredWithinHours || 4,
      hospitalId: reqData.hospitalId || 'hosp-1',
      hospitalName: reqData.hospitalName || 'Ashwini Sahakari Rugnalaya',
      hospitalAddress: reqData.hospitalAddress || 'Murarji Peth, Solapur',
      hospitalLocation: reqData.hospitalLocation || SOLAPUR_LANDMARKS.ASHWINI_HOSPITAL,
      contactPerson: reqData.contactPerson || 'Emergency Attendant',
      contactPhone: reqData.contactPhone || '+91 98220 00000',
      reasonForRequirement: reqData.reasonForRequirement || 'Emergency surgical intervention',
      status: 'Matching',
      createdAt: new Date().toISOString(),
      replacementDonorsNeeded: replacementCount,
      arrangedDonors: 0,
      replacementSlots: initialSlots,
      respondingDonorIds: [],
    };

    setEmergencyRequests((prev) => [newRequest, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `🚨 New ${newRequest.urgency} Request: ${newRequest.bloodGroup}`,
      message: `${newRequest.hospitalName} requires ${newRequest.unitsRequired} units of ${newRequest.bloodGroup} ${newRequest.component}.`,
      type: 'urgent',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newRequest;
  };

  // Donor accepts or declines request
  const respondToEmergencyRequest = (requestId: string, donorId: string, accept: boolean) => {
    setEmergencyRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updatedResponding = accept
            ? Array.from(new Set([...req.respondingDonorIds, donorId]))
            : req.respondingDonorIds.filter((id) => id !== donorId);
          return {
            ...req,
            respondingDonorIds: updatedResponding,
            status: accept ? ('Donor Responded' as const) : req.status,
          };
        }
        return req;
      })
    );

    if (accept) {
      setNotifications((prev) => [
        {
          id: `notif-resp-${Date.now()}`,
          title: '❤️ Donor Accepted Request',
          message: `Donor responded to request ${requestId} and is en-route for screening.`,
          type: 'success',
          timestamp: 'Just now',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  // Update Request Status
  const updateRequestStatus = (requestId: string, status: EmergencyRequest['status']) => {
    setEmergencyRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  // Add Blood Unit to Blood Bank
  const addBloodUnit = (unitData: Omit<BloodUnit, 'id'>): BloodUnit => {
    const generatedId = `BB-SOL-2026-${unitData.bloodGroup.replace('+', 'P').replace('-', 'N')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newUnit: BloodUnit = {
      ...unitData,
      id: generatedId,
      expiryDate: unitData.expiryDate || calculateExpiryDate(unitData.collectionDate, unitData.componentType),
    };

    setBloodUnits((prev) => [newUnit, ...prev]);

    setBloodBanks((prev) =>
      prev.map((b) =>
        b.id === unitData.bloodBankId
          ? { ...b, activeUnitsCount: b.activeUnitsCount + 1 }
          : b
      )
    );

    return newUnit;
  };

  // Update status of a blood unit
  const updateUnitStatus = (unitId: string, status: BloodUnit['status']) => {
    setBloodUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, status } : u))
    );
  };

  // Record a completed donation for a donor
  const recordCompletedDonation = (donorId: string, requestId?: string) => {
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id === donorId) {
          const newCount = d.donationCount + 1;
          const badges = [...d.badges];
          if (newCount >= 1 && !badges.includes('First Life Saver')) badges.push('First Life Saver');
          if (newCount >= 5 && !badges.includes('Helping Hero')) badges.push('Helping Hero');
          if (newCount >= 10 && !badges.includes('Blood Champion')) badges.push('Blood Champion');
          if (newCount >= 20 && !badges.includes('Lifesaver Legend')) badges.push('Lifesaver Legend');

          return {
            ...d,
            donationCount: newCount,
            lastDonationDate: new Date().toISOString().split('T')[0],
            badges,
          };
        }
        return d;
      })
    );

    if (requestId) {
      setEmergencyRequests((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            const arranged = Math.min(req.unitsRequired, req.unitsArranged + 1);
            return {
              ...req,
              unitsArranged: arranged,
              status: arranged >= req.unitsRequired ? 'Fulfilled' : 'Blood Arranged',
            };
          }
          return req;
        })
      );
    }
  };

  // Update Replacement Slot by Patient/Relative
  const updateReplacementSlot = (
    requestId: string,
    slotId: string,
    donorName: string,
    donorPhone: string,
    bloodGroup: BloodGroup
  ) => {
    setEmergencyRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updatedSlots = req.replacementSlots.map((slot) => {
            if (slot.id === slotId) {
              return {
                ...slot,
                donorName,
                donorPhone,
                donorBloodGroup: bloodGroup,
                status: 'Slot Reserved' as const,
              };
            }
            return slot;
          });
          const filledCount = updatedSlots.filter((s) => s.status !== 'Required').length;
          return {
            ...req,
            replacementSlots: updatedSlots,
            arrangedDonors: filledCount,
          };
        }
        return req;
      })
    );
  };

  // Hospital verifies replacement donation
  const verifyReplacementSlot = (
    requestId: string,
    slotId: string,
    verified: boolean,
    note?: string
  ) => {
    setEmergencyRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updatedSlots = req.replacementSlots.map((slot) => {
            if (slot.id === slotId) {
              return {
                ...slot,
                verifiedByHospital: verified,
                status: verified ? ('Donation Completed' as const) : slot.status,
                hospitalStaffNote: note || 'Verified & approved by hospital transfusion officer.',
                completedAt: verified ? new Date().toISOString() : undefined,
              };
            }
            return slot;
          });
          return {
            ...req,
            replacementSlots: updatedSlots,
          };
        }
        return req;
      })
    );
  };

  // Mark notification read
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Active persona meta details (Prioritize Firebase authenticated user if logged in)
  const getActivePersonaMeta = () => {
    if (firebaseUserData && firebaseUser) {
      return {
        name: firebaseUserData.name,
        roleTitle: `Verified ${firebaseUserData.role.toUpperCase().replace('_', ' ')} · Firebase Account`,
        subtext: `${firebaseUserData.email} · Synced with Firestore`,
        entityId: firebaseUserData.uid,
      };
    }

    switch (activeRole) {
      case 'donor':
        return {
          name: 'Voluntary Donor',
          roleTitle: 'Voluntary Donor Desk',
          subtext: 'Solapur Network · Register or Sign In to view your profile',
          entityId: 'donor-portal',
        };
      case 'blood_bank':
        return {
          name: 'Dr. Ananya Kulkarni',
          roleTitle: 'Chief Medical Officer · Solapur Civil Hospital Blood Centre',
          subtext: 'Govt. Blood Centre MH/SOL/BB/2012-08 · Saat Rasta',
          entityId: 'bank-1',
        };
      case 'hospital':
        return {
          name: 'Dr. Rajesh Shinde',
          roleTitle: 'Emergency Transfusion Officer · Ashwini Sahakari Hospital',
          subtext: 'NABH Accredited Multi-Specialty · Murarji Peth',
          entityId: 'hosp-1',
        };
      case 'patient':
      default:
        return {
          name: 'Care Coordinator',
          roleTitle: 'Patient & Family Assistance Desk',
          subtext: 'Emergency blood coordination at GMC Solapur',
          entityId: 'REQ-SOL-2026-102',
        };
    }
  };

  return (
    <BloodBridgeContext.Provider
      value={{
        activeNavTab,
        setActiveNavTab,
        activeRole,
        setActiveRole,
        userLocation,
        setUserLocation,
        isGpsActive,
        requestGpsPermission,
        firebaseUser,
        firebaseUserData,
        isFirebaseConnected,
        authLoading,
        loginUser,
        registerUser,
        loginGoogle,
        logoutUser,
        bloodBanks,
        hospitals,
        donors,
        bloodUnits,
        emergencyRequests,
        notifications,
        selectedRequestForRanking,
        setSelectedRequestForRanking,
        selectedUnitForQR,
        setSelectedUnitForQR,
        certificateDonor,
        setCertificateDonor,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isQRScannerOpen,
        setIsQRScannerOpen,
        createEmergencyRequest,
        respondToEmergencyRequest,
        updateRequestStatus,
        addBloodUnit,
        updateUnitStatus,
        recordCompletedDonation,
        updateReplacementSlot,
        verifyReplacementSlot,
        registerNewDonor,
        markNotificationAsRead,
        activePersona: getActivePersonaMeta(),
      }}
    >
      {children}
    </BloodBridgeContext.Provider>
  );
};

export const useBloodBridge = () => {
  const context = useContext(BloodBridgeContext);
  if (!context) {
    throw new Error('useBloodBridge must be used within a BloodBridgeProvider');
  }
  return context;
};
