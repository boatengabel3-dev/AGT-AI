import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, AuditLog, Farm } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  Layers,
  Globe,
} from 'lucide-react';
import { AdminGeospatialMap } from '../components/admin/AdminGeospatialMap';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'users' | 'farms' | 'audit'>('overview');
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [stats, usersList, farmsList, logsList] = await Promise.all([
          api.getAdminOverview(),
          api.getAdminUsers(),
          api.getFarms(),
          api.getAuditLogs(),
        ]);
        setOverview(stats);
        setUsers(usersList);
        setFarms(farmsList);
        setAuditLogs(logsList);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [user]);

  const toggleUserVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await api.verifyUser(userId, !currentStatus);
      setUsers((prev) => prev.map((u) => (u.id === userId ? res.user : u)));
      setActionFeedback({
        type: 'success',
        message: `User ${res.user.fullName} verification status updated to ${!currentStatus ? 'Verified' : 'Unverified'}.`,
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Verification update failed' });
    }
  };

  const handleVerifyFarm = async (farmId: string) => {
    try {
      const res = await api.verifyFarm(farmId, {
        status: 'verified',
        notes: 'GPS polygon and boundary validated by administrator.',
      });
      setFarms((prev) => prev.map((f) => (f.id === farmId ? res.farm : f)));
      setActionFeedback({
        type: 'success',
        message: `Farm "${res.farm.farmName}" successfully verified.`,
      });
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Farm verification failed' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-16">
      {/* Top Banner */}
      <div className="bg-[#103B2D] text-[#F7F5EF] py-10 border-b border-[#2A4D3F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2E7D32] text-[#D4AF37]">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Platform Control Center
                </div>
                <h1 className="font-display text-2xl font-bold text-white">
                  AgriTrust AI Operations &amp; Audit Administration
                </h1>
                <p className="text-xs text-[#F7F5EF]/80">
                  User Verification &middot; Farm Boundary Compliance &middot; Audit Trails
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-xl text-xs overflow-x-auto">
              {(['overview', 'map', 'users', 'farms', 'audit'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-[#D4AF37] text-[#103B2D]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {tab === 'map' ? 'GIS Map & Input Hubs' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {actionFeedback && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <span>{actionFeedback.message}</span>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-xs opacity-70 hover:opacity-100 font-bold ml-3"
            >
              Dismiss
            </button>
          </div>
        )}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Registered Users</div>
                <div className="font-mono text-2xl font-bold text-[#103B2D] mt-1">
                  {overview.totalUsers}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {overview.usersByRole.farmer} Farmers &middot; {overview.usersByRole.supplier} Suppliers
                </div>
              </div>
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Mapped Farm Parcels</div>
                <div className="font-mono text-2xl font-bold text-[#103B2D] mt-1">
                  {overview.totalFarms}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  {overview.verifiedFarmsCount} Verified &middot; {overview.pendingFarmsCount} Pending
                </div>
              </div>
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Loan Volume Requested</div>
                <div className="font-mono text-2xl font-bold text-[#103B2D] mt-1">
                  GHS {overview.totalLoanRequestedGHS.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Across {overview.totalLoanApplications} Applications
                </div>
              </div>
              <div className="rounded-2xl border border-[#E5E0D5] bg-white p-5 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Input Marketplace Volume</div>
                <div className="font-mono text-2xl font-bold text-[#103B2D] mt-1">
                  GHS {overview.totalOrderVolumeGHS.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Across {overview.totalOrders} Completed Orders
                </div>
              </div>
            </div>

            {/* Continental GIS Operations Center */}
            <div>
              <AdminGeospatialMap farms={farms} onVerifyFarm={handleVerifyFarm} />
            </div>

            {/* Quick Summary Section */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-[#103B2D] mb-3">
                AgriTrust AI Ghana Pilot Status
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                The platform is operating with persistent JSON data storage, real bcrypt authentication, role-based authorization, and active endpoints for marketplace orders, loan underwriting, and equipment scheduling. All user actions are recorded to the immutable audit log below.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <AdminGeospatialMap farms={farms} onVerifyFarm={handleVerifyFarm} />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-[#103B2D] mb-4">
              Registered Platform Users ({users.length})
            </h3>
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="rounded-xl border border-[#E5E0D5] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{u.fullName}</span>
                      <span className="font-mono font-normal text-slate-400">({u.email})</span>
                    </div>
                    <div className="text-slate-500">
                      Role: <span className="capitalize font-semibold text-[#103B2D]">{u.role.replace('_', ' ')}</span> &middot; {u.country}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        u.isVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <button
                      onClick={() => toggleUserVerification(u.id, u.isVerified)}
                      className="px-3 py-1 rounded bg-[#103B2D] text-white text-[11px] font-semibold hover:bg-[#185340] transition-colors"
                    >
                      {u.isVerified ? 'Revoke Verification' : 'Verify Account'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'farms' && (
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-[#103B2D] mb-4">
              Farm Perimeter GPS Verification Review
            </h3>
            <div className="space-y-3">
              {farms.map((f) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-[#E5E0D5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{f.farmName}</span>
                      <span className="text-slate-500">Farmer: {f.farmerName}</span>
                    </div>
                    <div className="text-slate-500">
                      {f.community}, {f.region} &middot; {f.reportedAreaAcres} Acres ({f.cropType})
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      Coordinates: {f.centerCoordinates.lat.toFixed(4)}°N, {f.centerCoordinates.lng.toFixed(4)}°W
                    </div>
                    {f.verificationNotes && (
                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded mt-1">
                        {f.verificationNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        f.verificationStatus === 'verified'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {f.verificationStatus}
                    </span>
                    {f.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => handleVerifyFarm(f.id)}
                        className="px-3 py-1 rounded bg-[#2E7D32] text-white text-[11px] font-semibold hover:bg-[#256629]"
                      >
                        Approve GPS Verification
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="rounded-2xl border border-[#E5E0D5] bg-white p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-[#103B2D] mb-4">
              Platform Audit Trail (Ghana Act 843 Log)
            </h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg border border-slate-100 bg-[#F7F5EF] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span>By: {log.actorName} ({log.actorRole})</span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
