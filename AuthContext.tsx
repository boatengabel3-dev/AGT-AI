import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, FarmerProfile, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  farmerProfile: FarmerProfile | null;
  token: string | null;
  loading: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (preferredEmail?: string, preferredRole?: UserRole) => Promise<void>;
  register: (data: any) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  updateProfile: (data: Partial<FarmerProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('agritrust_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('landing');

  const refreshMe = async () => {
    try {
      if (!localStorage.getItem('agritrust_token')) {
        setUser(null);
        setFarmerProfile(null);
        setLoading(false);
        return;
      }
      const data = await api.getMe();
      setUser(data.user);
      setFarmerProfile(data.profile);
    } catch (err) {
      console.warn('Session check error:', err);
      const tokenInStorage = localStorage.getItem('agritrust_token');
      if (tokenInStorage && !tokenInStorage.startsWith('google_session_')) {
        localStorage.removeItem('agritrust_token');
        setToken(null);
        setUser(null);
        setFarmerProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agritrust_token');
      if (storedToken) {
        try {
          const data = await api.getMe();
          setUser(data.user);
          setFarmerProfile(data.profile);
          if (data.user.role === 'admin') setActiveView('admin_dashboard');
          else if (data.user.role === 'financial_institution') setActiveView('institution_dashboard');
          else if (data.user.role === 'fertilizer_dealer' || data.user.role === 'supplier') setActiveView('fertilizer_admin');
          else if (data.user.role === 'equipment_provider') setActiveView('machinery_admin');
          else if (data.user.role === 'seed_dealer') setActiveView('seed_admin');
          else setActiveView('farmer_dashboard');
        } catch (err) {
          if (!storedToken.startsWith('google_session_')) {
            localStorage.removeItem('agritrust_token');
            setToken(null);
            setUser(null);
            setFarmerProfile(null);
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    localStorage.setItem('agritrust_token', res.token);
    setToken(res.token);
    setUser(res.user);
    if (res.user.role === 'farmer') {
      setActiveView('farmer_dashboard');
    } else if (res.user.role === 'financial_institution') {
      setActiveView('institution_dashboard');
    } else if (res.user.role === 'admin') {
      setActiveView('admin_dashboard');
    } else if (res.user.role === 'fertilizer_dealer') {
      setActiveView('fertilizer_admin');
    } else if (res.user.role === 'equipment_provider') {
      setActiveView('machinery_admin');
    } else if (res.user.role === 'seed_dealer') {
      setActiveView('seed_admin');
    } else if (res.user.role === 'supplier') {
      setActiveView('fertilizer_admin');
    } else {
      setActiveView('farmer_dashboard');
    }
    await refreshMe();
  };

  const loginWithGoogle = async (preferredEmail?: string, preferredRole: UserRole = 'farmer') => {
    const { signInWithGoogle } = await import('../services/firebase');
    const { user: googleUser } = await signInWithGoogle(preferredEmail, preferredRole);

    // Create/sync session with backend
    try {
      const res = await api.googleSync({
        id: googleUser.id,
        fullName: googleUser.fullName,
        email: googleUser.email,
        phone: googleUser.phone,
        role: preferredRole || googleUser.role,
        avatarUrl: googleUser.avatarUrl,
      });

      localStorage.setItem('agritrust_token', res.token);
      setToken(res.token);
      setUser(res.user);

      if (res.user.role === 'admin') setActiveView('admin_dashboard');
      else if (res.user.role === 'financial_institution') setActiveView('institution_dashboard');
      else if (res.user.role === 'fertilizer_dealer' || res.user.role === 'supplier') setActiveView('fertilizer_admin');
      else if (res.user.role === 'equipment_provider') setActiveView('machinery_admin');
      else if (res.user.role === 'seed_dealer') setActiveView('seed_admin');
      else setActiveView('farmer_dashboard');
    } catch (syncErr) {
      console.warn('Backend sync error, activating client session:', syncErr);
      const fallbackToken = 'google_session_' + Date.now();
      localStorage.setItem('agritrust_token', fallbackToken);
      setToken(fallbackToken);
      setUser(googleUser);
      if (googleUser.role === 'admin') setActiveView('admin_dashboard');
      else if (googleUser.role === 'financial_institution') setActiveView('institution_dashboard');
      else if (googleUser.role === 'fertilizer_dealer' || googleUser.role === 'supplier') setActiveView('fertilizer_admin');
      else if (googleUser.role === 'equipment_provider') setActiveView('machinery_admin');
      else if (googleUser.role === 'seed_dealer') setActiveView('seed_admin');
      else setActiveView('farmer_dashboard');
    }
    await refreshMe();
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    localStorage.setItem('agritrust_token', res.token);
    setToken(res.token);
    setUser(res.user);
    if (res.user.role === 'fertilizer_dealer' || res.user.role === 'supplier') {
      setActiveView('fertilizer_admin');
    } else if (res.user.role === 'seed_dealer') {
      setActiveView('seed_admin');
    } else if (res.user.role === 'equipment_provider') {
      setActiveView('machinery_admin');
    } else {
      setActiveView('farmer_dashboard');
    }
    await refreshMe();
  };

  const demoLogin = async (role: UserRole) => {
    const res = await api.demoLogin(role);
    localStorage.setItem('agritrust_token', res.token);
    setToken(res.token);
    setUser(res.user);
    
    // Automatically route to appropriate view for the selected role
    if (role === 'farmer') {
      setActiveView('farmer_dashboard');
    } else if (role === 'financial_institution') {
      setActiveView('institution_dashboard');
    } else if (role === 'admin') {
      setActiveView('admin_dashboard');
    } else if (role === 'fertilizer_dealer') {
      setActiveView('fertilizer_admin');
    } else if (role === 'equipment_provider') {
      setActiveView('machinery_admin');
    } else if (role === 'seed_dealer') {
      setActiveView('seed_admin');
    } else if (role === 'supplier') {
      setActiveView('fertilizer_admin');
    } else if (role === 'field_agent') {
      setActiveView('admin_dashboard');
    }
    await refreshMe();
  };

  const logout = () => {
    localStorage.removeItem('agritrust_token');
    setToken(null);
    setUser(null);
    setFarmerProfile(null);
    setActiveView('landing');
  };

  const updateProfile = async (data: Partial<FarmerProfile>) => {
    const res = await api.updateFarmerProfile(data);
    setFarmerProfile(res.profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farmerProfile,
        token,
        loading,
        activeView,
        setActiveView,
        login,
        loginWithGoogle,
        register,
        demoLogin,
        logout,
        refreshMe,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
