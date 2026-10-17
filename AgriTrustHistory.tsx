import React from 'react';
import {
  History,
  Calendar,
  Milestone,
  CheckCircle2,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const AgriTrustHistory: React.FC = () => {
  const milestones = [
    {
      year: '2023',
      phase: 'Inception & Field Research',
      location: 'Accra & Sunyani (Bono Region)',
      headline: 'Uncovering the Real Driver of Smallholder Loan Defaults',
      narrative:
        'AgriTrust AI was conceived following an in-depth empirical field study conducted across rural farming communities in Sunyani, Dormaa, and Techiman. Agronomists, rural economists, and software engineers found that over 82% of commercial bank loan defaults were not caused by farmer misconduct, but by three systemic failures: delayed input distribution past the rainy window, rampant counterfeit pesticides in open markets, and exorbitant manual tractor rental costs.',
      breakthroughs: [
        'Discovery that biometric and polygon GPS plot records could substitute for cadastral land titles',
        'Drafting of the Closed-Loop Input Escrow architecture with rural cooperative leaders',
        'Initial algorithm for satellite NDVI biomass verification calibrated against historical Ghanaian maize harvests',
      ],
      badge: 'Genesis & Discovery',
    },
    {
      year: '2024',
      phase: 'Phase I Pilot: Project Asase',
      location: 'Bono, Ahafo & Eastern Regions',
      headline: 'Proving Satellite-Verified Credit with 1,200 Smallholders',
      narrative:
        'The AgriTrust AI protocol was deployed for its first live agricultural season with 1,200 smallholder farmers cultivating maize, soybeans, and cocoa. Field verification officers used mobile GNSS tools to walk and map farm boundaries, while Sentinel-2 satellite imagery provided automated bi-weekly vegetative vigor scoring.',
      breakthroughs: [
        '100% boundary dispute resolution across 3,400 contiguous acres in Sunyani Municipal',
        'Demonstrated that satellite-monitored farms achieved a 28% higher yield due to timed input scheduling',
        'Zero cash diversion recorded through early voucher testing with accredited cooperative input stores',
      ],
      badge: 'Field Validation',
    },
    {
      year: '2025',
      phase: 'Institutional Consortium Launch',
      location: 'National Integration Across Ghana',
      headline: 'Forming the Tripartite Banking & Supply Chain Alliance',
      narrative:
        'AgriTrust AI transitioned from regional pilot to commercial banking reality through formal institutional agreements. The Agricultural Development Bank (ADB Ghana) underwrote agricultural credit lines directly through the platform. AfriAgro Inputs Ltd connected its warehouses to fulfill verified chemical vouchers, and Volta Mechanised Services deployed 75+ HP tractors for cluster plowing.',
      breakthroughs: [
        'Over GH₵ 18,450,000 disbursed in non-collateralized input financing across 14,800+ farm parcels',
        'Achieved a landmark 98.2% loan recovery rate, shattering the historical 18-24% agricultural default rate in West Africa',
        'Received official recognition and regulatory alignment with MoFA and GIRSAL risk-sharing guidelines',
      ],
      badge: 'Commercial Scale',
    },
    {
      year: '2026',
      phase: 'Multimodal AI Vision & Pan-African Expansion',
      location: 'All 16 Regions of Ghana & Regional Export',
      headline: 'Autonomous Crop Pathology with Google Gemini Multimodal AI',
      narrative:
        'To overcome Ghana’s severe extension officer deficit (1:1,500), AgriTrust AI integrated Google Gemini 3.8 Flash Vision. Farmers and field officers can now photograph crop foliage and receive immediate, scientifically grounded identification of Fall Armyworm, Cocoa Black Pod, and Blight, with exact MoFA-certified treatment regimens and instant marketplace procurement.',
      breakthroughs: [
        'Gemini Vision diagnostics deployed with sub-second response times and local agronomic ground-truth data',
        'Integration of Google Maps Grounding to locate nearby certified agro-input dealers and ADB branches',
        'Expansion to all 16 Ghanaian regions with multi-language advisory in Twi, Ga, and English',
      ],
      badge: 'Current Era',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F7F5EF] text-[#171C19] border-b border-[#E5E0D5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] border border-[#D5CEBF] text-xs font-bold text-[#103B2D] uppercase tracking-wider mb-3">
            <History className="h-4 w-4 text-[#2E7D32]" />
            Chronological Evolution
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#103B2D] tracking-tight">
            The History of AgriTrust AI
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-700 leading-relaxed">
            From rural research in the Bono Region to West Africa&apos;s most advanced agricultural trust and multimodal AI protocol.
          </p>
        </div>

        {/* Milestone Timeline Cards */}
        <div className="relative border-l-2 border-[#D4AF37]/40 ml-4 sm:ml-8 md:ml-32 space-y-12">
          {milestones.map((m, index) => (
            <div key={m.year} className="relative pl-6 sm:pl-8">
              
              {/* Timeline Dot & Year Stamp */}
              <div className="absolute -left-[17px] top-1.5 h-8 w-8 rounded-full bg-[#103B2D] border-4 border-[#D4AF37] flex items-center justify-center text-white shadow-md">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>

              {/* Year Label (on left for wide screens) */}
              <div className="hidden md:block absolute -left-32 top-2 text-right w-24">
                <span className="font-mono text-2xl font-black text-[#103B2D]">{m.year}</span>
                <span className="block text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider">
                  {m.badge}
                </span>
              </div>

              {/* Card Container */}
              <div className="rounded-2xl bg-white border border-[#E5E0D5] p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">
                
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="md:hidden font-mono text-lg font-bold text-[#103B2D] bg-[#EAE5D9] px-2 py-0.5 rounded">
                      {m.year}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
                      {m.phase}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {m.location}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#103B2D] mb-3 leading-snug">
                  {m.headline}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-5">
                  {m.narrative}
                </p>

                {/* Key Breakthroughs */}
                <div className="rounded-xl bg-[#FDFBF7] border border-[#EAE5D9] p-4">
                  <div className="text-xs font-bold text-[#103B2D] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Milestone className="h-4 w-4 text-[#D4AF37]" />
                    Key Milestones &amp; Historic Breakthroughs:
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {m.breakthroughs.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
