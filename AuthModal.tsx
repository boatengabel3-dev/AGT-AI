import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Sprout,
  ShieldCheck,
  ArrowRight,
  Landmark,
  Layers,
  Tractor,
  Check,
  Lock,
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, loginWithGoogle, demoLogin } = useAuth();
  
  // Track: 'farmer' vs 'admin_group'
  const [authTrack, setAuthTrack] = useState<'admin_group' | 'farmer'>('farmer');
  const [farmerMode, setFarmerMode] = useState<'login' | 'register'>(initialMode);
  
  // Selected admin role
  const [selectedAdminRole, setSelectedAdminRole] = useState<UserRole>('financial_institution');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 5 Grouped Admin Portals
  const ADMIN_PORTALS = [
    {
      role: 'financial_institution' as UserRole,
      title: 'Commercial Bank (ADB Ghana)',
      category: 'Banking & Credit',
      icon: Landmark,
      email: 'agri.bank@agritrust.gh',
      color: 'border-blue-500 bg-blue-50/40 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800',
      updates: 'Update loan programs, adjust interest rates %, manage credit ceilings & underwrite escrow disbursements.',
    },
    {
      role: 'admin' as UserRole,
      title: 'Platform Administrator',
      category: 'National Governance',
      icon: ShieldCheck,
      email: 'admin@agritrust.gh',
      color: 'border-emerald-600 bg-emerald-50/40 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      updates: 'Platform governance, approve/verify farmer & merchant KYC, update MoFA compliance parameters & review audits.',
    },
    {
      role: 'fertilizer_dealer' as UserRole,
      title: 'Fertilizer Inputs Dealer (AfriAgro)',
      category: 'Fertilizers',
      icon: Layers,
      email: 'fertilizer.admin@agritrust.gh',
      color: 'border-amber-500 bg-amber-50/40 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800',
      updates: 'Update fertilizer catalog, change price per 50kg bag (GHS), update warehouse stock & redeem farmer escrow vouchers.',
    },
    {
      role: 'equipment_provider' as UserRole,
      title: 'Machinery & Tractor Fleet (Volta)',
      category: 'Machinery Fleet',
      icon: Tractor,
      email: 'volta.tractors@agritrust.gh',
      color: 'border-orange-500 bg-orange-50/40 text-orange-900',
      badgeColor: 'bg-orange-100 text-orange-800',
      updates: 'Update tractor listings, adjust per-acre tillage rates in GHS, toggle machine availability & confirm farmer bookings.',
    },
    {
      role: 'seed_dealer' as UserRole,
      title: 'Certified Seed Deals (Heritage Seeds)',
      category: 'Certified Seeds',
      icon: Sprout,
      email: 'seed.admin@agritrust.gh',
      color: 'border-green-600 bg-green-50/40 text-green-900',
      badgeColor: 'bg-green-100 text-green-800',
      updates: 'Update certified seed varieties, pack prices (GHS), record germination batch tests % & fulfill subsidized seed vouchers.',
    },
  ];

  const currentAdmin = ADMIN_PORTALS.find((p) => p.role === selectedAdminRole) || ADMIN_PORTALS[0];

  const handleAdminLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(selectedAdminRole);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Administrative authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const emailToUse = email.trim() || undefined;
      const roleToUse = farmerMode === 'register' ? role : 'farmer';
      await loginWithGoogle(emailToUse, roleToUse);
      onClose();
    } catch (err: any) {
      if (err?.message?.includes('cancelled by the user')) {
        return;
      }
      setError(err.message || 'Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (farmerMode === 'login') {
        await login(email, password);
      } else {
        await register({ fullName, email, phone, password, role });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-[#E5E0D5] my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#103B2D]">
              AgriTrust AI Authentication
            </h3>
            <p className="text-xs text-slate-500">
              Select your role category to access and update the platform
            </p>
          </div>
        </div>

        {/* Group Selector: Admin Portals (Grouped) vs Farmer / User */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-5 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setAuthTrack('admin_group');
              setError(null);
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authTrack === 'admin_group'
                ? 'bg-[#103B2D] text-[#D4AF37] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Admin Portals (Grouped)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthTrack('farmer');
              setError(null);
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authTrack === 'farmer'
                ? 'bg-white text-[#103B2D] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sprout className="h-3.5 w-3.5 text-[#2E7D32]" />
            <span>Farmer / General User</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-800 border border-red-200">
            {error}
          </div>
        )}

        {/* TRACK 1: GROUPED ADMIN PORTALS */}
        {authTrack === 'admin_group' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-[#103B2D] uppercase tracking-wider">
                Select Administrator Sector to Update Web App:
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Each administrator has dedicated controls to update offerings, rates, and catalog listings.
              </p>
            </div>

            {/* 5 Admin Role Selector Cards */}
            <div className="space-y-2">
              {ADMIN_PORTALS.map((portal) => {
                const Icon = portal.icon;
                const isSelected = selectedAdminRole === portal.role;
                return (
                  <button
                    key={portal.role}
                    type="button"
                    onClick={() => {
                      setSelectedAdminRole(portal.role);
                      setError(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#103B2D] bg-[#F7F5EF] ring-2 ring-[#2E7D32]/30 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#103B2D] text-[#D4AF37]' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#103B2D]">{portal.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${portal.badgeColor}`}>
                            {portal.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                          {portal.updates}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 mt-1">
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#2E7D32] bg-[#2E7D32] text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Admin Info Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="font-semibold text-slate-700">Active Sector:</span>
                <span className="font-mono text-[11px] text-[#103B2D] font-bold">{currentAdmin.email}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Grants administrative rights to update the live web app data for {currentAdmin.category}.
              </p>
            </div>

            {/* Authenticate Button */}
            <button
              type="button"
              onClick={handleAdminLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#103B2D] hover:bg-[#0B2A20] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              <span>Login as {currentAdmin.title} &amp; Update Web App</span>
              <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
            </button>
          </div>
        )}

        {/* TRACK 2: STANDARD FARMER / GENERAL USER AUTH */}
        {authTrack === 'farmer' && (
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFarmerMode('login');
                    setError(null);
                  }}
                  className={`text-sm font-bold pb-1 -mb-2.5 transition-colors border-b-2 ${
                    farmerMode === 'login'
                      ? 'border-[#2E7D32] text-[#103B2D]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Farmer Sign In
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setFarmerMode('register');
                    setError(null);
                  }}
                  className={`text-sm font-bold pb-1 -mb-2.5 transition-colors border-b-2 ${
                    farmerMode === 'register'
                      ? 'border-[#2E7D32] text-[#103B2D]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Farmer Account
                </button>
              </div>

              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Lock className="h-2.5 w-2.5" />
                Farmer Portal
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mb-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:border-slate-400 disabled:opacity-60 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Account</span>
            </button>

            <div className="relative mb-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Or with email
              </span>
            </div>

            <form onSubmit={handleFarmerSubmit} className="space-y-3">
              {farmerMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +233 24 456 7890"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. kwame.mensah@agritrust.gh"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#2E7D32] focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#103B2D] py-2.5 text-xs font-semibold text-white hover:bg-[#185340] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {loading ? 'Processing...' : farmerMode === 'login' ? 'Sign In as Farmer' : 'Complete Farmer Registration'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Footer Security Notice */}
        <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
            <span>Strict Role-Based Confidential Separation</span>
          </div>
          <span>Bank of Ghana &amp; MoFA Regulated</span>
        </div>
      </div>
    </div>
  );
};
