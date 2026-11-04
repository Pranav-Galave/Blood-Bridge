import React, { useState } from 'react';
import {
  Menu,
  X,
  Bell,
  AlertTriangle,
  UserCheck,
  Shield,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Logo } from './Logo';
import { useBloodBridge } from '../../context/BloodBridgeContext';

export const Navbar: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    setIsEmergencyModalOpen,
    setIsAuthModalOpen,
    notifications,
    markNotificationAsRead,
    activeRole,
    activePersona,
    userLocation,
    isGpsActive,
    requestGpsPermission,
    firebaseUser,
    firebaseUserData,
    logoutUser,
  } = useBloodBridge();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'find-blood', label: 'Find Blood' },
    { id: 'become-donor', label: 'Become a Donor' },
    { id: 'blood-banks', label: 'Blood Banks' },
    { id: 'hospitals', label: 'Hospitals' },
    { id: 'matching', label: 'Donor Matching' },
    { id: 'education', label: 'Learn About Blood' },
    { id: 'dashboard', label: 'My Dashboard' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveNavTab('home')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg"
            >
              <Logo size="md" showTagline={false} />
            </button>

            {/* GPS Location Pill */}
            <button
              onClick={requestGpsPermission}
              title="Click to refresh Solapur GPS Location"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span className="font-medium text-slate-800">{userLocation.area}</span>
              <span className="text-slate-400">({userLocation.city})</span>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            {navLinks.map((link) => {
              const isActive = activeNavTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveNavTab(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-red-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Notification Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-900">Network Alerts</span>
                    <span className="text-xs text-slate-500">{notifications.length} updates</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-red-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-800"
                    >
                      Close Alerts
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Firebase Auth Profile / Sign In */}
            {firebaseUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveNavTab('dashboard')}
                  className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  title="View your connected profile"
                >
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {(firebaseUserData?.name || firebaseUser.email || 'U')[0].toUpperCase()}
                  </span>
                  <span className="max-w-[100px] truncate">
                    {firebaseUserData?.name || firebaseUser.displayName || 'My Account'}
                  </span>
                </button>
                <button
                  onClick={logoutUser}
                  className="text-xs text-slate-500 hover:text-red-600 font-medium px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Sign In / Up</span>
              </button>
            )}

            {/* Emergency Request Button (Zone 3 Primary CTA) */}
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Need Blood</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveNavTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                activeNavTab === link.id
                  ? 'bg-red-50 text-red-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Account / Register / Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
