import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EquipmentListing, EquipmentBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Tractor,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Clock,
  Gauge,
  Fuel,
  UserCheck,
  Check,
  X,
  Search,
} from 'lucide-react';

export const MachineryAdminPage: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<EquipmentListing[]>([]);
  const [bookings, setBookings] = useState<EquipmentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fleet' | 'bookings'>('fleet');
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentListing | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'tractors',
    ratePerAcreGHS: '',
    dailyRateGHS: '',
    horsepower: '75',
    operatorIncluded: true,
    fuelIncluded: false,
    availabilityStatus: 'available' as EquipmentListing['availabilityStatus'],
    operationalRegion: 'Bono Region',
    operationalDistricts: 'Sunyani Municipal, Sunyani West, Berekum',
    description: 'Heavy duty 4WD agricultural tractor equipped with disc plough, rotary tiller, and precision GPS area measurement.',
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eqList, bkList] = await Promise.all([
        api.getEquipmentListings(),
        api.getBookings(),
      ]);
      setListings(eqList);
      setBookings(bkList);
    } catch (err) {
      console.error('Failed to load machinery admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'tractors',
      ratePerAcreGHS: '180',
      dailyRateGHS: '1400',
      horsepower: '75',
      operatorIncluded: true,
      fuelIncluded: false,
      availabilityStatus: 'available',
      operationalRegion: 'Bono Region',
      operationalDistricts: 'Sunyani Municipal, Sunyani West, Berekum',
      description: 'Heavy duty 4WD agricultural tractor with experienced certified operator and disc plough implement.',
    });
    setModalOpen(true);
    setStatusMessage(null);
  };

  const openEditModal = (item: EquipmentListing) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      ratePerAcreGHS: String(item.ratePerAcreGHS),
      dailyRateGHS: String(item.dailyRateGHS || ''),
      horsepower: String(item.horsepower || '75'),
      operatorIncluded: item.operatorIncluded,
      fuelIncluded: item.fuelIncluded,
      availabilityStatus: item.availabilityStatus || 'available',
      operationalRegion: item.operationalRegion || 'Bono Region',
      operationalDistricts: (item.operationalDistricts || []).join(', '),
      description: item.description || '',
    });
    setModalOpen(true);
    setStatusMessage(null);
  };

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        ratePerAcreGHS: Number(formData.ratePerAcreGHS),
        dailyRateGHS: formData.dailyRateGHS ? Number(formData.dailyRateGHS) : undefined,
        horsepower: formData.horsepower ? Number(formData.horsepower) : undefined,
        operatorIncluded: formData.operatorIncluded,
        fuelIncluded: formData.fuelIncluded,
        availabilityStatus: formData.availabilityStatus,
        operationalRegion: formData.operationalRegion,
        operationalDistricts: formData.operationalDistricts.split(',').map((s) => s.trim()),
        description: formData.description,
      };

      if (editingItem) {
        await api.updateEquipmentListing(editingItem.id, payload);
        setStatusMessage({ type: 'success', text: `Machinery "${formData.title}" updated in web app!` });
      } else {
        await api.createEquipmentListing(payload);
        setStatusMessage({ type: 'success', text: `New tractor "${formData.title}" published to equipment hub!` });
      }

      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save machinery' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the web app?`)) return;
    try {
      await api.deleteEquipmentListing(id);
      setStatusMessage({ type: 'success', text: `Removed "${title}" from web app.` });
      await loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete equipment' });
    }
  };

  const handleUpdateBooking = async (id: string, status: 'confirmed' | 'completed' | 'declined') => {
    try {
      await api.updateBookingStatus(id, {
        status,
        providerNote: `Booking ${status} by Volta Mechanisation Fleet Operations.`,
      });
      setStatusMessage({ type: 'success', text: `Booking #${id} updated to "${status}".` });
      await loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update booking' });
    }
  };

  const filteredListings = listings.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-20">
      {/* Top Banner */}
      <div className="bg-[#103B2D] text-[#F7F5EF] py-10 border-b border-[#2A4D3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950 text-[#D4AF37] border border-[#D4AF37]/30">
                <Tractor className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                    Admin Management Portal
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                    Machineries &amp; Tractor Fleet
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  Volta Mechanisation Fleet Administration
                </h1>
                <p className="text-xs sm:text-sm text-[#F7F5EF]/80 mt-1">
                  Manage tractors, update per-acre ploughing rates in GHS, adjust fleet availability, and approve farmer mechanization bookings.
                </p>
              </div>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Tractor to Web App</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Active Fleet Units</span>
              <Tractor className="h-4 w-4 text-[#2E7D32]" />
            </div>
            <div className="text-2xl font-bold text-[#103B2D] font-display">{listings.length} Machines</div>
            <span className="text-[11px] text-emerald-700 font-medium">Available for booking</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Pending Bookings</span>
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-[#103B2D] font-display">
              {bookings.filter((b) => b.status === 'pending_provider_confirmation').length} Pending
            </div>
            <span className="text-[11px] text-slate-500">Awaiting operator assignment</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Avg Tillage Rate</span>
              <Gauge className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl font-bold text-[#103B2D] font-display">
              GHS {listings.length > 0 ? Math.round(listings.reduce((acc, l) => acc + (l.ratePerAcreGHS || 0), 0) / listings.length) : 0} / acre
            </div>
            <span className="text-[11px] text-slate-500">Bono &amp; Ashanti Zones</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Completed Jobs</span>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-[#103B2D] font-display">
              {bookings.filter((b) => b.status === 'completed').length} Completed
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">GPS Acreage verified</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('fleet')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'fleet'
                ? 'border-[#2E7D32] text-[#103B2D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tractor className="h-4 w-4" />
            <span>Update Tractor Fleet &amp; Rates in Web App</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-[#2E7D32] text-[#103B2D]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Manage Farmer Bookings &amp; Operators</span>
          </button>
        </div>

        {/* Tab 1: Fleet Management */}
        {activeTab === 'fleet' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="relative max-w-sm w-full">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search fleet by model, horsepower, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <span className="text-xs text-slate-500">
                Rate changes made here immediately update what farmers see in the equipment section.
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading tractor fleet...</div>
            ) : filteredListings.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-700">No machinery listings found</p>
                <button
                  onClick={openAddModal}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2E7D32] text-white text-xs font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add First Tractor</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-[#E5E0D5] p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {item.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.availabilityStatus === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.availabilityStatus === 'in_field'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.availabilityStatus === 'available' ? 'Available' : item.availabilityStatus === 'in_field' ? 'In Field' : 'Maintenance'}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-[#103B2D] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Tillage Rate:</span>
                          <span className="font-extrabold text-[#2E7D32] text-sm">GHS {item.ratePerAcreGHS} / acre</span>
                        </div>
                        {item.dailyRateGHS && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Full Day Rate:</span>
                            <span className="font-semibold text-slate-700">GHS {item.dailyRateGHS} / day</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Horsepower:</span>
                          <span className="font-semibold text-slate-700">{item.horsepower || '75'} HP 4WD</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Driver / Operator:</span>
                          <span className="font-semibold text-emerald-800">{item.operatorIncluded ? 'Included' : 'Customer Driver'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Service Region:</span>
                          <span className="font-semibold text-slate-700">{item.operationalRegion}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400">
                        {item.completedJobsCount} jobs completed
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#2E7D32] hover:text-[#2E7D32] text-xs font-semibold text-slate-600 transition-colors flex items-center gap-1"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteListing(item.id, item.title)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-600 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Manage Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-[#103B2D] mb-1">
              Farmer Mechanization Service Bookings
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Review acreage service requests, confirm operator schedules, and update job execution statuses.
            </p>

            {bookings.length === 0 ? (
              <div className="text-xs text-slate-500 py-10 text-center">No service bookings currently recorded.</div>
            ) : (
              <div className="space-y-4">
                {bookings.map((bk) => (
                  <div key={bk.id} className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#103B2D]">{bk.equipmentTitle}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bk.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : bk.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : bk.status === 'declined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {bk.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Farmer: <span className="font-semibold text-slate-800">{bk.farmerName}</span> ({bk.farmerPhone}) &middot; Farm: <span className="font-semibold text-slate-800">{bk.farmName}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-extrabold text-[#2E7D32]">GHS {bk.totalCostGHS.toLocaleString()}</div>
                        <div className="text-[11px] text-slate-500">{bk.acresToService} Acres Requested</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Start: {bk.serviceStartDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> End: {bk.serviceEndDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {bk.status === 'pending_provider_confirmation' && (
                          <>
                            <button
                              onClick={() => handleUpdateBooking(bk.id, 'confirmed')}
                              className="px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold transition-all"
                            >
                              Confirm Booking
                            </button>
                            <button
                              onClick={() => handleUpdateBooking(bk.id, 'declined')}
                              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-all"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {bk.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateBooking(bk.id, 'completed')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Mark Tillage Completed</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add or Edit Machinery */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E0D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-display text-lg font-bold text-[#103B2D]">
                {editingItem ? 'Edit Tractor Listing in Web App' : 'Add New Tractor to Web App'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveListing} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Machinery Model / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Deere 5075E 75HP 4WD with Heavy Disc Plough"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rate per Acre (GHS)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="180"
                    value={formData.ratePerAcreGHS}
                    onChange={(e) => setFormData({ ...formData, ratePerAcreGHS: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Daily Rental Rate (GHS)
                  </label>
                  <input
                    type="number"
                    placeholder="1400"
                    value={formData.dailyRateGHS}
                    onChange={(e) => setFormData({ ...formData, dailyRateGHS: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300"
                  >
                    <option value="tractors">Tractor (4WD)</option>
                    <option value="harvesters">Harvester</option>
                    <option value="implements">Plough / Harrow</option>
                    <option value="sprayers">Boom Sprayer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Horsepower (HP)
                  </label>
                  <input
                    type="number"
                    placeholder="75"
                    value={formData.horsepower}
                    onChange={(e) => setFormData({ ...formData, horsepower: e.target.value })}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300"
                  >
                    <option value="available">Available</option>
                    <option value="in_field">In Field</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operational Region
                  </label>
                  <input
                    type="text"
                    value={formData.operationalRegion}
                    onChange={(e) => setFormData({ ...formData, operationalRegion: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operational Districts
                  </label>
                  <input
                    type="text"
                    value={formData.operationalDistricts}
                    onChange={(e) => setFormData({ ...formData, operationalDistricts: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.operatorIncluded}
                    onChange={(e) => setFormData({ ...formData, operatorIncluded: e.target.checked })}
                    className="rounded text-[#2E7D32] focus:ring-[#2E7D32]"
                  />
                  <span>Certified Operator Included</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.fuelIncluded}
                    onChange={(e) => setFormData({ ...formData, fuelIncluded: e.target.checked })}
                    className="rounded text-[#2E7D32] focus:ring-[#2E7D32]"
                  />
                  <span>Diesel Fuel Included</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Equipment Description &amp; Implement Attachments
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold transition-all disabled:opacity-60 shadow-sm"
                >
                  {saving ? 'Saving...' : editingItem ? 'Save & Update Web App' : 'Publish to Web App'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
