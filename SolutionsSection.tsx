import React from 'react';
import { ShoppingCart, Landmark, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SolutionsSection: React.FC = () => {
  const { setActiveView } = useAuth();

  return (
    <section className="py-20 bg-white border-b border-[#E5E0D5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] mb-2">
            Three Purchasing &amp; Financing Models
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#103B2D] tracking-tight text-balance">
            One Unified Architecture for Inputs, Credit &amp; Mechanisation
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            AgriTrust AI eliminates fragmented transactions by uniting direct input buying, licensed agricultural credit, and on-demand equipment bookings under a single verified digital farmer profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Model A: Direct Purchase */}
          <div className="rounded-2xl border border-[#E5E0D5] bg-[#F7F5EF] p-7 flex flex-col justify-between hover:border-[#2E7D32] transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37]">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded">
                  Model A
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#103B2D] mb-2">
                Direct Purchase
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Browse verified agro-dealers, buy certified foundation seeds, MoFA-approved fertilizers, and drip irrigation kits with guaranteed authentic supply chains and regional hub delivery.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 border-t border-[#E5E0D5] pt-3">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>Certified foundation seeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>Transparent wholesale pricing</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>Sunyani &amp; Kumasi depot pickup</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveView('marketplace')}
              className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-[#103B2D] text-white text-xs font-semibold hover:bg-[#185340] transition-colors"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Model B: Loan Financing */}
          <div className="rounded-2xl border-2 border-[#103B2D] bg-white p-7 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3 right-6 bg-[#D4AF37] text-[#103B2D] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              Featured Solution
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37]">
                  <Landmark className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#103B2D] bg-amber-50 px-2 py-0.5 rounded">
                  Model B
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#103B2D] mb-2">
                Licensed Loan Financing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Apply for seasonal crop input loans and working capital directly with licensed partner institutions (such as Agricultural Development Bank - ADB) utilizing your verified farm polygon and crop profile.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 border-t border-slate-100 pt-3">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>GHS 2,000 to GHS 25,000 credit limits</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>Transparent 18.5% seasonal rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>Repayment synchronized with harvest</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveView('financing')}
              className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#256629] transition-colors"
            >
              <span>View Financing Products</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Model C: Flexible Resource Access */}
          <div className="rounded-2xl border border-[#E5E0D5] bg-[#F7F5EF] p-7 flex flex-col justify-between hover:border-[#2E7D32] transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37]">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded">
                  Model C
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#103B2D] mb-2">
                Flexible Resource Access
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Schedule tractors, disk ploughs, seed drills, and harvesters from mechanisation service providers. Pay per acre with experienced machine operators included.
              </p>
              <ul className="text-xs text-slate-700 space-y-2 border-t border-[#E5E0D5] pt-3">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>John Deere &amp; Massey Ferguson tractors</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>From GHS 140 per acre (ploughing)</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
                  <span>Guaranteed dispatch dates</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveView('equipment')}
              className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-[#103B2D] text-white text-xs font-semibold hover:bg-[#185340] transition-colors"
            >
              <span>Book Farm Machinery</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
