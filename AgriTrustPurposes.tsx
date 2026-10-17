import React from 'react';
import {
  Target,
  Landmark,
  PackageCheck,
  Tractor,
  Bot,
  Database,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const AgriTrustPurposes: React.FC = () => {
  const purposes = [
    {
      number: '01',
      title: 'Alternative Credit Scoring & Agricultural De-Risking',
      tagline: 'Unlocking commercial credit without land title deeds',
      icon: Landmark,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      accent: 'border-l-4 border-l-[#2E7D32]',
      description:
        'In Ghana and throughout Africa, over 90% of rural land is governed by customary communal tenure without registered deeds. AgriTrust AI synthesizes satellite NDVI biomass data, historical harvest metrics, rainfall indexes, and local cooperative standing into an actuarial AI Agronomic Trust Score.',
      keyOutcomes: [
        'Enables institutions like Agricultural Development Bank (ADB) to underwrite smallholders with confidence',
        'Cuts loan evaluation time from 6 weeks of manual bureaucracy down to under 4 minutes',
        'Maintains a 98.2% seasonal repayment rate across more than 14,800 mapped farm plots',
      ],
      institutionalRole: 'Primary Beneficiary: Commercial Banks, MFIs & Smallholder Farmers',
    },
    {
      number: '02',
      title: 'Closed-Loop Input Quality & Anti-Counterfeit Escrow',
      tagline: 'Ensuring 100% of financing reaches the soil as genuine inputs',
      icon: PackageCheck,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      accent: 'border-l-4 border-l-[#D4AF37]',
      description:
        'A critical market failure in African agriculture is the diversion of cash loans for emergency domestic expenses and the prevalence of spurious, diluted agrochemicals in open markets. AgriTrust AI replaces cash disbursement with digital input vouchers that can solely be redeemed at certified agro-dealers.',
      keyOutcomes: [
        'Guarantees all distributed seeds, NPK fertilizers, and bio-pesticides are MoFA- and EPA-certified',
        'Direct digital settlement with AfriAgro Inputs Ltd upon physical farmer QR verification at collection points',
        'Zero cash leakage ensures that every cedi borrowed directly boosts crop yield and seasonal revenue',
      ],
      institutionalRole: 'Primary Beneficiary: AfriAgro Inputs Ltd, Agro-Chemical Dealers & Cooperatives',
    },
    {
      number: '03',
      title: 'Mechanization-as-a-Service (MaaS) Optimization',
      tagline: 'Democratizing 75+ HP tractors for 1- to 5-acre smallholder plots',
      icon: Tractor,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      accent: 'border-l-4 border-l-blue-600',
      description:
        'Most African smallholder farmers are trapped in labor-intensive hand-hoe cultivation because commercial tractors refuse to plow scattered 2-acre plots. AgriTrust AI clusters adjoining verified farm boundaries into contiguous mechanized zones, routing heavy equipment efficiently.',
      keyOutcomes: [
        'Pairs smallholders with Volta Mechanised Services 75+ HP John Deere tractor fleet on transparent per-acre pricing',
        'Reduces land preparation time from 14 days of grueling manual labor down to 2 hours of precision plowing',
        'Guaranteed escrow payout to tractor owners upon GPS confirmation that the field perimeter was plowed',
      ],
      institutionalRole: 'Primary Beneficiary: Volta Mechanised Services, Tractor Operators & Farmers',
    },
    {
      number: '04',
      title: 'Autonomous Multimodal AI Vision & Extension Diagnostics',
      tagline: 'Instant crop pest & disease detection powered by Google Gemini',
      icon: Bot,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      accent: 'border-l-4 border-l-purple-600',
      description:
        'With an extension officer ratio of only 1 agent per 1,500 farmers in Ghana, crop diseases like Fall Armyworm, Cocoa Black Pod, Cassava Mosaic, and Early Blight frequently wipe out entire community yields before an expert arrives. AgriTrust AI embeds Gemini 3.8 Flash Multimodal Vision directly in farmers hands.',
      keyOutcomes: [
        'Farmers photograph leaf lesions, stems, or pest larvae and receive instant agronomic diagnosis',
        'Provides step-by-step MoFA-approved chemical and biological treatment protocols and dosage rates',
        'Direct one-click connection to certified remedies available in the AgriTrust input marketplace',
      ],
      institutionalRole: 'Primary Beneficiary: Extension Agents, Agronomists & Rural Communities',
    },
    {
      number: '05',
      title: 'Sovereign Smallholder Data Sovereignty & Governance',
      tagline: 'Farmers own their identity, yields, and verified credit profile',
      icon: Database,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      accent: 'border-l-4 border-l-teal-600',
      description:
        'Too often, digital agricultural initiatives extract African farmer data into foreign centralized databases without farmer consent or direct economic return. AgriTrust AI establishes a sovereign digital identity where farmers control who can view their GPS parcel boundaries and credit scores.',
      keyOutcomes: [
        'Farmers grant explicit cryptographic consent before banks or input dealers can view their agronomic history',
        'Tamper-proof audit logging ensures complete regulatory oversight by the Ministry of Food & Agriculture and Bank of Ghana',
        'Portable credit identity allows farmers to build cumulative credit equity year-over-year',
      ],
      institutionalRole: 'Primary Beneficiary: Platform Administrators, GIRSAL & Farmer Cooperatives',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white text-[#171C19] border-b border-[#E5E0D5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] border border-[#D5CEBF] text-xs font-bold text-[#103B2D] uppercase tracking-wider mb-3">
            <Target className="h-4 w-4 text-[#D4AF37]" />
            Foundational Missions
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#103B2D] tracking-tight">
            The Strategic Purposes of AgriTrust AI
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-700 leading-relaxed">
            Every layer of the AgriTrust AI protocol is purpose-built to solve a specific structural impediment in the African agricultural value chain.
          </p>
        </div>

        {/* Detailed Purpose Cards */}
        <div className="space-y-6">
          {purposes.map((purpose) => {
            const IconComp = purpose.icon;

            return (
              <div
                key={purpose.number}
                className={`rounded-2xl border border-[#E5E0D5] bg-[#FDFBF7] p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow ${purpose.accent}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Number, Title, Tagline & Institutional Tag (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#103B2D] text-[#D4AF37]">
                        PURPOSE {purpose.number}
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${purpose.color}`}>
                        {purpose.institutionalRole.split(':')[0]}
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#103B2D] leading-snug">
                      {purpose.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-semibold text-[#2E7D32]">
                      {purpose.tagline}
                    </p>

                    <div className="pt-2 text-[11px] text-slate-500 font-mono">
                      {purpose.institutionalRole}
                    </div>
                  </div>

                  {/* Right Column: Detailed Narrative & 3 Key Outcomes (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {purpose.description}
                    </p>

                    <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] space-y-2.5 shadow-2xs">
                      <div className="text-xs font-bold text-[#103B2D] uppercase tracking-wider">
                        Key Measurable Outcomes:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {purpose.keyOutcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#2E7D32] shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
