import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FinancingProduct, Farm, LoanApplication } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Percent,
  FileText,
  ArrowRight,
  X,
  Clock,
} from 'lucide-react';

export const FinancingPage: React.FC = () => {
  const { user, setActiveView } = useAuth();
  const [financingProducts, setFinancingProducts] = useState<FinancingProduct[]>([]);
  const [userFarms, setUserFarms] = useState<Farm[]>([]);
  const [myApplications, setMyApplications] = useState<LoanApplication[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<FinancingProduct | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successApp, setSuccessApp] = useState<LoanApplication | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Application form fields
  const [formFarmId, setFormFarmId] = useState('');
  const [formAmount, setFormAmount] = useState(5000);
  const [formTenureMonths, setFormTenureMonths] = useState(6);
  const [formActivity, setFormActivity] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodList, farmsList, appsList] = await Promise.all([
          api.getFinancingProducts(),
          api.getFarms(),
          api.getLoanApplications(),
        ]);
        setFinancingProducts(prodList);
        setUserFarms(farmsList);
        setMyApplications(appsList);
        if (farmsList.length > 0) {
          setFormFarmId(farmsList[0].id);
        }
      } catch (err) {
        console.error('Failed to load financing data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleOpenApply = (prod: FinancingProduct) => {
    if (!user) {
      setError('Please sign in with your confidential farmer account to apply for agricultural credit.');
      return;
    }
    setSelectedProduct(prod);
    setFormAmount(prod.minAmountGHS);
    setFormTenureMonths(prod.tenureMonthsMin);
    setFormActivity(`Purchase certified inputs and seed for upcoming planting season.`);
    setShowApplyModal(true);
    setSuccessApp(null);
    setError(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !formFarmId) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.submitLoanApplication({
        financingProductId: selectedProduct.id,
        requestedAmountGHS: Number(formAmount),
        proposedTenureMonths: Number(formTenureMonths),
        associatedFarmId: formFarmId,
        cropCycle: 'Major Season 2026',
        intendedActivity: formActivity,
      });

      // Sync to Cloud Firestore
      const { syncLoanToFirestore } = await import('../services/firebase');
      await syncLoanToFirestore(res.application);

      setSuccessApp(res.application);
      setMyApplications((prev) => [res.application, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to submit loan application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-20">
      {/* Page Header */}
      <div className="bg-[#103B2D] text-[#F7F5EF] py-12 border-b border-[#2A4D3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
            Model B &middot; Licensed Financial Institutions
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white">
            Agricultural Financing &amp; Input Credit
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#F7F5EF]/80 max-w-2xl leading-relaxed">
            Discover credit products published by participating commercial and rural banks in Ghana. AgriTrust AI transmits your verified farm geospatial perimeter directly to institutional loan underwriters.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Available Products Section */}
        <div>
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-[#103B2D]">
              Verified Institutional Credit Products
            </h2>
            <p className="text-xs text-slate-500">
              Rates and terms set directly by authorized participating banking partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {financingProducts.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border-2 border-[#E5E0D5] bg-white p-6 shadow-sm hover:border-[#103B2D] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-[#103B2D]">
                        <Landmark className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-500">{prod.institutionName}</div>
                        <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                          Licensed Bank Credit
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-base font-bold text-[#103B2D]">
                      {prod.annualInterestRatePercent}% p.a.
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#103B2D] mb-2">
                    {prod.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {prod.financingPurpose}
                  </p>

                  {/* Financial Terms Strip */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F7F5EF] text-center border border-[#E5E0D5] mb-4">
                    <div>
                      <div className="text-[10px] text-slate-500">Amount Limits</div>
                      <div className="font-mono text-xs font-bold text-[#103B2D]">
                        GHS {prod.minAmountGHS.toLocaleString()} - {prod.maxAmountGHS.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Tenure Range</div>
                      <div className="font-mono text-xs font-bold text-[#103B2D]">
                        {prod.tenureMonthsMin} - {prod.tenureMonthsMax} Months
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Grace Period</div>
                      <div className="font-mono text-xs font-bold text-[#103B2D]">
                        {prod.gracePeriodMonths} Months
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Criteria */}
                  <div className="space-y-1.5 text-xs text-slate-700 mb-4">
                    <div className="font-semibold text-slate-900 mb-1">Key Requirements:</div>
                    {prod.eligibilityCriteria.map((crit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenApply(prod)}
                  className="w-full py-2.5 rounded-lg bg-[#103B2D] text-white text-xs font-bold hover:bg-[#185340] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Apply for This Credit Facility</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Applications Tracking Section */}
        {myApplications.length > 0 && (
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-[#103B2D] mb-4">
              My Submitted Financing Applications
            </h2>
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-[#E5E0D5] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-[#103B2D]">
                        {app.financingProductTitle}
                      </span>
                      <span className="font-mono text-xs text-slate-400">#{app.id}</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Bank: {app.institutionName} &middot; Associated Farm: {app.associatedFarmName}
                    </div>
                    {app.statusHistory && app.statusHistory.length > 0 && (
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded mt-1 border border-slate-200">
                        <span className="font-semibold text-slate-700">Bank Note: </span>
                        {app.statusHistory[app.statusHistory.length - 1].note}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-[#103B2D]">
                        GHS {app.requestedAmountGHS.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">{app.proposedTenureMonths} months tenure</div>
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                        app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800'
                          : app.status === 'declined'
                          ? 'bg-red-50 text-red-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guided Loan Application Modal */}
      {showApplyModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#F7F5EF] p-6 shadow-2xl border border-[#E5E0D5]">
            <button
              onClick={() => {
                setShowApplyModal(false);
                setSuccessApp(null);
              }}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            {successApp ? (
              <div className="text-center py-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E7D32] text-white mx-auto font-bold">
                  ✓
                </div>
                <h3 className="font-display text-lg font-bold text-[#103B2D]">
                  Application Successfully Transmitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your credit file and verified farm GPS coordinates have been submitted to{' '}
                  <span className="font-semibold text-slate-900">{selectedProduct.institutionName}</span> for institutional underwriting.
                </p>
                <button
                  onClick={() => {
                    setShowApplyModal(false);
                    setSuccessApp(null);
                    setActiveView('farmer_dashboard');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#103B2D] text-white text-xs font-semibold"
                >
                  View in Dashboard
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-lg font-bold text-[#103B2D] mb-1">
                  Apply: {selectedProduct.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Underwritten by {selectedProduct.institutionName}
                </p>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-2.5 text-xs text-red-800 border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Select Associated Farm Parcel</label>
                    <select
                      value={formFarmId}
                      onChange={(e) => setFormFarmId(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                    >
                      {userFarms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.farmName} ({f.reportedAreaAcres} Acres, {f.cropType}) - {f.verificationStatus}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Requested Amount (GHS)
                      </label>
                      <input
                        type="number"
                        min={selectedProduct.minAmountGHS}
                        max={selectedProduct.maxAmountGHS}
                        step="500"
                        required
                        value={formAmount}
                        onChange={(e) => setFormAmount(Number(e.target.value))}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        Proposed Tenure (Months)
                      </label>
                      <input
                        type="number"
                        min={selectedProduct.tenureMonthsMin}
                        max={selectedProduct.tenureMonthsMax}
                        required
                        value={formTenureMonths}
                        onChange={(e) => setFormTenureMonths(Number(e.target.value))}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Intended Agricultural Activity &amp; Inputs
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formActivity}
                      onChange={(e) => setFormActivity(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                    />
                  </div>

                  <div className="rounded-xl bg-amber-50 p-3 text-[11px] text-amber-900 border border-amber-200">
                    <span className="font-bold">Institutional Transparency: </span>
                    AgriTrust AI transmits your application directly to {selectedProduct.institutionName}. Approvals are determined strictly by licensed bank credit committees following verification.
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-[#103B2D] py-2.5 text-xs font-bold text-white hover:bg-[#185340] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {submitting ? 'Transmitting to Bank...' : 'Submit Application to Underwriter'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
