import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Farm, LoanApplication, Order, EquipmentBooking } from '../types';
import { FarmerWeatherWidget } from '../components/farmer/FarmerWeatherWidget';
import {
  Sprout,
  Landmark,
  ShoppingCart,
  Tractor,
  Bot,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  CloudSun,
  FileText,
  Calendar,
} from 'lucide-react';

interface FarmerDashboardProps {
  onOpenOnboarding: () => void;
  onOpenRegisterFarm: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onOpenOnboarding,
  onOpenRegisterFarm,
}) => {
  const { user, farmerProfile, setActiveView } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<EquipmentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [farmsData, appsData, ordersData, bookingsData] = await Promise.all([
          api.getFarms(),
          api.getLoanApplications(),
          api.getOrders(),
          api.getBookings(),
        ]);
        setFarms(farmsData);
        setApplications(appsData);
        setOrders(ordersData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const verifiedFarms = farms.filter((f) => f.verificationStatus === 'verified');
  const totalAcres = farms.reduce((sum, f) => sum + (f.verifiedAreaAcres || f.reportedAreaAcres), 0);

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-16">
      {/* Top Welcome & Profile Bar */}
      <div className="bg-[#103B2D] text-[#F7F5EF] pt-8 pb-12 border-b border-[#2A4D3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.avatarUrl || '/src/assets/images/farmer_profile_avatar_1791938388060.jpg'}
                  alt={user?.fullName || 'Farmer'}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2E7D32] text-white">
                  <ShieldCheck className="h-3 w-3" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl font-bold text-white">
                    Akwaaba, {user?.fullName || 'Kwame Mensah'}
                  </h1>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#F7F5EF]/80 mt-1">
                  <span>{farmerProfile?.region || 'Bono Region'}, Ghana</span>
                  <span>&middot;</span>
                  <span>{farms.length} Registered Parcels ({totalAcres} Acres)</span>
                  <span>&middot;</span>
                  <span className="text-[#D4AF37] font-semibold">
                    {farmerProfile?.cooperativeName || 'Sunyani Farmers Cooperative Union'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completeness vs Verification Banner */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-[#F7F5EF]/85 font-medium">Profile Completeness</span>
                  <span className="font-mono font-bold text-[#D4AF37]">
                    {farmerProfile?.profileCompleteness || 92}%
                  </span>
                </div>
                <div className="w-full sm:w-36 bg-black/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D4AF37] h-full rounded-full transition-all duration-500"
                    style={{ width: `${farmerProfile?.profileCompleteness || 92}%` }}
                  />
                </div>
              </div>

              <div className="sm:border-l border-white/20 sm:pl-4 space-y-0.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <div className="text-[10px] uppercase font-semibold text-white/60 tracking-wider">Verification Status</div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>GPS Ground Truth Validated</span>
                </div>
              </div>

              <button
                onClick={onOpenOnboarding}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#D4AF37] text-[#103B2D] text-xs font-bold hover:bg-[#e2bd44] transition-all whitespace-nowrap min-h-[40px] shadow-sm text-center"
              >
                Onboarding Wizard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {[
            {
              label: 'Apply for Loan',
              icon: Landmark,
              color: 'text-amber-700 bg-amber-50',
              action: () => setActiveView('financing'),
            },
            {
              label: 'Buy Fertilizer',
              icon: Sprout,
              color: 'text-emerald-700 bg-emerald-50',
              action: () => setActiveView('marketplace'),
            },
            {
              label: 'Buy Seeds',
              icon: ShoppingCart,
              color: 'text-emerald-700 bg-emerald-50',
              action: () => setActiveView('marketplace'),
            },
            {
              label: 'Rent Tractor',
              icon: Tractor,
              color: 'text-blue-700 bg-blue-50',
              action: () => setActiveView('equipment'),
            },
            {
              label: 'Register Farm',
              icon: Plus,
              color: 'text-purple-700 bg-purple-50',
              action: onOpenRegisterFarm,
            },
            {
              label: 'Ask AgriTrust AI',
              icon: Bot,
              color: 'text-teal-700 bg-teal-50',
              action: () => setActiveView('ai_advisory'),
            },
            {
              label: 'Data Sharing',
              icon: ShieldCheck,
              color: 'text-slate-700 bg-slate-100',
              action: onOpenOnboarding,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="rounded-2xl border border-[#E5E0D5] bg-white p-3 sm:p-3.5 text-center shadow-xs hover:border-[#103B2D] hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group min-h-[56px] sm:min-h-[78px] active:scale-95"
              >
                <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${item.color} group-hover:scale-105 transition-transform shrink-0`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 line-clamp-1">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Localized Weather & 7-Day Planting Cycles Forecast */}
        <div className="mb-8">
          <FarmerWeatherWidget
            farmerRegion={farmerProfile?.region || 'Bono Region'}
            initialCoordinates={farms[0]?.centerCoordinates}
          />
        </div>

        {/* Main Dashboard Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Farms, Active Loans, Bookings */}
          <div className="lg:col-span-8 space-y-8">
            {/* Registered Farms Section */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#103B2D]">
                    Registered Farm Parcels
                  </h3>
                  <p className="text-xs text-slate-500">
                    Geospatial boundaries mapped for seasonal underwriting
                  </p>
                </div>
                <button
                  onClick={onOpenRegisterFarm}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#103B2D] text-white text-xs font-semibold hover:bg-[#185340] transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Register Parcel</span>
                </button>
              </div>

              {farms.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed rounded-xl p-4">
                  No farm parcels registered yet. Click &quot;Register Parcel&quot; to begin.
                </div>
              ) : (
                <div className="space-y-3">
                  {farms.map((farm) => (
                    <div
                      key={farm.id}
                      className="rounded-xl border border-[#E5E0D5] p-4 hover:border-[#2E7D32] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-bold text-[#103B2D]">
                            {farm.farmName}
                          </h4>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              farm.verificationStatus === 'verified'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {farm.verificationStatus === 'verified' ? 'Verified Parcel' : 'Pending Verification'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {farm.community}, {farm.region}
                          </span>
                          <span>&middot;</span>
                          <span className="font-mono font-medium">
                            {farm.verifiedAreaAcres || farm.reportedAreaAcres} Acres
                          </span>
                          <span>&middot;</span>
                          <span className="font-medium text-[#2E7D32]">{farm.cropType}</span>
                        </div>
                        {farm.verificationNotes && (
                          <div className="text-[11px] text-slate-500 bg-[#F7F5EF] p-2 rounded mt-2 border border-[#E5E0D5]">
                            <span className="font-semibold text-slate-700">Verification Note: </span>
                            {farm.verificationNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="text-right text-[11px] font-mono text-slate-500">
                          {farm.centerCoordinates.lat.toFixed(4)}°N, {farm.centerCoordinates.lng.toFixed(4)}°W
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Financing & Loan Applications */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-[#103B2D]">
                    Financing &amp; Loan Applications
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transmitted to licensed participating financial institutions
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('financing')}
                  className="text-xs font-semibold text-[#2E7D32] hover:underline"
                >
                  View All Products &rarr;
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 border border-dashed rounded-xl p-4">
                  No active loan applications. Explore available financing products to apply.
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-xl border border-[#E5E0D5] p-4 hover:border-[#103B2D] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="font-display text-sm font-bold text-[#103B2D]">
                            {app.financingProductTitle}
                          </div>
                          <div className="text-xs text-slate-500">
                            Offered by: {app.institutionName} &middot; Associated Farm: {app.associatedFarmName}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#103B2D]">
                            GHS {app.requestedAmountGHS.toLocaleString()}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              app.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800'
                                : app.status === 'declined'
                                ? 'bg-red-50 text-red-800'
                                : 'bg-blue-50 text-blue-800'
                            }`}
                          >
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Status history log item */}
                      {app.statusHistory && app.statusHistory.length > 0 && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 mt-2">
                          <span className="font-semibold text-slate-800">Latest Review Event: </span>
                          {app.statusHistory[app.statusHistory.length - 1].note}
                          <span className="text-slate-400 ml-2">
                            ({new Date(app.statusHistory[app.statusHistory.length - 1].timestamp).toLocaleDateString()})
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Equipment Bookings & Input Orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment Bookings */}
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display text-sm font-bold text-[#103B2D]">Tractor Bookings</h4>
                  <button
                    onClick={() => setActiveView('equipment')}
                    className="text-[11px] font-semibold text-[#2E7D32]"
                  >
                    Find Tractor &rarr;
                  </button>
                </div>
                {bookings.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No active machinery bookings.</p>
                ) : (
                  <div className="space-y-2">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                        <div className="font-semibold text-slate-900">{b.equipmentTitle}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {b.acresToService} Acres &middot; {b.serviceStartDate} &middot; GHS {b.totalCostGHS}
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          {b.status.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input Orders */}
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display text-sm font-bold text-[#103B2D]">Certified Input Orders</h4>
                  <button
                    onClick={() => setActiveView('marketplace')}
                    className="text-[11px] font-semibold text-[#2E7D32]"
                  >
                    Marketplace &rarr;
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">No recent input orders.</p>
                ) : (
                  <div className="space-y-2">
                    {orders.map((o) => (
                      <div key={o.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">Order #{o.id}</span>
                          <span className="font-mono font-bold text-slate-800">GHS {o.totalAmountGHS}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {o.items.length} items &middot; Tracking: {o.trackingNumber}
                        </div>
                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                          {o.fulfilmentStatus}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Weather, Agro-Advisory, AI Assistant Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Seasonal Agronomic Advisory */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#D4AF37]" />
                  <h4 className="font-display text-sm font-bold text-[#103B2D]">
                    Seasonal Agronomic Calendar
                  </h4>
                </div>
                <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">MoFA Cycle</span>
              </div>
              <div className="text-xs text-slate-600 space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Major Season Land Prep:</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Early tillage recommended before onset of steady rains in early March.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                  <Sprout className="h-4 w-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Seed Inoculation:</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      CSIR-CRI hybrid maize seed foundation stock available at Sunyani Depot.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AgriTrust AI Advisor Card */}
            <div className="rounded-2xl border border-[#103B2D] bg-[#103B2D] text-[#F7F5EF] p-5 shadow-md space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E7D32] text-[#D4AF37]">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-white">AgriTrust AI Assistant</h4>
                  <p className="text-[11px] text-[#D4AF37]">Grounded Agricultural Intelligence</p>
                </div>
              </div>
              <p className="text-xs text-[#F7F5EF]/85 leading-relaxed">
                Have questions about bank loan requirements, certified fertilizer formulas, or tractor availability in your district?
              </p>
              <button
                onClick={() => setActiveView('ai_advisory')}
                className="w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#103B2D] text-xs font-bold hover:bg-[#e2bd44] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Ask AgriTrust AI</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Ghana Act 843 Data Protection Compliance Notice */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-[#F7F5EF] p-4 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#103B2D]">
                <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
                <span>Data Privacy Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Your farm GPS boundaries and financial data are never shared with third parties without your explicit permission under Ghana&apos;s Data Protection Act, 2012 (Act 843).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
