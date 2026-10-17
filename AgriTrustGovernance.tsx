import React, { useState } from 'react';
import {
  Building2,
  Landmark,
  PackageCheck,
  Tractor,
  ShieldCheck,
  Lock,
  ChevronDown,
  HelpCircle,
  FileCheck2,
  Award,
} from 'lucide-react';

export const AgriTrustGovernance: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const partners = [
    {
      name: 'Agricultural Development Bank (ADB Ghana)',
      role: 'Commercial Lending & Underwriting Partner',
      badge: 'Licensed Bank',
      icon: Landmark,
      description:
        'Provides institutional capital and seasonal credit facilities underwritten by AgriTrust AI’s satellite and cooperative Trust Scores.',
    },
    {
      name: 'AfriAgro Inputs Ltd',
      role: 'Certified Agricultural Inputs Consortium',
      badge: 'MoFA Certified',
      icon: PackageCheck,
      description:
        'Guarantees 100% genuine certified seeds, NPK fertilizers, and bio-pesticides with batch traceability and escrow redemption.',
    },
    {
      name: 'Volta Mechanised Services',
      role: 'Mechanization Fleet & Tractor Provider',
      badge: '75+ HP Fleet',
      icon: Tractor,
      description:
        'Dispatches modern tractor implements across mapped plot clusters for timely plowing, harrowing, and harvesting.',
    },
    {
      name: 'Ministry of Food & Agriculture (MoFA)',
      role: 'Regulatory & Agronomic Standards Agency',
      badge: 'Public Regulatory',
      icon: Building2,
      description:
        'Certifies agro-chemical guidelines, extension agent training standards, and national plant protection protocols.',
    },
  ];

  const faqs = [
    {
      question: 'How does AgriTrust AI evaluate creditworthiness without traditional land title deeds?',
      answer:
        'Over 90% of communal agricultural land in West Africa lacks individual title deeds. AgriTrust AI overcomes this by generating an actuarial Agronomic Trust Score that analyzes 3 years of Sentinel-2 satellite NDVI vegetative growth, GPS polygon parcel boundaries, soil moisture indexes, and verified cooperative yield histories. Commercial banks like ADB Ghana use this verifiable productivity score in place of physical land deeds.',
    },
    {
      question: 'Why does AgriTrust AI disburse digital vouchers instead of physical cash?',
      answer:
        'Empirical research in 2023 proved that cash loans frequently suffer diversion for family emergencies, while farmers are left to buy adulterated, cheap chemicals from open markets that destroy crop yields. AgriTrust AI utilizes a closed-loop escrow protocol: loan funds are converted into cryptographic vouchers redeemable exclusively at accredited dealers like AfriAgro Inputs Ltd, ensuring 100% of the loan translates into real farm inputs.',
    },
    {
      question: 'How does the Gemini Multimodal AI Vision feature diagnose pests in remote rural fields?',
      answer:
        'Using Google Gemini 3.8 Flash Vision, the AgriTrust AI scanner inspects leaf lesions, stem borers, and pest larvae in uploaded photographs. It compares visual symptoms against calibrated Ghanaian plant pathology datasets for Fall Armyworm, Cocoa Black Pod, Cassava Mosaic, and Early Blight, immediately outputting MoFA-approved chemical dosages, biological treatments, and safety guidelines.',
    },
    {
      question: 'Who owns the smallholder farmer’s data and biometric identity?',
      answer:
        'AgriTrust AI enforces complete African Data Sovereignty. Farmers own their sovereign digital records. No third-party bank, seed company, or government agency can view farm coordinates, harvest records, or credit scores without explicit cryptographic consent granted by the farmer through the platform.',
    },
    {
      question: 'How do tractor operators like Volta Mechanised Services get paid securely?',
      answer:
        'When a farmer books a tractor, the funds are held securely in the AgriTrust escrow account. Once the operator completes plowing and the GPS polygon confirms the acreage was cultivated, the platform instantly releases the funds directly to the operator’s mobile money or bank account, eliminating late payments.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white text-[#171C19]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Institutional Governance Section */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] border border-[#D5CEBF] text-xs font-bold text-[#103B2D] uppercase tracking-wider mb-3">
              <Award className="h-4 w-4 text-[#D4AF37]" />
              Institutional Ecosystem
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#103B2D] tracking-tight">
              Regulated Institutional Governance
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              AgriTrust AI operates under a formal tripartite governance pact with certified Ghanaian financial, agricultural, and mechanization institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner) => {
              const IconComponent = partner.icon;

              return (
                <div
                  key={partner.name}
                  className="rounded-2xl bg-[#FDFBF7] p-6 border border-[#E5E0D5] flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-[#103B2D] text-[#D4AF37] flex items-center justify-center">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#2E7D32] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {partner.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#103B2D] mb-1">
                      {partner.name}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#D4AF37] mb-2">
                      {partner.role}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exclusive AgriTrust AI FAQ Section */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-[#E5E0D5]">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] border border-[#D5CEBF] text-xs font-bold text-[#103B2D] uppercase tracking-wider mb-3">
              <HelpCircle className="h-4 w-4 text-[#2E7D32]" />
              AgriTrust AI Knowledge Base
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#103B2D]">
              Frequently Asked Questions About AgriTrust AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Authoritative answers regarding AgriTrust AI’s technology, escrow protocol, and agronomic scoring.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#E5E0D5] bg-[#FDFBF7] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#103B2D]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#2E7D32]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-[#E5E0D5]/50 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
