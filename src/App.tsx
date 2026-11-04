import React from 'react';
import { BloodBridgeProvider, useBloodBridge } from './context/BloodBridgeContext';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { FourWayNetwork } from './components/home/FourWayNetwork';
import { InteractiveNetworkMap } from './components/map/InteractiveNetworkMap';
import { FindBloodSection } from './components/find-blood/FindBloodSection';
import { BecomeDonorSection } from './components/donor/BecomeDonorSection';
import { BloodBanksDirectory } from './components/directory/BloodBanksDirectory';
import { HospitalsDirectory } from './components/directory/HospitalsDirectory';
import { DonorRankingSection } from './components/ranking/DonorRankingSection';
import { LearnAboutBlood } from './components/education/LearnAboutBlood';
import { DonorDashboard } from './components/dashboards/DonorDashboard';
import { BloodBankDashboard } from './components/dashboards/BloodBankDashboard';
import { HospitalDashboard } from './components/dashboards/HospitalDashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { EmergencyRequestModal } from './components/common/EmergencyRequestModal';
import { AuthModal } from './components/auth/AuthModal';
import { QRCodeModal } from './components/inventory/QRCodeModal';
import { QRScannerModal } from './components/inventory/QRScannerModal';
import { DonationCertificateModal } from './components/donor/DonationCertificateModal';
import { MapPin, Phone, ShieldCheck, Heart, AlertCircle, ArrowRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    activeRole,
    selectedUnitForQR,
    setSelectedUnitForQR,
    certificateDonor,
    setCertificateDonor,
    isQRScannerOpen,
    setIsQRScannerOpen,
    setIsEmergencyModalOpen,
  } = useBloodBridge();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. Emergency Helpline Top Banner */}
      <EmergencyBanner />

      {/* 2. Stakeholder Persona Switcher (Allows testing all 4 viewpoints immediately) */}
      <RoleSwitcher />

      {/* 3. Top Navigation Bar (3-Zone Contract) */}
      <Navbar />

      {/* 4. Dynamic Main Viewport */}
      <main className="flex-1">
        {activeNavTab === 'home' && (
          <div>
            <Hero />
            <FourWayNetwork />

            {/* Solapur Live GPS Network Map Showcase */}
            <section className="py-14 bg-slate-100/70 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Geospatial Emergency Routing
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                      Live Solapur Blood Logistics Map
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Interactive GPS radar mapping active emergency surgery requests, certified blood banks,
                      and registered on-call voluntary donors.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNavTab('matching')}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline self-start sm:self-auto"
                  >
                    <span>Launch Algorithmic Donor Ranking Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <InteractiveNetworkMap />
              </div>
            </section>

            {/* Quick Education Teaser */}
            <section className="py-12 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl text-white p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
                  <div className="space-y-2 max-w-2xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-200">
                      Blood Education Centre
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Curious About Your Blood Group Compatibility or Hemoglobin?
                    </h3>
                    <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
                      Explore our 5-part guide explaining the ABO/Rh matrix, component therapy, hemoglobin dietary guidelines, and blood donation myths vs facts.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveNavTab('education')}
                    className="px-6 py-3 rounded-xl bg-white text-red-700 hover:bg-red-50 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 self-start md:self-auto"
                  >
                    Explore Learn About Blood →
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeNavTab === 'find-blood' && <FindBloodSection />}

        {activeNavTab === 'become-donor' && <BecomeDonorSection />}

        {activeNavTab === 'blood-banks' && <BloodBanksDirectory />}

        {activeNavTab === 'hospitals' && <HospitalsDirectory />}

        {activeNavTab === 'matching' && <DonorRankingSection />}

        {activeNavTab === 'education' && <LearnAboutBlood />}

        {activeNavTab === 'dashboard' && (
          <div>
            {activeRole === 'donor' && <DonorDashboard />}
            {activeRole === 'blood_bank' && <BloodBankDashboard />}
            {activeRole === 'hospital' && <HospitalDashboard />}
            {activeRole === 'patient' && <PatientDashboard />}
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. System Modals */}
      <EmergencyRequestModal />
      <AuthModal />

      {selectedUnitForQR && (
        <QRCodeModal
          unit={selectedUnitForQR}
          onClose={() => setSelectedUnitForQR(null)}
        />
      )}

      {isQRScannerOpen && (
        <QRScannerModal onClose={() => setIsQRScannerOpen(false)} />
      )}

      {certificateDonor && (
        <DonationCertificateModal
          donor={certificateDonor}
          onClose={() => setCertificateDonor(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <BloodBridgeProvider>
      <AppContent />
    </BloodBridgeProvider>
  );
}
