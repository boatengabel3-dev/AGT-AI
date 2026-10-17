import React from 'react';
import { HomeAuthHero } from '../components/landing/HomeAuthHero';
import { AgriTrustDetails } from '../components/landing/AgriTrustDetails';
import { AgriTrustPurposes } from '../components/landing/AgriTrustPurposes';
import { AgriTrustHistory } from '../components/landing/AgriTrustHistory';
import { AgriTrustGovernance } from '../components/landing/AgriTrustGovernance';
import { useAuth } from '../context/AuthContext';

interface PublicHomeProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onOpenAuth }) => {
  const { user, setActiveView } = useAuth();

  return (
    <div className="flex flex-col bg-[#F7F5EF]">
      {/* 1. FIRST THING TO SHOW: Confidential Login and Sign-In Gateway as User or Admin */}
      <HomeAuthHero onOpenRegisterModal={() => onOpenAuth('register')} />

      {/* 2. Detailed Information ONLY about AgriTrust AI */}
      <AgriTrustDetails />

      {/* 3. Strategic Purposes ONLY of AgriTrust AI */}
      <AgriTrustPurposes />

      {/* 4. Complete History & Evolution ONLY of AgriTrust AI */}
      <AgriTrustHistory />

      {/* 5. Institutional Governance & Authoritative AgriTrust AI FAQ */}
      <AgriTrustGovernance />
    </div>
  );
};
