import React from 'react';
import { UserCheck, Building2, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AudiencePillars: React.FC = () => {
  const { setActiveView } = useAuth();

  return (
    <section className="py-20 bg-white border-b border-[#E5E0D5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-2">
            Built for African Agriculture
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#103B2D] tracking-tight text-balance">
            Designed for Every Stakeholder Across the Value Chain
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Farmers */}
          <div className="rounded-2xl border border-[#E5E0D5] bg-[#F7F5EF] p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37]">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#103B2D]">
              For Farmers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Register your land once to create an unforgeable digital farming profile. Access licensed bank financing without predatory middlemen, buy certified seeds and fertilizers, and schedule mechanised tractors straight to your fields.
            </p>
          </div>

          {/* For Financial Institutions */}
          <div className="rounded-2xl border border-[#E5E0D5] bg-[#F7F5EF] p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37]">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#103B2D]">
              For Financial Institutions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              De-risk agricultural lending with GPS-verified farm boundaries, validated crop varieties, cooperative endorsements, and explainable risk summaries. Eliminate manual field inspection costs while expanding your loan book safely.
            </p>
          </div>

          {/* For Agro-Suppliers */}
          <div className="rounded-2xl border border-[#E5E0D5] bg-[#F7F5EF] p-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37]">
              <Store className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#103B2D]">
              For Agro-Suppliers &amp; Dealers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with thousands of verified commercial farmers. Receive pre-approved seasonal input orders backed by bank financing and track inventory distribution across regional supply depots with zero collection risk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
