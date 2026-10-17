import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EquipmentListing, Farm, EquipmentBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Tractor,
  Calendar,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  ArrowRight,
  X,
  Gauge,
  UserCheck,
} from 'lucide-react';

export const EquipmentPage: React.FC = () => {
  const { user, setActiveView } = useAuth();
  const [equipmentList, setEquipmentList] = useState<EquipmentListing[]>([]);
  const [userFarms, setUserFarms] = useState<Farm[]>([]);
  const [myBookings, setMyBookings] = useState<EquipmentBooking[]>([]);
  const [selectedEq, setSelectedEq] = useState<EquipmentListing | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<EquipmentBooking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Booking Form State
  const [farmId, setFarmId] = useState('');
  const [acres, setAcres] = useState(8);
  const [startDate, setStartDate] = useState('2026-03-01');

  useEffect(() => {
    async function loadData() {
      try {
        const [eqData, farmsData, bookingsData] = await Promise.all([
          api.getEquipmentListings(),
          api.getFarms(),
          api.getBookings(),
        ]);
        setEquipmentList(eqData);
        setUserFarms(farmsData);
        setMyBookings(bookingsData);
        if (farmsData.length > 0) {
          setFarmId(farmsData[0].id);
          setAcres(farmsData[0].reportedAreaAcres || 5);
        }
      } catch (err) {
        console.error('Failed to load equipment data:', err);
      }
    }
    loadData();
  }, [user]);

  const handleOpenBooking = (eq: EquipmentListing) => {
    if (!user) {
      setError('Please sign in to your confidential account to book agricultural equipment.');
      return;
    }
    setSelectedEq(eq);
    setShowBookingModal(true);
    setBookingSuccess(null);
    setError(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEq || !farmId) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.bookEquipment({
        equipmentId: selectedEq.id,
        farmId,
        acresToService: Number(acres),
        serviceStartDate: startDate,
      });

      setBookingSuccess(res.booking);
      setMyBookings((prev) => [res.booking, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to request equipment booking');
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
            Model C &middot; Agricultural Mechanisation
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white">
            Tractor &amp; Machinery Rental
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#F7F5EF]/80 max-w-2xl leading-relaxed">
            Schedule heavy tractors, disc ploughs, and harvesting equipment from verified mechanisation service centers with skilled machine operators and transparent per-acre pricing.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Machinery Listings Grid */}
        <div>
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-[#103B2D]">
              Available Agricultural Machinery
            </h2>
            <p className="text-xs text-slate-500">
              Servicing Bono, Ahafo, Ashanti, and Eastern agricultural belts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {equipmentList.map((eq) => (
              <div
                key={eq.id}
                className="rounded-2xl border border-[#E5E0D5] bg-white overflow-hidden shadow-sm hover:border-[#103B2D] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={eq.imageUrl || '/src/assets/images/farm_tractor_equipment_1791938387801.jpg'}
                      alt={eq.title}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-[#103B2D]/90 backdrop-blur-sm text-white text-[11px] font-mono px-2.5 py-1 rounded-md shadow flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>{eq.horsePower} Horsepower</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-[#2E7D32] capitalize">{eq.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {eq.operationalRegion}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#103B2D]">
                      {eq.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 py-2 text-xs border-y border-slate-100">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-[#2E7D32]" />
                        <span>Operator: {eq.operatorIncluded ? 'Included' : 'Self-drive'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
                        <span>Provider: {eq.providerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-6 pt-0 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xl font-bold text-[#103B2D]">
                      GHS {eq.ratePerAcreGHS}
                    </div>
                    <div className="text-[11px] text-slate-500">per acre serviced</div>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(eq)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#103B2D] text-white text-xs font-semibold hover:bg-[#185340] transition-colors shadow-sm"
                  >
                    <span>Request Booking</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Bookings Tracking */}
        {myBookings.length > 0 && (
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-[#103B2D] mb-4">
              My Machinery Bookings
            </h2>
            <div className="space-y-3">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-[#E5E0D5] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-display text-sm font-bold text-[#103B2D]">
                      {b.equipmentTitle}
                    </div>
                    <div className="text-xs text-slate-600">
                      Farm: {b.farmName} &middot; {b.acresToService} Acres &middot; Service Date: {b.serviceStartDate}
                    </div>
                    {b.providerNote && (
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded mt-1 border border-slate-200">
                        <span className="font-semibold text-slate-700">Provider Note: </span>
                        {b.providerNote}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <span className="font-mono font-bold text-sm text-[#103B2D]">
                      GHS {b.totalCostGHS.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedEq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#F7F5EF] p-6 shadow-2xl border border-[#E5E0D5]">
            <button
              onClick={() => {
                setShowBookingModal(false);
                setBookingSuccess(null);
              }}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E7D32] text-white mx-auto font-bold">
                  ✓
                </div>
                <h3 className="font-display text-lg font-bold text-[#103B2D]">
                  Booking Request Submitted!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your booking request for {selectedEq.title} has been transmitted to{' '}
                  <span className="font-semibold">{selectedEq.providerName}</span>. Total estimated cost:{' '}
                  <span className="font-mono font-bold">GHS {bookingSuccess.totalCostGHS.toLocaleString()}</span>.
                </p>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingSuccess(null);
                    setActiveView('farmer_dashboard');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#103B2D] text-white text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-lg font-bold text-[#103B2D] mb-1">
                  Book Machinery: {selectedEq.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Provider: {selectedEq.providerName} &middot; GHS {selectedEq.ratePerAcreGHS}/acre
                </p>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-2.5 text-xs text-red-800 border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Select Farm Parcel</label>
                    <select
                      value={farmId}
                      onChange={(e) => setFarmId(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                    >
                      {userFarms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.farmName} ({f.reportedAreaAcres} Acres, {f.community})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Acres to Service</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={acres}
                        onChange={(e) => setAcres(Number(e.target.value))}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Preferred Start Date</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full rounded-lg border border-[#CBD5E1] bg-white p-2.5 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Calculated Summary */}
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">Total Machinery Service Cost:</span>
                    <span className="font-mono font-bold text-base text-[#103B2D]">
                      GHS {(acres * (selectedEq.ratePerAcreGHS || 150)).toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-[#103B2D] py-2.5 text-xs font-bold text-white hover:bg-[#185340] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {submitting ? 'Transmitting Request...' : 'Confirm Machinery Booking'}
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
