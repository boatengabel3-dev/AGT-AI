import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { X, Check, ArrowRight, ArrowLeft, ShieldCheck, MapPin, FileText, CheckCircle2 } from 'lucide-react';

interface FarmerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export const FarmerOnboardingModal: React.FC<FarmerOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleted,
}) => {
  const { user, farmerProfile, updateProfile, refreshMe } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State for 9 steps
  const [formData, setFormData] = useState({
    // Step 1: Personal Profile
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    ghanaCardNumber: farmerProfile?.ghanaCardNumber || '',
    farmingExperienceYears: farmerProfile?.farmingExperienceYears || 5,

    // Step 2 & 3: Farm Registration & Mapping
    farmName: 'Nyame Nhyira Plot',
    region: 'Bono Region',
    district: 'Sunyani Municipal',
    community: 'Fiapre North',
    reportedAreaAcres: 8.5,
    centerLat: 7.3486,
    centerLng: -2.3342,

    // Step 4: Crop Information
    primaryCrops: 'Maize, Soybean',
    plantingSeason: 'Major Season 2026',
    soilType: 'Ferric Acrisol Loam',
    irrigationType: 'rainfed',

    // Step 5: Agricultural Resource Requirements
    resourceNeeds: 'NPK Fertilizer (50kg bags), Certified Foundation Hybrid Seeds, Tractor Disc Ploughing',

    // Step 6: Cooperative Information
    cooperativeName: 'Sunyani Farmers Cooperative Union',
    cooperativeMembershipId: 'SFCU-2023-144',

    // Step 7: Relevant Documents
    idDocumentName: 'Ghana_Card_Front_Back.pdf',
    tenancyAgreementName: 'Chief_Land_Allocation_Lease.pdf',

    // Step 8: Data-Sharing Preferences
    shareWithBanks: true,
    shareWithSuppliers: true,
    shareWithFieldAgents: true,
  });

  if (!isOpen) return null;

  const totalSteps = 9;

  const handleNext = async () => {
    setError(null);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Step 9: Final submission
      setSaving(true);
      try {
        // 1. Update farmer profile
        await updateProfile({
          fullName: formData.fullName,
          phone: formData.phone,
          region: formData.region,
          district: formData.district,
          community: formData.community,
          ghanaCardNumber: formData.ghanaCardNumber,
          farmingExperienceYears: Number(formData.farmingExperienceYears),
          primaryCrops: formData.primaryCrops.split(',').map((s) => s.trim()),
          cooperativeName: formData.cooperativeName,
          cooperativeMembershipId: formData.cooperativeMembershipId,
          profileCompleteness: 95,
        });

        // 2. Register farm
        const farmRes = await api.registerFarm({
          farmName: formData.farmName,
          region: formData.region,
          district: formData.district,
          community: formData.community,
          reportedAreaAcres: Number(formData.reportedAreaAcres),
          cropType: formData.primaryCrops.split(',')[0]?.trim() || 'Maize',
          secondaryCrops: formData.primaryCrops.split(',').slice(1).map((s) => s.trim()),
          plantingSeason: formData.plantingSeason,
          soilType: formData.soilType,
          irrigationType: formData.irrigationType,
          centerCoordinates: { lat: formData.centerLat, lng: formData.centerLng },
        });

        const { syncFarmToFirestore } = await import('../../services/firebase');
        await syncFarmToFirestore(farmRes.farm);

        // 3. Update data consent
        await api.updateDataConsent({
          shareWithBanks: formData.shareWithBanks,
          shareWithSuppliers: formData.shareWithSuppliers,
          shareWithFieldAgents: formData.shareWithFieldAgents,
        });

        await refreshMe();
        if (onCompleted) onCompleted();
        onClose();
      } catch (err: any) {
        setError(err.message || 'Submission failed. Please check your data.');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#F7F5EF] p-6 shadow-2xl border border-[#E5E0D5] max-h-[90vh] flex flex-col">
        {/* Header with Step indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32]">
              Farmer Onboarding Wizard · Step {step} of {totalSteps}
            </div>
            <h3 className="font-display text-lg font-bold text-[#103B2D]">
              {step === 1 && '1. Personal Profile Creation'}
              {step === 2 && '2. Farm Registration Details'}
              {step === 3 && '3. GPS Farm Location & Perimeter Mapping'}
              {step === 4 && '4. Crop & Agro-Ecological Information'}
              {step === 5 && '5. Agricultural Resource Requirements'}
              {step === 6 && '6. Farmer Cooperative Affiliation'}
              {step === 7 && '7. Supporting Document Uploads'}
              {step === 8 && '8. Data-Sharing & Privacy Preferences'}
              {step === 9 && '9. Profile Review & Final Submission'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#E5E0D5] h-1.5 rounded-full my-4 overflow-hidden">
          <div
            className="bg-[#2E7D32] h-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-2.5 text-xs text-red-800 border border-red-200">
            {error}
          </div>
        )}

        {/* Wizard Body (Scrollable) */}
        <div className="overflow-y-auto flex-1 pr-1 py-2 text-xs space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Establish your digital agricultural identity. This information will link to your farm parcels and financing requests.
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ghana Card (National ID)</label>
                  <input
                    type="text"
                    value={formData.ghanaCardNumber}
                    onChange={(e) => setFormData({ ...formData, ghanaCardNumber: e.target.value })}
                    placeholder="GHA-000000000-0"
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Years of Farming Experience</label>
                <input
                  type="number"
                  value={formData.farmingExperienceYears}
                  onChange={(e) => setFormData({ ...formData, farmingExperienceYears: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Register your primary farming parcel in Ghana. You can register multiple parcels later.
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Farm / Parcel Name</label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="e.g. Asuofia Golden Acre"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                  >
                    <option value="Bono Region">Bono Region</option>
                    <option value="Ashanti Region">Ashanti Region</option>
                    <option value="Ahafo Region">Ahafo Region</option>
                    <option value="Eastern Region">Eastern Region</option>
                    <option value="Northern Region">Northern Region</option>
                    <option value="Volta Region">Volta Region</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Community / Village</label>
                  <input
                    type="text"
                    value={formData.community}
                    onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reported Farm Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.reportedAreaAcres}
                  onChange={(e) => setFormData({ ...formData, reportedAreaAcres: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900 font-mono"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-slate-600">
                GPS perimeter mapping provides verified ground evidence required by participating banks and insurers.
              </p>
              <div className="rounded-xl border border-[#CBD5E1] bg-emerald-950/5 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#103B2D]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#2E7D32]" />
                    Central Coordinate Reference (WGS84)
                  </span>
                  <span className="text-[11px] text-slate-500">Auto-detected via GPS</span>
                </div>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.centerLat}
                      onChange={(e) => setFormData({ ...formData, centerLat: Number(e.target.value) })}
                      className="w-full rounded border border-[#CBD5E1] bg-white p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.centerLng}
                      onChange={(e) => setFormData({ ...formData, centerLng: Number(e.target.value) })}
                      className="w-full rounded border border-[#CBD5E1] bg-white p-2 text-xs"
                    />
                  </div>
                </div>
                <div className="rounded bg-white p-2.5 text-[11px] text-slate-600 border border-[#E5E0D5]">
                  <div className="font-semibold text-[#103B2D] mb-1">Field Verification Notice:</div>
                  AgriTrust field agents will synchronize boundary polygon vertices during on-site ground-truth visit.
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-slate-600">Provide crop cycle details to calculate input requirements and loan repayment schedules.</p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Crops Grown (comma-separated)</label>
                <input
                  type="text"
                  value={formData.primaryCrops}
                  onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
                  placeholder="e.g. Maize, Soybean, Cassava"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Planting Season</label>
                  <input
                    type="text"
                    value={formData.plantingSeason}
                    onChange={(e) => setFormData({ ...formData, plantingSeason: e.target.value })}
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Irrigation System</label>
                  <select
                    value={formData.irrigationType}
                    onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                  >
                    <option value="rainfed">Rainfed (Seasonal)</option>
                    <option value="drip">Drip Irrigation</option>
                    <option value="borehole">Borehole / Pump</option>
                    <option value="river_canal">River / Canal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <p className="text-slate-600">Tell us what agricultural resources you need for the upcoming farming season.</p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resource &amp; Input Requirements</label>
                <textarea
                  rows={3}
                  value={formData.resourceNeeds}
                  onChange={(e) => setFormData({ ...formData, resourceNeeds: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <p className="text-slate-600">Cooperative membership significantly speeds up bank loan underwriting and group input discounts.</p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cooperative or Farmer Association Name</label>
                <input
                  type="text"
                  value={formData.cooperativeName}
                  onChange={(e) => setFormData({ ...formData, cooperativeName: e.target.value })}
                  placeholder="e.g. Sunyani Farmers Cooperative Union"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Membership ID / Reference</label>
                <input
                  type="text"
                  value={formData.cooperativeMembershipId}
                  onChange={(e) => setFormData({ ...formData, cooperativeMembershipId: e.target.value })}
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                />
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-3">
              <p className="text-slate-600">Upload or attach supporting documentation for bank and field agent verification.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-dashed border-[#CBD5E1] rounded-xl p-3 bg-white text-center">
                  <FileText className="h-6 w-6 text-[#2E7D32] mx-auto mb-1" />
                  <div className="font-semibold text-slate-800">Ghana Card ID</div>
                  <div className="text-[10px] text-emerald-700 font-mono mt-1">{formData.idDocumentName}</div>
                </div>
                <div className="border border-dashed border-[#CBD5E1] rounded-xl p-3 bg-white text-center">
                  <FileText className="h-6 w-6 text-[#2E7D32] mx-auto mb-1" />
                  <div className="font-semibold text-slate-800">Land Lease / Agreement</div>
                  <div className="text-[10px] text-emerald-700 font-mono mt-1">{formData.tenancyAgreementName}</div>
                </div>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Data Sovereignty &amp; Privacy: Control exactly who can view your agricultural records under Ghana Act 843.
              </p>
              <div className="space-y-2">
                <label className="flex items-start gap-2 p-2.5 rounded-lg border border-[#CBD5E1] bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shareWithBanks}
                    onChange={(e) => setFormData({ ...formData, shareWithBanks: e.target.checked })}
                    className="mt-0.5 rounded text-[#2E7D32] focus:ring-[#2E7D32]"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">Share with Licensed Financial Institutions</span>
                    <p className="text-[11px] text-slate-500">Allows partner banks (like ADB) to evaluate your loan applications.</p>
                  </div>
                </label>
                <label className="flex items-start gap-2 p-2.5 rounded-lg border border-[#CBD5E1] bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shareWithSuppliers}
                    onChange={(e) => setFormData({ ...formData, shareWithSuppliers: e.target.checked })}
                    className="mt-0.5 rounded text-[#2E7D32] focus:ring-[#2E7D32]"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">Share with Verified Agro-Suppliers</span>
                    <p className="text-[11px] text-slate-500">Enables fulfillment coordinators to deliver seeds and fertilizers to your hub.</p>
                  </div>
                </label>
                <label className="flex items-start gap-2 p-2.5 rounded-lg border border-[#CBD5E1] bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.shareWithFieldAgents}
                    onChange={(e) => setFormData({ ...formData, shareWithFieldAgents: e.target.checked })}
                    className="mt-0.5 rounded text-[#2E7D32] focus:ring-[#2E7D32]"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">Share with Field Verification Agents</span>
                    <p className="text-[11px] text-slate-500">Permits on-site ground-truth survey and soil recording.</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-[#CBD5E1] bg-white p-4 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Farmer Name:</span>
                  <span className="font-semibold text-slate-900">{formData.fullName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Registered Farm:</span>
                  <span className="font-semibold text-slate-900">{formData.farmName} ({formData.reportedAreaAcres} Acres)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-900">{formData.community}, {formData.region}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Primary Crops:</span>
                  <span className="font-semibold text-slate-900">{formData.primaryCrops}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Cooperative:</span>
                  <span className="font-semibold text-slate-900">{formData.cooperativeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Profile Completeness:</span>
                  <span className="font-semibold text-emerald-700">95% (Pending Field Agent Visit)</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Note: A complete profile is distinct from verified status. Verification will be scheduled with an AgriTrust field officer upon submission.
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D5] mt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || saving}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-[#103B2D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#185340] transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : step === totalSteps ? 'Confirm & Submit' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
