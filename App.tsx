import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { FarmerOnboardingModal } from './components/onboarding/FarmerOnboardingModal';
import { RegisterFarmModal } from './pages/RegisterFarmModal';
import { AccessDenied } from './components/common/AccessDenied';

// Pages
import { PublicHome } from './pages/PublicHome';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { MarketplacePage } from './pages/MarketplacePage';
import { FinancingPage } from './pages/FinancingPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { SupplierDashboard } from './pages/SupplierDashboard';
import { InstitutionDashboard } from './pages/InstitutionDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { FertilizerAdminPage } from './pages/FertilizerAdminPage';
import { MachineryAdminPage } from './pages/MachineryAdminPage';
import { SeedAdminPage } from './pages/SeedAdminPage';
import { HowItWorks } from './components/landing/HowItWorks';
import { Farm } from './types';
import { VoiceRegistrationAgent } from './components/voice/VoiceRegistrationAgent';

const MainContent: React.FC = () => {
  const { user, loading, activeView, setActiveView } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [registerFarmOpen, setRegisterFarmOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5EF]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#103B2D] border-t-transparent" />
          <p className="text-xs font-semibold text-[#103B2D]">Connecting to AgriTrust AI...</p>
        </div>
      </div>
    );
  }

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleFarmRegistered = (_farm: Farm) => {
    setActiveView('farmer_dashboard');
  };

  // Helper to render strictly role-authorized view
  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <PublicHome onOpenAuth={handleOpenAuth} />;

      case 'how_it_works':
        return (
          <div className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
              <button
                onClick={() => setActiveView(user ? (user.role === 'admin' ? 'admin_dashboard' : 'farmer_dashboard') : 'landing')}
                className="text-xs font-semibold text-[#2E7D32] hover:underline"
              >
                &larr; Back to Dashboard / Home
              </button>
            </div>
            <HowItWorks />
          </div>
        );

      // STRICT ADMIN VIEW: Normal users CANNOT access
      case 'admin_dashboard':
        if (!user || user.role !== 'admin') {
          return (
            <AccessDenied
              requiredRole="admin"
              currentRole={user?.role}
              targetViewName="Platform Administrator Portal"
              onReturn={() => {
                if (!user) {
                  handleOpenAuth('login');
                } else if (user.role === 'farmer') {
                  setActiveView('farmer_dashboard');
                } else if (user.role === 'supplier') {
                  setActiveView('supplier_dashboard');
                } else if (user.role === 'financial_institution') {
                  setActiveView('institution_dashboard');
                } else {
                  setActiveView('landing');
                }
              }}
            />
          );
        }
        return <AdminDashboard />;

      // STRICT FARMER VIEW: Admins CANNOT access farmer private accounts, nor can other roles
      case 'farmer_dashboard':
        if (!user || (user.role !== 'farmer' && user.role !== 'field_agent')) {
          return (
            <AccessDenied
              requiredRole="farmer"
              currentRole={user?.role}
              targetViewName="Smallholder Farmer Dashboard"
              onReturn={() => {
                if (!user) {
                  handleOpenAuth('login');
                } else if (user.role === 'admin') {
                  setActiveView('admin_dashboard');
                } else if (user.role === 'supplier') {
                  setActiveView('supplier_dashboard');
                } else if (user.role === 'financial_institution') {
                  setActiveView('institution_dashboard');
                } else {
                  setActiveView('landing');
                }
              }}
            />
          );
        }
        return (
          <FarmerDashboard
            onOpenOnboarding={() => setOnboardingOpen(true)}
            onOpenRegisterFarm={() => setRegisterFarmOpen(true)}
          />
        );

      // STRICT SUPPLIER VIEW: Admins or farmers CANNOT access
      case 'supplier_dashboard':
        if (!user || user.role !== 'supplier') {
          return (
            <AccessDenied
              requiredRole="supplier"
              currentRole={user?.role}
              targetViewName="Agro Supplier Fulfillment Portal"
              onReturn={() => {
                if (!user) {
                  handleOpenAuth('login');
                } else if (user.role === 'admin') {
                  setActiveView('admin_dashboard');
                } else {
                  setActiveView('farmer_dashboard');
                }
              }}
            />
          );
        }
        return <SupplierDashboard />;

      // STRICT FINANCIAL INSTITUTION VIEW: Admins or farmers CANNOT access
      case 'institution_dashboard':
        if (!user || user.role !== 'financial_institution') {
          return (
            <AccessDenied
              requiredRole="financial_institution"
              currentRole={user?.role}
              targetViewName="Bank Underwriting & Escrow Portal"
              onReturn={() => {
                if (!user) {
                  handleOpenAuth('login');
                } else if (user.role === 'admin') {
                  setActiveView('admin_dashboard');
                } else {
                  setActiveView('farmer_dashboard');
                }
              }}
            />
          );
        }
        return <InstitutionDashboard />;

      // STRICT FERTILIZER ADMIN VIEW
      case 'fertilizer_admin':
        if (!user || (!['fertilizer_dealer', 'supplier', 'admin'].includes(user.role))) {
          return (
            <AccessDenied
              requiredRole="fertilizer_dealer"
              currentRole={user?.role}
              targetViewName="Fertilizers Administration Portal"
              onReturn={() => {
                if (!user) {
                  handleOpenAuth('login');
                } else if (user.role === 'admin') {
                  setActiveView('admin_dashboard');
                } else {
                  setActiveView('farmer_dashboard');
                }
              }}
            />
          );
        }
        return <FertilizerAdminPage />;

      // STRICT MACHINERY FLEET ADMIN VIEW
      case 'machinery_admin':
        if (!user || (!['equipment_provider', 'admin'].includes(user.role))) {
          return (
            <AccessDenied
              requiredRole="equipment_provider"
              currentRole={user?.role}
              targetViewName="Machinery & Tractor Fleet Administration"
              onReturn={() => {
                if (!user) {
                  handleOpenAuth('login');
                } else if (user.role === 'admin') {
                  setActiveView('admin_dashboard');
                } else {
                  setActiveView('farmer_dashboard');
                }
              }}
            />
          );
        }
        return <MachineryAdminPage />;

      // STRICT SEED DEALS ADMIN VIEW
      case 'seed_admin':
        if (!user || (!['seed_dealer', 'supplier', 'admin'].includes(user.role))) {
          return (
            <AccessDenied
              requiredRole="seed_dealer"
              currentRole={user?.role}
              targetViewName="Certified Seed Deals Administration"
              onReturn={() => {
                if (!user) {
                  handleOpenAuth('login');
                } else if (user.role === 'admin') {
                  setActiveView('admin_dashboard');
                } else {
                  setActiveView('farmer_dashboard');
                }
              }}
            />
          );
        }
        return <SeedAdminPage />;

      // MARKETPLACE: Accessible to authenticated farmers & suppliers (not admin)
      case 'marketplace':
        if (user?.role === 'admin') {
          return (
            <AccessDenied
              requiredRole="farmer or supplier"
              currentRole="admin"
              targetViewName="Commercial Input Marketplace"
              onReturn={() => setActiveView('admin_dashboard')}
            />
          );
        }
        return <MarketplacePage />;

      // FINANCING: Accessible to authenticated farmers & bank officers (not admin)
      case 'financing':
        if (user?.role === 'admin') {
          return (
            <AccessDenied
              requiredRole="farmer or financial_institution"
              currentRole="admin"
              targetViewName="Agricultural Loan & Financing Gateway"
              onReturn={() => setActiveView('admin_dashboard')}
            />
          );
        }
        return <FinancingPage />;

      // EQUIPMENT: Accessible to authenticated farmers & equipment providers (not admin)
      case 'equipment':
        if (user?.role === 'admin') {
          return (
            <AccessDenied
              requiredRole="farmer or equipment_provider"
              currentRole="admin"
              targetViewName="Mechanization & Tractor Fleet"
              onReturn={() => setActiveView('admin_dashboard')}
            />
          );
        }
        return <EquipmentPage />;

      // AI ADVISORY: Accessible to farmers & field agents
      case 'ai_advisory':
        if (user?.role === 'admin') {
          return (
            <AccessDenied
              requiredRole="farmer"
              currentRole="admin"
              targetViewName="Gemini AI Crop Pathology Advisory"
              onReturn={() => setActiveView('admin_dashboard')}
            />
          );
        }
        return <AiAssistantPage />;

      case 'voice_registration':
        return (
          <div className="py-8 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] bg-gradient-to-b from-[#060D10] via-[#0A171D] to-[#04080A]">
            <div className="mb-4 flex items-center justify-between w-full max-w-2xl px-2">
              <button
                type="button"
                onClick={() => setActiveView(user ? (user.role === 'admin' ? 'admin_dashboard' : 'farmer_dashboard') : 'landing')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                &larr; Return to Dashboard
              </button>
            </div>
            <VoiceRegistrationAgent
              onComplete={() => setActiveView('farmer_dashboard')}
            />
          </div>
        );

      default:
        return <PublicHome onOpenAuth={handleOpenAuth} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5EF] text-[#171C19]">
      <Navbar onOpenAuth={handleOpenAuth} />

      <main className="flex-1">
        {renderActiveView()}
      </main>

      <Footer />

      {/* Confidential Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* 9-Step Progressive Farmer Onboarding Modal */}
      <FarmerOnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onCompleted={() => setActiveView('farmer_dashboard')}
      />

      {/* Register Farm Modal */}
      <RegisterFarmModal
        isOpen={registerFarmOpen}
        onClose={() => setRegisterFarmOpen(false)}
        onFarmRegistered={handleFarmRegistered}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
