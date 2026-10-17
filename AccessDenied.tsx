import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AccessDeniedProps {
  requiredRole?: string;
  allowedRoles?: UserRole[];
  currentRole?: string;
  targetViewName?: string;
  onReturn?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredRole,
  allowedRoles,
  currentRole,
  targetViewName = 'Admin Dashboard',
  onReturn,
}) => {
  const { user, setActiveView, logout } = useAuth();

  const handleGoHome = () => {
    if (onReturn) {
      onReturn();
      return;
    }
    if (!user) {
      setActiveView('landing');
      return;
    }
    if (user.role === 'admin') {
      setActiveView('admin_dashboard');
    } else if (user.role === 'farmer') {
      setActiveView('farmer_dashboard');
    } else if (user.role === 'supplier') {
      setActiveView('supplier_dashboard');
    } else if (user.role === 'financial_institution') {
      setActiveView('institution_dashboard');
    } else if (user.role === 'equipment_provider') {
      setActiveView('equipment');
    } else {
      setActiveView('landing');
    }
  };

  const roleLabels: Record<string, string> = {
    admin: 'Platform Administrator',
    farmer: 'Smallholder Farmer',
    supplier: 'Agro-Chemical & Seed Supplier',
    financial_institution: 'Commercial Bank Officer',
    equipment_provider: 'Mechanization & Tractor Fleet Provider',
    field_agent: 'Certified Field Extension Agent',
  };

  const userRoleDisplay = user ? roleLabels[user.role] || user.role : 'Unauthenticated User';
  const requiredRoleDisplay = requiredRole
    ? roleLabels[requiredRole] || requiredRole
    : allowedRoles?.map((r) => roleLabels[r] || r).join(' or ') || 'Authorized Personnel';

  const isAdminAccessingNormalUser = user?.role === 'admin';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F7F5EF]">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-red-200 shadow-xl overflow-hidden">
        {/* Top African Motif & Security Banner */}
        <div className="h-2 w-full bg-gradient-to-r from-red-600 via-[#D4AF37] to-red-800" />

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0 shadow-sm">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold uppercase tracking-wider mb-1 border border-red-200">
                <Lock className="h-3 w-3" />
                Confidentiality Enforcement &middot; 403 Forbidden
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Access Restricted
              </h2>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 mb-6 space-y-3 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start justify-between border-b border-slate-200 pb-2.5">
              <span className="font-semibold text-slate-500">Your Current Account:</span>
              <span className="font-bold text-slate-900 text-right">
                {user?.fullName || 'Guest'} ({userRoleDisplay})
              </span>
            </div>

            <div className="flex items-start justify-between border-b border-slate-200 pb-2.5">
              <span className="font-semibold text-slate-500">Required Clearance:</span>
              <span className="font-bold text-red-700 text-right">
                {requiredRoleDisplay}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {isAdminAccessingNormalUser ? (
                <>
                  <strong className="text-slate-800">Administrator Boundary Notice:</strong> Personal farmer profiles, individual loan applications, and private stakeholder vouchers are confidential to individual users. Administrators oversee platform governance through the dedicated Admin Portal.
                </>
              ) : (
                <>
                  <strong className="text-slate-800">Confidentiality Protocol Notice:</strong> AgriTrust AI strictly enforces role isolation. Standard user accounts cannot inspect platform administrative controls, KYC audit logs, or system infrastructure.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleGoHome}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#103B2D] text-white text-xs sm:text-sm font-bold hover:bg-[#185340] transition-colors shadow flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go to My Authorized Dashboard</span>
            </button>

            <button
              onClick={logout}
              className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4 text-slate-500" />
              <span>Sign In with Different Account</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32]" />
            <span>Bank of Ghana &amp; MoFA Sovereign Agronomic Data Security Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
