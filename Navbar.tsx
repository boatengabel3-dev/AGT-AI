import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sprout,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Compass,
  Landmark,
  ShoppingCart,
  Tractor,
  Bot,
  Lock,
  Layers,
  Globe,
  ChevronDown,
  Check,
  Volume2,
} from 'lucide-react';
import { UserRole } from '../../types';
import { SupportedLanguage } from '../../i18n/translations';

interface NavbarProps {
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { user, activeView, setActiveView, logout } = useAuth();
  const { currentLanguage, setLanguage, languageInfo, availableLanguages, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [greetingToast, setGreetingToast] = useState<string | null>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setLangDropdownOpen(false);
    const selected = availableLanguages.find((l) => l.code === code);
    if (selected) {
      setGreetingToast(`${selected.greeting}`);
      setTimeout(() => setGreetingToast(null), 4000);
    }
  };

  // Strictly role-segregated navigation items with multi-language translation
  const getNavLinks = () => {
    if (!user) {
      return [
        { label: t('nav.howItWorks', 'How It Works'), view: 'how_it_works', icon: Compass },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: t('nav.adminPortal', 'Platform Admin'), view: 'admin_dashboard', icon: ShieldCheck },
        { label: t('nav.howItWorks', 'How It Works'), view: 'how_it_works', icon: Compass },
      ];
    }

    if (user.role === 'financial_institution') {
      return [
        { label: t('nav.bankPortal', 'Bank Admin & Credit'), view: 'institution_dashboard', icon: Landmark },
        { label: t('nav.financing', 'Loan Catalog'), view: 'financing', icon: Landmark },
        { label: t('nav.howItWorks', 'How It Works'), view: 'how_it_works', icon: Compass },
      ];
    }

    if (user.role === 'fertilizer_dealer') {
      return [
        { label: t('nav.fertilizerPortal', 'Fertilizer Admin'), view: 'fertilizer_admin', icon: Layers },
        { label: t('nav.marketplace', 'Marketplace View'), view: 'marketplace', icon: ShoppingCart },
        { label: t('nav.howItWorks', 'How It Works'), view: 'how_it_works', icon: Compass },
      ];
    }

    if (user.role === 'seed_dealer') {
      return [
        { label: t('nav.seedPortal', 'Seed Deals Admin'), view: 'seed_admin', icon: Sprout },
        { label: t('nav.marketplace', 'Marketplace View'), view: 'marketplace', icon: ShoppingCart },
        { label: t('nav.howItWorks', 'How It Works'), view: 'how_it_works', icon: Compass },
      ];
    }

    if (user.role === 'equipment_provider') {
      return [
        { label: t('nav.machineryPortal', 'Machinery Fleet Admin'), view: 'machinery_admin', icon: Tractor },
        { label: t('nav.equipment', 'Fleet View'), view: 'equipment', icon: Tractor },
        { label: t('nav.howItWorks', 'How It Works'), view: 'how_it_works', icon: Compass },
      ];
    }

    if (user.role === 'supplier') {
      return [
        { label: t('nav.fertilizerPortal', 'Fertilizer Admin'), view: 'fertilizer_admin', icon: Layers },
        { label: t('nav.marketplace', 'Marketplace View'), view: 'marketplace', icon: ShoppingCart },
        { label: t('nav.howItWorks', 'How It Works'), view: 'how_it_works', icon: Compass },
      ];
    }

    // Default: Smallholder Farmer
    return [
      { label: t('nav.dashboard', 'My Farm Dashboard'), view: 'farmer_dashboard', icon: Sprout },
      { label: t('nav.marketplace', 'Marketplace'), view: 'marketplace', icon: ShoppingCart },
      { label: t('nav.financing', 'Financing'), view: 'financing', icon: Landmark },
      { label: t('nav.equipment', 'Equipment'), view: 'equipment', icon: Tractor },
      { label: t('nav.advisory', 'AI Advisory'), view: 'ai_advisory', icon: Bot },
      { label: t('nav.howItWorks', 'How It Works'), view: 'how_it_works', icon: Compass },
    ];
  };

  const navLinks = getNavLinks();

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Platform Administrator';
      case 'financial_institution':
        return 'Bank Officer (ADB)';
      case 'fertilizer_dealer':
        return 'Fertilizer Admin';
      case 'equipment_provider':
        return 'Machinery Fleet Admin';
      case 'seed_dealer':
        return 'Seed Deals Admin';
      case 'supplier':
        return 'Agro Supplier Admin';
      case 'farmer':
        return 'Farmer';
      case 'field_agent':
        return 'Field Agent';
      default:
        return role;
    }
  };

  const getUserDashboardView = () => {
    if (!user) return 'landing';
    if (user.role === 'admin') return 'admin_dashboard';
    if (user.role === 'financial_institution') return 'institution_dashboard';
    if (user.role === 'fertilizer_dealer') return 'fertilizer_admin';
    if (user.role === 'equipment_provider') return 'machinery_admin';
    if (user.role === 'seed_dealer') return 'seed_admin';
    if (user.role === 'supplier') return 'fertilizer_admin';
    return 'farmer_dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E0D5] bg-[#F7F5EF]/95 backdrop-blur-md">
      {/* African Gold & Forest Green Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#103B2D] via-[#D4AF37] to-[#2E7D32]" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick(user ? getUserDashboardView() : 'landing')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37] shadow-sm transition-transform group-hover:scale-105 border border-[#D4AF37]/30">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-[#103B2D] whitespace-nowrap">
              AgriTrust <span className="text-[#2E7D32]">AI</span>
            </span>
          </button>
        </div>

        {/* Role-Segregated Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#171C19]/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-[#103B2D] pb-1 border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-[#2E7D32] text-[#103B2D] font-bold'
                    : 'border-transparent text-[#171C19]/70'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#2E7D32]' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Language Switcher + User Status / Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* REGIONAL AFRICAN LANGUAGE SWITCHER DROPDOWN */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-slate-800 hover:border-[#103B2D] hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
              title="Change platform language / Kasa / Gbe / Balli / Harshe"
              aria-label="Language Selector"
            >
              <Globe className="h-3.5 w-3.5 text-[#2E7D32]" />
              <span className="font-medium hidden sm:inline">{languageInfo.nativeName}</span>
              <span className="font-bold sm:hidden uppercase">{languageInfo.code}</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-white p-2 shadow-2xl border border-[#CBD5E1] z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Regional African Languages
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Select your native language for farming terms &amp; advice
                  </p>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1">
                  {availableLanguages.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#103B2D] text-white'
                            : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{lang.nativeName}</span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {lang.code.toUpperCase()}
                            </span>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${
                            isSelected ? 'text-[#F7F5EF]/80' : 'text-slate-500'
                          }`}>
                            {lang.region}
                          </span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-[#D4AF37] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 px-2 mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Volume2 className="h-3 w-3 text-[#2E7D32]" />
                  <span>Audio &amp; visual guidance in your indigenous language</span>
                </div>
              </div>
            )}
          </div>

          {/* User Status / Action Buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick(getUserDashboardView())}
                className="flex items-center gap-2 rounded-xl border border-[#D5CEBF] bg-white px-2.5 sm:px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title={`Signed in as ${user.fullName} (${getRoleDisplayName(user.role)})`}
              >
                <div className={`h-2 w-2 rounded-full ${user.role === 'admin' ? 'bg-purple-600' : 'bg-emerald-600'}`} />
                <span className="font-bold truncate max-w-[100px] sm:max-w-[120px]">{user.fullName.split(' ')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold hidden sm:inline ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : user.role === 'financial_institution'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </button>

              <button
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-red-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                title={t('nav.signOut', 'Sign Out')}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#103B2D] hover:text-[#2E7D32] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t('nav.signIn', 'Sign In')}
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-[#103B2D] hover:bg-[#1a4f3d] rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 border border-[#D4AF37]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="h-3 w-3 text-[#D4AF37]" />
                <span>{t('nav.createAccount', 'Get Started')}</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Greeting Toast Banner upon language change */}
      {greetingToast && (
        <div className="bg-[#103B2D] text-[#D4AF37] px-4 py-2 text-xs text-center border-t border-[#D4AF37]/30 flex items-center justify-center gap-2 animate-fade-in shadow-inner">
          <Volume2 className="h-3.5 w-3.5 animate-pulse" />
          <span className="font-semibold">{greetingToast}</span>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E0D5] bg-[#F7F5EF] px-4 pt-4 pb-6 space-y-4 shadow-xl animate-fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleNavClick(link.view)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors text-left min-h-[44px] cursor-pointer ${
                    isActive
                      ? 'bg-[#103B2D] text-[#D4AF37]'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Language Switcher Quick Chips */}
          <div className="pt-3 border-t border-[#E5E0D5]">
            <span className="text-[11px] font-bold text-slate-500 block mb-2 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#2E7D32]" />
              <span>{t('lang.label', 'Language')} / Kasa / Gbe / Harshe</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {availableLanguages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#103B2D] text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    {isSelected && <Check className="h-3 w-3 text-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
