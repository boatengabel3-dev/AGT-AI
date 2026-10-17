import React from 'react';
import { Sprout, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useAuth();

  return (
    <footer className="border-t border-[#E5E0D5] bg-[#103B2D] text-[#F7F5EF] pt-14 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2A4D3F]">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2E7D32] text-[#D4AF37]">
                <Sprout className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                AgriTrust <span className="text-[#D4AF37]">AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#F7F5EF]/75">
              Empowering African farmers with digital farm verification, licensed bank financing, certified crop inputs, and mechanised tractor rentals.
            </p>
            <div className="pt-1 text-xs text-[#D4AF37] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>MoFA &amp; Data Protection Compliant (Act 843)</span>
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-3">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs text-[#F7F5EF]/80">
              <li>
                <button onClick={() => setActiveView('financing')} className="hover:text-white transition-colors">
                  Agricultural Financing &amp; Loans
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('marketplace')} className="hover:text-white transition-colors">
                  Certified Seeds &amp; Fertilizers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('equipment')} className="hover:text-white transition-colors">
                  Tractor &amp; Machinery Rentals
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('ai_advisory')} className="hover:text-white transition-colors">
                  AgriTrust AI Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Ecosystem Partners */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-3">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-[#F7F5EF]/80">
              <li>
                <span className="text-[#F7F5EF]/60">Licensed Financial Institutions</span>
              </li>
              <li>
                <span className="text-[#F7F5EF]/60">MoFA Registered Agro-Dealers</span>
              </li>
              <li>
                <span className="text-[#F7F5EF]/60">Mechanisation Service Centers</span>
              </li>
              <li>
                <span className="text-[#F7F5EF]/60">Farmer Cooperatives &amp; Unions</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-3">
              Regional Operations
            </h4>
            <div className="space-y-2 text-xs text-[#F7F5EF]/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Agricultural Hub, Sunyani &amp; Accra Operational Center, Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span className="font-mono-numbers">+233 (0) 30 221 0980</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>support@agritrust.gh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F7F5EF]/60">
          <div>
            &copy; {new Date().getFullYear()} AgriTrust AI Ltd. All rights reserved. Initial launch market: Ghana.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Notice</span>
            <span>&middot;</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>&middot;</span>
            <span className="hover:text-white cursor-pointer">Regulatory Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
