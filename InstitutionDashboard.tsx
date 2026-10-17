import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoanApplication, Farm } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  Eye,
  Plus,
  Edit2,
  Trash2,
  Percent,
  Layers,
  X,
  Check,
} from 'lucide-react';
import { FinancingProduct } from '../types';

export const InstitutionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'manage_loans'>('applications');
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [financingProducts, setFinancingProducts] = useState<FinancingProduct[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [decisionError, setDecisionError] = useState<string | null>(null);

  // Loan product add/edit modal state
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<FinancingProduct | null>(null);
  const [loanForm, setLoanForm] = useState({
    title: '',
    financingPurpose: '',
    minAmountGHS: '2000',
    maxAmountGHS: '25000',
    annualInterestRatePercent: '18.5',
    tenureMonthsMin: '4',
    tenureMonthsMax: '9',
    gracePeriodMonths: '3',
    eligibleCrops: 'Maize, Soybean, Rice, Sorghum',
    eligibilityCriteria: 'Minimum 1 season documented farming record, GPS-verified farm parcel',
  });
  const [loanActionMessage, setLoanActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsData, farmsData, finData] = await Promise.all([
        api.getLoanApplications(),
        api.getFarms(),
        api.getFinancingProducts(),
      ]);
      setApplications(appsData);
      setFarms(farmsData);
      setFinancingProducts(finData);
      if (appsData.length > 0) {
        setSelectedApp(appsData[0]);
      }
    } catch (err) {
      console.error('Failed to load institution data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openAddLoanModal = () => {
    setEditingLoan(null);
    setLoanForm({
      title: '',
      financingPurpose: 'Seasonal crop input credit for certified seed, fertilizer, and mechanization.',
      minAmountGHS: '2000',
      maxAmountGHS: '30000',
      annualInterestRatePercent: '17.5',
      tenureMonthsMin: '4',
      tenureMonthsMax: '10',
      gracePeriodMonths: '3',
      eligibleCrops: 'Maize, Soybean, Rice, Cassava',
      eligibilityCriteria: 'AgriTrust verified GPS parcel, Cooperative endorsement',
    });
    setLoanModalOpen(true);
    setLoanActionMessage(null);
  };

  const openEditLoanModal = (prod: FinancingProduct) => {
    setEditingLoan(prod);
    setLoanForm({
      title: prod.title,
      financingPurpose: prod.financingPurpose,
      minAmountGHS: String(prod.minAmountGHS),
      maxAmountGHS: String(prod.maxAmountGHS),
      annualInterestRatePercent: String(prod.annualInterestRatePercent),
      tenureMonthsMin: String(prod.tenureMonthsMin),
      tenureMonthsMax: String(prod.tenureMonthsMax),
      gracePeriodMonths: String(prod.gracePeriodMonths),
      eligibleCrops: prod.eligibleCrops.join(', '),
      eligibilityCriteria: prod.eligibilityCriteria.join(', '),
    });
    setLoanModalOpen(true);
    setLoanActionMessage(null);
  };

  const handleSaveLoanProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setLoanActionMessage(null);

    try {
      const payload = {
        title: loanForm.title,
        financingPurpose: loanForm.financingPurpose,
        minAmountGHS: Number(loanForm.minAmountGHS),
        maxAmountGHS: Number(loanForm.maxAmountGHS),
        annualInterestRatePercent: Number(loanForm.annualInterestRatePercent),
        tenureMonthsMin: Number(loanForm.tenureMonthsMin),
        tenureMonthsMax: Number(loanForm.tenureMonthsMax),
        gracePeriodMonths: Number(loanForm.gracePeriodMonths),
        eligibleCrops: loanForm.eligibleCrops.split(',').map((s) => s.trim()),
        eligibilityCriteria: loanForm.eligibilityCriteria.split(',').map((s) => s.trim()),
        requiredDocuments: ['Ghana Card', 'Verified Farm GPS Polygon', 'Cooperative Endorsement'],
        processingFeePercent: 1.5,
      };

      if (editingLoan) {
        await api.updateFinancingProduct(editingLoan.id, payload);
        setLoanActionMessage(`Financing program "${loanForm.title}" updated in web app!`);
      } else {
        await api.createFinancingProduct(payload);
        setLoanActionMessage(`New financing program "${loanForm.title}" published for farmers!`);
      }

      setLoanModalOpen(false);
      await loadData();
    } catch (err: any) {
      setDecisionError(err.message || 'Failed to save financing program');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteLoanProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the web app?`)) return;
    try {
      await api.deleteFinancingProduct(id);
      setLoanActionMessage(`Financing program "${title}" removed.`);
      await loadData();
    } catch (err: any) {
      setDecisionError(err.message || 'Failed to delete financing program');
    }
  };

  const handleDecision = async (status: 'approved' | 'declined' | 'additional_info_requested') => {
    if (!selectedApp) return;
    setUpdating(true);
    setDecisionError(null);
    try {
      const res = await api.updateLoanDecision(selectedApp.id, {
        status,
        note: decisionNote || `Decision recorded by loan officer ${user?.fullName}`,
        approvedAmountGHS: status === 'approved' ? selectedApp.requestedAmountGHS : undefined,
      });

      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? res.application : a))
      );
      setSelectedApp(res.application);
      setDecisionNote('');
    } catch (err: any) {
      setDecisionError(err.message || 'Failed to update decision');
    } finally {
      setUpdating(false);
    }
  };

  const associatedFarm = selectedApp ? farms.find((f) => f.id === selectedApp.associatedFarmId) : null;

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-16">
      {/* Top Banner */}
      <div className="bg-[#103B2D] text-[#F7F5EF] py-10 border-b border-[#2A4D3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E7D32] text-[#D4AF37]">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Licensed Financial Institution Underwriting
                </div>
                <h1 className="font-display text-2xl font-bold text-white">
                  Agricultural Development Bank (ADB)
                </h1>
                <p className="text-xs text-[#F7F5EF]/80">
                  Agribusiness Credit Risk &amp; Smallholder Input Financing Desk
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-2 border border-white/15 text-xs text-right">
              <div className="text-[10px] text-white/60">Underwriter Portal</div>
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Authorized Institutional Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Loan Action Feedback Alert */}
        {loanActionMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{loanActionMessage}</span>
            </div>
            <button onClick={() => setLoanActionMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-3 -mb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'applications'
                  ? 'border-[#2E7D32] text-[#103B2D]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Review &amp; Underwrite Applications ({applications.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('manage_loans')}
              className={`pb-3 -mb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'manage_loans'
                  ? 'border-[#2E7D32] text-[#103B2D]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Percent className="h-4 w-4" />
              <span>Update Web App Financing Products ({financingProducts.length})</span>
            </button>
          </div>

          {activeTab === 'manage_loans' && (
            <button
              onClick={openAddLoanModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Financing Program</span>
            </button>
          )}
        </div>

        {activeTab === 'applications' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Applications Queue (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-bold text-[#103B2D]">
                  Application Review Queue ({applications.length})
                </h3>
              </div>

              <div className="space-y-2.5">
                {applications.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      selectedApp?.id === app.id
                        ? 'border-[#103B2D] bg-[#F7F5EF] shadow-sm'
                        : 'border-[#E5E0D5] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-slate-900">{app.farmerName}</span>
                      <span className="font-mono text-xs font-bold text-[#103B2D]">
                        GHS {app.requestedAmountGHS.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {app.financingProductTitle} &middot; {app.associatedFarmName}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
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
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Application Detail & Decision Form (7 cols) */}
          <div className="lg:col-span-7">
            {selectedApp ? (
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#103B2D]">
                      Credit Assessment: {selectedApp.farmerName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Application ID: #{selectedApp.id} &middot; {selectedApp.financingProductTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xl font-bold text-[#103B2D]">
                      GHS {selectedApp.requestedAmountGHS.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-500">{selectedApp.proposedTenureMonths} Months Tenure</div>
                  </div>
                </div>

                {/* Farmer & Farm Risk Profile */}
                <div className="rounded-xl bg-[#F7F5EF] p-4 border border-[#E5E0D5] space-y-3 text-xs">
                  <div className="font-semibold text-[#103B2D] flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
                    <span>Ground-Truth Verification Summary</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 block">Associated Farm Parcel:</span>
                      <span className="font-semibold text-slate-900">{selectedApp.associatedFarmName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Crop Cycle:</span>
                      <span className="font-semibold text-slate-900">{selectedApp.cropCycle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Reported / Verified Area:</span>
                      <span className="font-semibold font-mono text-slate-900">
                        {associatedFarm ? `${associatedFarm.verifiedAreaAcres || associatedFarm.reportedAreaAcres} Acres` : '12 Acres (Verified)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">GPS Coordinates:</span>
                      <span className="font-mono text-slate-900">
                        {associatedFarm ? `${associatedFarm.centerCoordinates.lat.toFixed(4)}°N, ${associatedFarm.centerCoordinates.lng.toFixed(4)}°W` : '7.3486°N, 2.3342°W'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Intended Input Use:</span>
                    <p className="text-slate-800 leading-relaxed">{selectedApp.intendedActivity}</p>
                  </div>
                </div>

                {/* Status History Audit Trail */}
                <div>
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Application Audit History
                  </h4>
                  <div className="space-y-2">
                    {selectedApp.statusHistory.map((hist, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                          <span className="capitalize">{hist.status.replace(/_/g, ' ')}</span>
                          <span className="text-slate-400 font-mono">
                            {new Date(hist.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">{hist.note}</p>
                        <div className="text-[10px] text-slate-400 mt-0.5">Updated by: {hist.updatedBy}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision Recording Box */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  {decisionError && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                      {decisionError}
                    </div>
                  )}
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-700">
                    Record Institutional Underwriting Decision
                  </h4>

                  <textarea
                    rows={2}
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    placeholder="Enter credit committee underwriting notes or rationale..."
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-xs text-slate-900"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleDecision('approved')}
                      disabled={updating}
                      className="flex-1 py-2 rounded-lg bg-[#2E7D32] text-white text-xs font-semibold hover:bg-[#256629] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approve Facility</span>
                    </button>
                    <button
                      onClick={() => handleDecision('additional_info_requested')}
                      disabled={updating}
                      className="flex-1 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Clock className="h-4 w-4" />
                      <span>Request Details</span>
                    </button>
                    <button
                      onClick={() => handleDecision('declined')}
                      disabled={updating}
                      className="flex-1 py-2 rounded-lg bg-red-700 text-white text-xs font-semibold hover:bg-red-800 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-8 text-center text-xs text-slate-500">
                Select an application from the queue to view verification details.
              </div>
            )}
          </div>
        </div>
        ) : (
          /* Tab 2: Manage Web App Financing Products */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Update interest rates, maximum credit limits, and eligibility criteria published on the AgriTrust AI financing portal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {financingProducts.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl border border-[#E5E0D5] p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {prod.institutionName}
                      </span>
                      <span className="font-extrabold text-sm text-[#2E7D32]">
                        {prod.annualInterestRatePercent}% APR
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-[#103B2D] mb-1">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3">
                      {prod.financingPurpose}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Credit Range:</span>
                        <span className="font-bold text-slate-800">
                          GHS {prod.minAmountGHS.toLocaleString()} - {prod.maxAmountGHS.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Tenure Range:</span>
                        <span className="font-semibold text-slate-700">
                          {prod.tenureMonthsMin} - {prod.tenureMonthsMax} Months
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Grace Period:</span>
                        <span className="font-semibold text-slate-700">{prod.gracePeriodMonths} Months</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Eligible Crops:</span>
                        <span className="font-semibold text-emerald-800">{prod.eligibleCrops.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => openEditLoanModal(prod)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#2E7D32] hover:text-[#2E7D32] text-xs font-semibold text-slate-600 transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit Terms in Web App</span>
                    </button>
                    <button
                      onClick={() => handleDeleteLoanProduct(prod.id, prod.title)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-600 transition-colors"
                      title="Delete Financing Product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add or Edit Financing Product */}
      {loanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-display text-lg font-bold text-[#103B2D]">
                {editingLoan ? 'Update Financing Program in Web App' : 'Add New Financing Program to Web App'}
              </h3>
              <button onClick={() => setLoanModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLoanProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Credit Facility Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ADB Smallholder Seasonal Grain Credit"
                  value={loanForm.title}
                  onChange={(e) => setLoanForm({ ...loanForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Max Loan Ceiling (GHS)
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="25000"
                    value={loanForm.maxAmountGHS}
                    onChange={(e) => setLoanForm({ ...loanForm, maxAmountGHS: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="0"
                    placeholder="18.5"
                    value={loanForm.annualInterestRatePercent}
                    onChange={(e) => setLoanForm({ ...loanForm, annualInterestRatePercent: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Min Tenor (Mo)
                  </label>
                  <input
                    type="number"
                    value={loanForm.tenureMonthsMin}
                    onChange={(e) => setLoanForm({ ...loanForm, tenureMonthsMin: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Max Tenor (Mo)
                  </label>
                  <input
                    type="number"
                    value={loanForm.tenureMonthsMax}
                    onChange={(e) => setLoanForm({ ...loanForm, tenureMonthsMax: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Grace (Mo)
                  </label>
                  <input
                    type="number"
                    value={loanForm.gracePeriodMonths}
                    onChange={(e) => setLoanForm({ ...loanForm, gracePeriodMonths: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eligible Crops (comma separated)
                </label>
                <input
                  type="text"
                  value={loanForm.eligibleCrops}
                  onChange={(e) => setLoanForm({ ...loanForm, eligibleCrops: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Financing Purpose &amp; Disbursement Scope
                </label>
                <textarea
                  rows={2}
                  value={loanForm.financingPurpose}
                  onChange={(e) => setLoanForm({ ...loanForm, financingPurpose: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setLoanModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold transition-all disabled:opacity-60 shadow-sm"
                >
                  {updating ? 'Saving...' : editingLoan ? 'Save & Update Web App' : 'Publish to Web App'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
