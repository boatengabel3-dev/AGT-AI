import React from 'react';
import { AlertCircle, Ban, Tractor, FileQuestion } from 'lucide-react';

export const AccessChallenge: React.FC = () => {
  const challenges = [
    {
      title: 'The Agricultural Credit Gap',
      description:
        'Over 85% of African smallholders lack formal collateral, audited statements, or digital credit records, leaving them excluded from conventional banking finance.',
      icon: Ban,
    },
    {
      title: 'Counterfeit & Substandard Inputs',
      description:
        'Unverified agro-dealers frequently circulate adulterated seeds and watered-down chemicals, leading to catastrophic yield losses for hardworking farming families.',
      icon: AlertCircle,
    },
    {
      title: 'Mechanisation Bottlenecks',
      description:
        'Renting a tractor or plough in rural districts often requires weeks of manual searching, uncertain pricing, and frequent machine breakdowns during critical planting windows.',
      icon: Tractor,
    },
    {
      title: 'Information & Farm Boundary Asymmetry',
      description:
        'Lenders and insurers struggle to verify farm sizes, historical crop performance, or real flood/drought risks without costly ground-truth inspections.',
      icon: FileQuestion,
    },
  ];

  return (
    <section className="py-20 bg-[#F7F5EF] border-b border-[#E5E0D5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-2">
            The Agricultural Access Challenge
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#103B2D] tracking-tight text-balance">
            Why African Farming Stalls at the Financing &amp; Supply Threshold
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Despite cultivating the continent&apos;s food supply, small and medium commercial farmers face systemic barriers when acquiring seasonal inputs, modern machinery, and licensed working capital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm hover:border-[#2E7D32]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#2E7D32] mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-[#103B2D] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
