import React, { useState } from 'react';
import { api } from '../services/api';
import { X, MapPin, ArrowRight, Mic, FileText } from 'lucide-react';
import { Farm } from '../types';
import { VoiceRegistrationAgent, VoiceRegistrationData } from '../components/voice/VoiceRegistrationAgent';

interface RegisterFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFarmRegistered: (farm: Farm) => void;
}

export const RegisterFarmModal: React.FC<RegisterFarmModalProps> = ({
  isOpen,
  onClose,
  onFarmRegistered,
}) => {
  const [registrationMode, setRegistrationMode] = useState<'form' | 'voice'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    farmName: '',
    region: 'Bono Region',
    district: 'Sunyani Municipal',
    community: '',
    reportedAreaAcres: 5.0,
    cropType: 'Yellow Maize (Obatanpa)',
    plantingSeason: 'Major Season 2026',
    soilType: 'Loamy Ferric Acrisol',
    irrigationType: 'rainfed' as 'rainfed' | 'drip' | 'borehole' | 'river_canal',
    centerLat: 7.3486,
    centerLng: -2.3342,
  });

  if (!isOpen) return null;

  const handleVoiceCompleted = async (voiceData: VoiceRegistrationData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.registerFarm({
        farmName: `${voiceData.fullName ? voiceData.fullName.split(' ')[0] : 'Farmer'}'s Plot`,
        region: voiceData.region || 'Bono Region',
        district: voiceData.district || 'Sunyani Municipal',
        community: voiceData.community || 'Community Central',
        reportedAreaAcres: voiceData.farmSizeAcres || 5.0,
        cropType: voiceData.cropTypes[0] || 'Yellow Maize (Obatanpa)',
        plantingSeason: 'Major Season 2026',
        soilType: 'Loamy Ferric Acrisol',
        irrigationType: 'rainfed',
        centerCoordinates: {
          lat: 7.3486,
          lng: -2.3342,
        },
      });

      // Sync to Cloud Firestore
      const { syncFarmToFirestore } = await import('../services/firebase');
      await syncFarmToFirestore(res.farm);

      onFarmRegistered(res.farm);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save voice-registered farm');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.registerFarm({
        farmName: formData.farmName,
        region: formData.region,
        district: formData.district,
        community: formData.community || 'District Central',
        reportedAreaAcres: Number(formData.reportedAreaAcres),
        cropType: formData.cropType,
        plantingSeason: formData.plantingSeason,
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        centerCoordinates: {
          lat: Number(formData.centerLat),
          lng: Number(formData.centerLng),
        },
      });

      // Sync to Cloud Firestore
      const { syncFarmToFirestore } = await import('../services/firebase');
      await syncFarmToFirestore(res.farm);

      onFarmRegistered(res.farm);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register farm parcel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className={`relative w-full ${registrationMode === 'voice' ? 'max-w-2xl' : 'max-w-lg'} rounded-2xl bg-[#F7F5EF] p-5 sm:p-6 shadow-2xl border border-[#E5E0D5] my-auto`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37]">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#103B2D]">
              Register New Farm Parcel
            </h3>
            <p className="text-xs text-slate-500">
              Establish geospatial perimeter data for bank underwriting
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-200/80 p-1 mb-5">
          <button
            type="button"
            onClick={() => setRegistrationMode('form')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              registrationMode === 'form'
                ? 'bg-white text-[#103B2D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-[#2E7D32]" />
            <span>Manual Entry Form</span>
          </button>
          <button
            type="button"
            onClick={() => setRegistrationMode('voice')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              registrationMode === 'voice'
                ? 'bg-[#103B2D] text-[#D4AF37] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Voice Registration Agent</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-2.5 text-xs text-red-800 border border-red-200">
            {error}
          </div>
        )}

        {registrationMode === 'voice' ? (
          <div className="space-y-3">
            <VoiceRegistrationAgent
              onComplete={handleVoiceCompleted}
              onCancel={() => setRegistrationMode('form')}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
            <label className="font-semibold text-slate-700 block mb-1">Farm / Parcel Name</label>
            <input
              type="text"
              required
              value={formData.farmName}
              onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
              placeholder="e.g. Asuofia Golden Acre"
              className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900 focus:border-[#2E7D32] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="font-semibold text-slate-700 block mb-1">Community / Village</label>
              <input
                type="text"
                required
                value={formData.community}
                onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                placeholder="e.g. Fiapre"
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reported Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.reportedAreaAcres}
                onChange={(e) => setFormData({ ...formData, reportedAreaAcres: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Crop</label>
              <input
                type="text"
                required
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                placeholder="e.g. Maize (Obatanpa)"
                className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div className="rounded-xl border border-[#CBD5E1] bg-white p-3 space-y-2">
            <div className="font-semibold text-[#103B2D] flex items-center justify-between">
              <span>GPS Center Point (WGS84)</span>
              <span className="text-[10px] text-slate-400">Decimal Degrees</span>
            </div>
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.centerLat}
                  onChange={(e) => setFormData({ ...formData, centerLat: Number(e.target.value) })}
                  className="w-full rounded border border-slate-200 p-1.5"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.centerLng}
                  onChange={(e) => setFormData({ ...formData, centerLng: Number(e.target.value) })}
                  className="w-full rounded border border-slate-200 p-1.5"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-[#103B2D] py-2.5 font-bold text-white hover:bg-[#185340] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? 'Registering Parcel...' : 'Save & Queue for Field Agent Verification'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        )}
      </div>
    </div>
  );
};
