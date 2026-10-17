import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Handshake } from 'lucide-react';

export const PartnerCTA: React.FC = () => {
  const [partnerType, setPartnerType] = useState('financial_institution');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-[#103B2D] text-[#F7F5EF]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              <Handshake className="h-4 w-4" />
              <span>Institutional Partnerships</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
              Partner With AgriTrust AI
            </h2>
            <p className="text-sm text-[#F7F5EF]/80 leading-relaxed">
              We invite licensed commercial banks, rural banks, MoFA-registered agro-chemical manufacturers, mechanisation hubs, and agricultural cooperatives across Ghana to integrate into our digital ecosystem.
            </p>

            <div className="space-y-3 pt-2 text-xs text-[#F7F5EF]/85">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Zero integration fee during pilot deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>Strict adherence to Ghana Data Protection Act (Act 843)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>API integration pathways for core banking and ERP software</span>
              </div>
            </div>
          </div>

          {/* Right Partnership Enquiry Form */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md p-6 sm:p-8">
              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-[#103B2D] mx-auto font-bold">
                    ✓
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">Partnership Enquiry Received</h3>
                  <p className="text-xs text-[#F7F5EF]/80 max-w-md mx-auto">
                    Thank you for your interest in AgriTrust AI. Our institutional partnerships team in Accra will contact you within 2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <h3 className="font-display text-base font-bold text-white mb-2">
                    Submit Partnership Enquiry
                  </h3>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#F7F5EF]/80 mb-1">
                      Organization Type
                    </label>
                    <select
                      value={partnerType}
                      onChange={(e) => setPartnerType(e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-[#0B2A20] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="financial_institution">Licensed Commercial / Rural Bank</option>
                      <option value="microfinance">Microfinance / Credit Union</option>
                      <option value="supplier">Certified Agricultural Input Manufacturer / Dealer</option>
                      <option value="mechanisation">Tractor &amp; Machinery Center</option>
                      <option value="cooperative">Farmer Cooperative Union</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#F7F5EF]/80 mb-1">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        placeholder="e.g. Apex Rural Bank"
                        className="w-full rounded-lg border border-white/20 bg-[#0B2A20] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#F7F5EF]/80 mb-1">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="e.g. Kwame Ofori"
                        className="w-full rounded-lg border border-white/20 bg-[#0B2A20] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#F7F5EF]/80 mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. kwame@bank.gh"
                        className="w-full rounded-lg border border-white/20 bg-[#0B2A20] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#F7F5EF]/80 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+233 24 000 0000"
                        className="w-full rounded-lg border border-white/20 bg-[#0B2A20] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 rounded-lg bg-[#D4AF37] text-[#103B2D] py-2.5 text-xs font-bold hover:bg-[#e0bb42] transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Submit Institutional Enquiry</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
