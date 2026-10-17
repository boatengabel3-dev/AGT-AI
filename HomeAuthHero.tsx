import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { UserRole } from '../../types';
import {
  Landmark,
  Tractor,
  ShieldCheck,
  Sprout,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileKey,
  Layers,
  Check,
  LogOut,
  ChevronRight,
  User as UserIcon,
} from 'lucide-react';

interface HomeAuthHeroProps {
  onOpenRegisterModal?: () => void;
}

export const HomeAuthHero: React.FC<HomeAuthHeroProps> = () => {
  const { user, login, register, loginWithGoogle, demoLogin, logout, setActiveView } = useAuth();
  const { t } = useLanguage();

  // Track: 'admin_group' (All Admin Portals Grouped) vs 'farmer' (Farmer & General User)
  const [authTrack, setAuthTrack] = useState<'admin_group' | 'farmer'>('admin_group');
  const [farmerMode, setFarmerMode] = useState<'login' | 'register'>('login');

  // Admin Group selection: 5 Admin Roles
  const [selectedAdminRole, setSelectedAdminRole] = useState<UserRole>('financial_institution');
  const [showCustomAdminCreds, setShowCustomAdminCreds] = useState(false);

  // Credentials form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Grouped Admin Portal Profiles
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
      updates: 'Platform governance, approve farmer & merchant KYC, update MoFA compliance parameters & review audits.',
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

  const getUserDashboardView = (role: UserRole) => {
    if (role === 'admin') return 'admin_dashboard';
    if (role === 'financial_institution') return 'institution_dashboard';
    if (role === 'fertilizer_dealer' || role === 'supplier') return 'fertilizer_admin';
    if (role === 'equipment_provider') return 'machinery_admin';
    if (role === 'seed_dealer') return 'seed_admin';
    return 'farmer_dashboard';
  };

  const handleAdminDirectLogin = async (roleToLogin: UserRole) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await demoLogin(roleToLogin);
    } catch (err: any) {
      setErrorMessage(err.message || 'Administrative authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCustomAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      await login(email.trim() || currentAdmin.email, password || 'AgriTrust2026!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Administrative authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (farmerMode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }
        await login(email.trim(), password);
      } else {
        if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
          throw new Error('Please fill in all registration fields.');
        }
        await register({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: registerRole,
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your confidential credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const emailToUse = email.trim() || undefined;
      const roleToUse = farmerMode === 'register' ? registerRole : 'farmer';
      await loginWithGoogle(emailToUse, roleToUse);
    } catch (err: any) {
      if (err?.message?.includes('cancelled by the user')) {
        return;
      }
      setErrorMessage(err.message || 'Google Sign-in failed. Please verify your Google account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#103B2D] via-[#0D3025] to-[#0A241C] text-[#F7F5EF] pt-8 pb-16 border-b border-[#2A4D3F]">
      {/* Decorative Gold Radial Grid Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Badge */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#185340]/90 px-3.5 py-1 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30 shadow-xs mb-3 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Regulated Digital Agricultural Financial Infrastructure &middot; Ghana</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F7F5EF] tracking-tight font-display mb-3">
            AgriTrust AI Confidential Gateway
          </h1>

          <p className="text-xs sm:text-sm text-[#F7F5EF]/80 max-w-2xl mx-auto leading-relaxed">
            West Africa&apos;s digital infrastructure uniting commercial banks, input dealers, mechanization providers, and smallholder farmers with confidential role isolation.
          </p>
        </div>

        {/* ALREADY SIGNED IN BANNER: If user is logged in, show their active session and portal entry */}
        {user ? (
          <div className="max-w-2xl mx-auto bg-white text-[#171C19] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/40 mb-8 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-[#103B2D] text-[#D4AF37] flex items-center justify-center font-bold text-lg border border-[#D4AF37]/30">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#103B2D]">{user.fullName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView(getUserDashboardView(user.role))}
                  className="py-2.5 px-4 rounded-xl bg-[#103B2D] hover:bg-[#0B2A20] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Open Your Dashboard</span>
                  <ChevronRight className="h-4 w-4 text-[#D4AF37]" />
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* THE GATEWAY GRID: 6 COLS Left (Overview) + 6 COLS Right (Sign In Form) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT 6 COLS: Architecture & Confidentiality Overview */}
            <div className="lg:col-span-6 bg-[#0B2A20]/90 rounded-2xl border border-[#D4AF37]/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Confidential Multi-Stakeholder Infrastructure
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#F7F5EF]/80 mb-6 leading-relaxed">
                  AgriTrust AI enforces cryptographic separation between all participants. Each administrator group operates strictly within their domain to update web app offerings, while farmers operate within private credit and parcel wallets.
                </p>

                {/* Stakeholder Administrative Roles Matrix */}
                <div className="space-y-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-[#103B2D]/80 border border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-950 text-[#D4AF37] border border-[#D4AF37]/20 shrink-0 mt-0.5">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Commercial Banks (ADB Ghana)</span>
                      <p className="text-[11px] text-[#F7F5EF]/70 leading-relaxed">
                        Update loan programs, adjust interest rates %, manage credit ceilings, and release escrow funds.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#103B2D]/80 border border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-950 text-[#D4AF37] border border-[#D4AF37]/20 shrink-0 mt-0.5">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Fertilizers &amp; Soil Nutrients (AfriAgro)</span>
                      <p className="text-[11px] text-[#F7F5EF]/70 leading-relaxed">
                        Update fertilizer catalog, bag prices in GHS, depot stock levels, and redeem input escrow vouchers.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#103B2D]/80 border border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-950 text-[#D4AF37] border border-[#D4AF37]/20 shrink-0 mt-0.5">
                      <Tractor className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Machineries &amp; Tractor Fleet (Volta)</span>
                      <p className="text-[11px] text-[#F7F5EF]/70 leading-relaxed">
                        Update tractor listings, adjust per-acre tillage rates in GHS, and approve mechanization bookings.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#103B2D]/80 border border-white/10 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-950 text-[#D4AF37] border border-[#D4AF37]/20 shrink-0 mt-0.5">
                      <Sprout className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">Certified Seed Deals (Heritage Seeds)</span>
                      <p className="text-[11px] text-[#F7F5EF]/70 leading-relaxed">
                        Update certified seed varieties, pack prices (GHS), germination test rates %, and fulfill seed vouchers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Security Compliance Bar */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#F7F5EF]/70">
                <div className="flex items-center gap-2">
                  <FileKey className="h-4 w-4 text-[#D4AF37]" />
                  <span className="font-semibold text-[#D4AF37]">
                    Role-Based Access Control (RBAC) &middot; Multi-Admin Architecture
                  </span>
                </div>
                <span className="text-[11px] text-[#F7F5EF]/60">
                  Regulated under Bank of Ghana &amp; MoFA
                </span>
              </div>
            </div>

            {/* RIGHT 6 COLS: Grouped Admin vs Farmer Login Gateway */}
            <div className="lg:col-span-6 bg-white text-[#171C19] rounded-2xl border border-[#E5E0D5] p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
              <div>
                {/* Top Gateway Group Track Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTrack('admin_group');
                      setErrorMessage(null);
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                      setErrorMessage(null);
                      setEmail('');
                      setPassword('');
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      authTrack === 'farmer'
                        ? 'bg-white text-[#103B2D] shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sprout className="h-3.5 w-3.5 text-[#2E7D32]" />
                    <span>Farmer / Producer Portal</span>
                  </button>
                </div>

                {/* Error Message Alert */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="text-red-400 hover:text-red-700 text-xs font-bold"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {/* TRACK 1: GROUPED ADMIN PORTALS */}
                {authTrack === 'admin_group' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#103B2D]">
                        Select Administrator Sector to Update Web App:
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Choose your sector below. You can log in with 1-click or use custom admin credentials:
                      </p>
                    </div>

                    {/* 5 Admin Role Selector Cards */}
                    <div className="space-y-2">
                      {ADMIN_PORTALS.map((portal) => {
                        const Icon = portal.icon;
                        const isSelected = selectedAdminRole === portal.role;
                        return (
                          <div
                            key={portal.role}
                            className={`p-3 rounded-xl border transition-all ${
                              isSelected
                                ? 'border-[#103B2D] bg-[#F7F5EF] ring-2 ring-[#2E7D32]/30 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAdminRole(portal.role);
                                  setEmail(portal.email);
                                  setPassword('AgriTrust2026!');
                                  setErrorMessage(null);
                                }}
                                className="flex items-start gap-2.5 text-left flex-1 cursor-pointer"
                              >
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
                              </button>

                              {/* 1-Click Fast Sign In Button */}
                              <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleAdminDirectLogin(portal.role)}
                                  disabled={loading}
                                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#103B2D] text-[#D4AF37] hover:bg-[#0B2A20] transition-all shadow-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                                  title={`Instant 1-Click Login as ${portal.title}`}
                                >
                                  <span>1-Click Login</span>
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Active Selected Admin Details */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-slate-600 mb-1">
                        <span className="font-semibold text-slate-700">Selected Sector:</span>
                        <span className="font-mono text-[11px] text-[#103B2D] font-bold">{currentAdmin.email}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Grants authority to update web app catalogs, pricing, interest rates, and fulfillment status for {currentAdmin.category}.
                      </p>
                    </div>

                    {/* Toggle Custom Admin Credentials */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setShowCustomAdminCreds(!showCustomAdminCreds)}
                        className="text-[11px] font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="h-3 w-3" />
                        <span>{showCustomAdminCreds ? 'Hide custom credentials' : 'Enter custom email & password'}</span>
                      </button>
                      <span className="text-[11px] text-slate-400">Default: AgriTrust2026!</span>
                    </div>

                    {/* Custom Admin Credentials Form */}
                    {showCustomAdminCreds ? (
                      <form onSubmit={handleAdminCustomAuth} className="space-y-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Admin Email Address</label>
                          <input
                            type="email"
                            required
                            value={email || currentAdmin.email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@agritrust.gh"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                          <input
                            type="password"
                            required
                            value={password || 'AgriTrust2026!'}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-2.5 px-4 rounded-lg bg-[#103B2D] hover:bg-[#0B2A20] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <span>Sign In with Custom Credentials</span>
                          <ArrowRight className="h-3.5 w-3.5 text-[#D4AF37]" />
                        </button>
                      </form>
                    ) : (
                      /* Primary 1-Click Authenticate Button */
                      <button
                        type="button"
                        onClick={() => handleAdminDirectLogin(selectedAdminRole)}
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl bg-[#103B2D] hover:bg-[#0B2A20] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                      >
                        <span>Authenticate as {currentAdmin.title} &amp; Update Web App</span>
                        <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
                      </button>
                    )}
                  </div>
                )}

                {/* TRACK 2: STANDARD FARMER AUTH */}
                {authTrack === 'farmer' && (
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setFarmerMode('login');
                            setErrorMessage(null);
                          }}
                          className={`text-sm font-bold pb-1 -mb-2.5 transition-colors border-b-2 cursor-pointer ${
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
                            setErrorMessage(null);
                          }}
                          className={`text-sm font-bold pb-1 -mb-2.5 transition-colors border-b-2 cursor-pointer ${
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
                        Confidential Wallet
                      </span>
                    </div>

                    {/* Google OAuth Button */}
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
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
                      <span>
                        {farmerMode === 'register'
                          ? t('auth.googleSignUp', 'Sign up with Google Account')
                          : t('auth.googleSignIn', 'Continue with Google Account')}
                      </span>
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
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Full Legal Name
                            </label>
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Samuel Ofori"
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Phone Number (Ghana MoMo / WhatsApp)
                            </label>
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+233 24 000 0000"
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Registering Account Role
                            </label>
                            <select
                              value={registerRole}
                              onChange={(e) => setRegisterRole(e.target.value as UserRole)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-white"
                            >
                              <option value="farmer">Smallholder Farmer / Producer</option>
                              <option value="supplier">Agro Inputs Merchant</option>
                              <option value="equipment_provider">Mechanization &amp; Tractor Provider</option>
                            </select>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. kwame.mensah@agritrust.gh"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full px-3 py-2 pr-9 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                      >
                        {loading ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <span>{farmerMode === 'login' ? 'Sign In' : 'Create Account'}</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Bottom Confidential Security Guarantee */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Strict Role Segregation</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">AgriTrust v2.4</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
