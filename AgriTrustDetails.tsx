import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Coins,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react';

export const AgriTrustDetails: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#F7F5EF] text-[#171C19] border-b border-[#E5E0D5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill & Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] border border-[#D5CEBF] text-xs font-bold text-[#103B2D] uppercase tracking-wider mb-3">
            <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
            Detailed Platform Information
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#103B2D] tracking-tight">
            What is AgriTrust AI?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-700 leading-relaxed">
            West Africa&apos;s sovereign Agricultural Intelligence &amp; Trust Protocol—engineered specifically to overcome the structural financing, input, and mechanization bottlenecks of African agriculture.
          </p>
        </div>

        {/* 4 Key Pillars of AgriTrust AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="rounded-2xl bg-white p-6 border border-[#E5E0D5] shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#2E7D32] mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#103B2D] mb-1">
              AI Agronomic Trust Score
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Replaces unattainable land deeds with satellite NDVI vegetative indexes, GPS polygon boundaries, and cooperative harvest histories to generate an actuarial credit score for commercial lenders.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-[#E5E0D5] shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-4">
              <Coins className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#103B2D] mb-1">
              Milestone Escrow Protocol
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminates cash diversion by converting loan capital into closed-loop digital vouchers redeemable exclusively at MoFA-approved input dealers (AfriAgro) and tractor providers (Volta).
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-[#E5E0D5] shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#103B2D] mb-1">
              Gemini Multimodal Vision
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empowers farmers and field agents to photograph leaf or stalk anomalies to instantly diagnose Fall Armyworm, Cocoa Black Pod, or Blight with certified agronomic remedy protocols.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-[#E5E0D5] shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mb-4">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#103B2D] mb-1">
              Multi-Stakeholder Tripartite
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Harmonizes operations between the Agricultural Development Bank (ADB), input manufacturers, tractor fleet owners, field verification officers, and smallholder cooperatives.
            </p>
          </div>
        </div>

        {/* The African Problem vs. AgriTrust AI Innovation Split */}
        <div className="rounded-3xl bg-[#103B2D] text-white p-8 sm:p-12 mb-16 shadow-xl border border-[#D4AF37]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* The Structural Bottlenecks (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4" />
                The Systemic Market Failure
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold leading-snug">
                Why 82% of African Farmers Were Excluded From Finance
              </h3>
              <p className="text-sm text-[#F7F5EF]/80 leading-relaxed">
                In Ghana and West Africa, communal stool lands cannot be pledged as conventional banking collateral. Commercial banks suffered double-digit default rates due to late input delivery, counterfeit agrochemicals, and unmonitored cash diversion.
              </p>
              
              <ul className="space-y-2.5 pt-2 text-xs text-[#F7F5EF]/90">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span><strong>Zero Paper Collateral:</strong> Smallholders cultivate family lands without individual cadastral deeds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span><strong>Spurious Inputs:</strong> 35% of street chemicals are adulterated, triggering massive crop failures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span><strong>Manual Verification Deficit:</strong> 1 extension agent serves over 1,500 dispersed rural farms.</span>
                </li>
              </ul>
            </div>

            {/* The AgriTrust AI Architectural Solution (7 cols) */}
            <div className="lg:col-span-7 bg-[#0B2A20] rounded-2xl p-6 sm:p-8 border border-[#D4AF37]/20 shadow-inner space-y-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                <Award className="h-4 w-4" />
                The AgriTrust AI Sovereign Blueprint
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#103B2D]/80 border border-white/10">
                  <div className="text-xs font-bold text-[#D4AF37] mb-1">01. GPS Polygon Identity</div>
                  <p className="text-xs text-[#F7F5EF]/80">
                    Field agents walk parcel boundaries with mobile GNSS, establishing verified plot coordinates and land tenure clearance.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#103B2D]/80 border border-white/10">
                  <div className="text-xs font-bold text-[#D4AF37] mb-1">02. Sentinel-2 Satellite Sync</div>
                  <p className="text-xs text-[#F7F5EF]/80">
                    Calculates bi-weekly NDVI biomass indices, rainfall anomalies, and vegetative growth without costly field visits.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#103B2D]/80 border border-white/10">
                  <div className="text-xs font-bold text-[#D4AF37] mb-1">03. Certified Input Escrow</div>
                  <p className="text-xs text-[#F7F5EF]/80">
                    Disburses loan funds directly to AfriAgro via tamper-proof vouchers upon physical QR scan and batch validation.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#103B2D]/80 border border-white/10">
                  <div className="text-xs font-bold text-[#D4AF37] mb-1">04. 75+ HP Tractor Dispatch</div>
                  <p className="text-xs text-[#F7F5EF]/80">
                    Routes Volta Mechanised Services tractors through contiguous plots, slashing per-acre fuel and turnaround times.
                  </p>
                </div>
              </div>

              {/* Bank of Ghana & MoFA Compliance Note */}
              <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#F7F5EF] flex items-center justify-between gap-4">
                <span className="font-medium text-[11px] sm:text-xs">
                  Institutional Alignment: Underwritten in partnership with ADB Ghana, MoFA, and GIRSAL risk guarantees.
                </span>
                <span className="text-[#D4AF37] font-bold text-[11px] shrink-0 font-mono">
                  98.2% RECOVERY
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Live Operational Metrics of AgriTrust AI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#E5E0D5] text-center shadow-xs">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#103B2D]">14,820+</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Farm Parcels Mapped</div>
            <div className="text-[11px] text-slate-500 mt-0.5">GPS verified across 16 Ghanaian regions</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E0D5] text-center shadow-xs">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#2E7D32]">GH₵ 18.4M</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Collateral-Free Credit</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Disbursed through closed-loop escrow</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E0D5] text-center shadow-xs">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#D4AF37]">98.2%</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">Loan Recovery Rate</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Industry benchmark in West Africa</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E0D5] text-center shadow-xs">
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#103B2D]">100%</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">MoFA Certified Inputs</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero counterfeit chemical tolerance</div>
          </div>
        </div>

      </div>
    </section>
  );
};
