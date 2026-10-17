import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onExplore }) => {
  const { user, setActiveView } = useAuth();

  return (
    <section className="relative overflow-hidden bg-[#103B2D] text-[#F7F5EF] pt-12 pb-20 lg:pt-16 lg:pb-24">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#103B2D] via-[#103B2D]/90 to-transparent z-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Proposition & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-wider uppercase">
              <span>African Agricultural Finance &amp; Mechanisation Platform</span>
              <span aria-hidden="true">&middot;</span>
              <span>Ghana Pilot</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Grow More. Access More. Achieve More.
            </h1>

            <p className="text-base sm:text-lg text-[#F7F5EF]/85 max-w-2xl leading-relaxed">
              AgriTrust AI connects African farmers to agricultural financing, verified suppliers, essential farming inputs, and equipment providers through one intelligent platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-[#103B2D] bg-[#D4AF37] hover:bg-[#e2bd44] rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 whitespace-nowrap min-h-[48px]"
              >
                <span>Get Started as a Farmer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onExplore}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/10 rounded-xl transition-all whitespace-nowrap min-h-[48px] text-center"
              >
                Explore AgriTrust AI
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/15 text-xs text-[#F7F5EF]/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Licensed Bank Underwriting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>MoFA Certified Seeds &amp; NPK</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>GPS Field Boundary Polygon</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Visual Asset (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] lg:aspect-auto lg:h-[460px]">
              <img
                src="/src/assets/images/hero_african_farmer_1791938387615.jpg"
                alt="African farmer with field tablet in flourishing maize farm at golden hour"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#103B2D]/80 via-transparent to-transparent pointer-events-none" />

              {/* Verified Digital Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 backdrop-blur-md p-3.5 text-[#171C19] border border-white/40 shadow-lg">
                <div className="flex items-center justify-between text-xs font-bold text-[#103B2D] mb-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
                    Verified Farmer Profile
                  </span>
                  <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    GPS Validated
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  Kwame Mensah &middot; Sunyani Municipal &middot; 18.5 Acres Maize &amp; Soy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column KPI Strip below hero split */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0B2A20] border border-white/10 text-[#F7F5EF]">
          <div>
            <div className="text-2xl font-bold font-mono text-[#D4AF37]">100%</div>
            <div className="text-xs text-[#F7F5EF]/70 mt-0.5">GPS Perimeter Verified Plots</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#D4AF37]">3 Models</div>
            <div className="text-xs text-[#F7F5EF]/70 mt-0.5">Direct, Loan &amp; Flexible Access</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#D4AF37]">75+ HP</div>
            <div className="text-xs text-[#F7F5EF]/70 mt-0.5">Tractor &amp; Implement Fleet</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#D4AF37]">MoFA</div>
            <div className="text-xs text-[#F7F5EF]/70 mt-0.5">Certified Agro-Input Standards</div>
          </div>
        </div>
      </div>
    </section>
  );
};
