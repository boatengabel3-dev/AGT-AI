import React from 'react';
import { UserPlus, MapPin, Compass, FileCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Register Profile',
      desc: 'Set up your digital agricultural profile with identity credentials, cooperative affiliations, and farming history.',
      icon: UserPlus,
    },
    {
      num: '02',
      title: 'Verify Farm',
      desc: 'Map your parcel boundaries. An AgriTrust field officer validates the GPS polygon, soil characteristics, and crop standing.',
      icon: MapPin,
    },
    {
      num: '03',
      title: 'Explore Resources',
      desc: 'Discover MoFA-certified fertilizers, foundation seeds, licensed bank credit products, and on-demand tractor services.',
      icon: Compass,
    },
    {
      num: '04',
      title: 'Apply or Purchase',
      desc: 'Submit a seasonal credit application directly to participating banks or order inputs for regional depot pickup.',
      icon: FileCheck,
    },
    {
      num: '05',
      title: 'Track Progress',
      desc: 'Monitor delivery dispatch, loan committee assessments, and machinery arrivals in real-time through your dashboard.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20 bg-[#F7F5EF] border-b border-[#E5E0D5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-2">
            Seamless Agricultural Workflow
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#103B2D] tracking-tight text-balance">
            How AgriTrust AI Works for African Farmers
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            From single-registration onboarding to verified harvesting, follow five structured steps to cultivate agricultural success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-[#E5E0D5] bg-white p-5 flex flex-col justify-between shadow-sm hover:border-[#2E7D32] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#103B2D] px-2 py-0.5 rounded">
                      {s.num}
                    </span>
                    <div className="p-2 rounded-lg bg-emerald-50 text-[#2E7D32]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="font-display text-sm font-bold text-[#103B2D] mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
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
