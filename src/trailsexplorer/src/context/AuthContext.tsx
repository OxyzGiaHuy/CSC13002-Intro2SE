import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types/index';
import { apiCall } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
    updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

// LocalStorage keys used by the provider (match `api.ts` usage)
const TOKEN_KEY = 'trails_explorer_token';
const USER_KEY = 'trails_explorer_user';

// Ensure this matches your backend URL
const API_URL = '/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const raw = localStorage.getItem(USER_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        try {
            return !!localStorage.getItem(TOKEN_KEY);
        } catch (e) {
            return false;
        }
    });

    // No automatic hydration endpoint provided by backend; rely on stored user when present

    const login = async (email: string, password: string) => {
        try {
            const res = await apiCall('POST', '/api/auth/login', { email, password });
            const token = res?.token || res?.accessToken || res?.data?.token;
            const usr = res?.user || res?.data?.user || res?.userData || res;
            if (!token) throw new Error('Missing token from login response');
            try { localStorage.setItem(TOKEN_KEY, token); } catch (e) {}
            if (usr) {
                const normalized = (function normalizeUser(raw:any) {
                    if (!raw) return null;
                    return {
                        id: raw.id ?? raw.user_id ?? (raw.id ? String(raw.id) : undefined),
                        name: raw.name || raw.username || (raw.email ? raw.email.split('@')[0] : 'Trekker'),
                        avatarUrl: raw.avatarUrl || raw.avatar_url || 'https://i.pravatar.cc/100',
                        totalKm: raw.totalKm ?? raw.total_km ?? 0,
                        avgAltitude: raw.avgAltitude ?? raw.avg_altitude ?? 0,
                        avgTimeHr: raw.avgTimeHr ?? raw.avg_time_hr ?? 0,
                        tripHistory: Array.isArray(raw.tripHistory) ? raw.tripHistory : (Array.isArray(raw.trips) ? raw.trips : []),
                        preferences: raw.preferences || { difficulty: ['Moderate'], scenery: [] },
                        role: raw.role ? (String(raw.role).toLowerCase() === 'admin' ? 'admin' : 'user') : undefined,
                        email: raw.email,
                        status: raw.status,
                        bio: raw.bio || raw.description || '',
                        phone: raw.phone || raw.phone_number || '',
                        home_city: raw.home_city || raw.city || '',
                        home_country: raw.home_country || raw.country || ''
                    };
                })(usr);
                try { localStorage.setItem(USER_KEY, JSON.stringify(normalized)); } catch (e) {}
                setUser(normalized as any);
            }
            setIsAuthenticated(true);
        } catch (err: any) {
            setIsAuthenticated(false);
            setUser(null);
            throw err;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await apiCall('POST', '/api/auth/register', { username: name, email, password });
            const token = res?.token || res?.accessToken || res?.data?.token;
            const usr = res?.user || res?.data?.user || res;
            if (token) {
                try { localStorage.setItem(TOKEN_KEY, token); } catch (e) {}
                setIsAuthenticated(true);
            }
            if (usr) {
                const normalized = (function normalizeUser(raw:any) {
                    if (!raw) return null;
                    return {
                        id: raw.id ?? raw.user_id ?? (raw.id ? String(raw.id) : undefined),
                        name: raw.name || raw.username || (raw.email ? raw.email.split('@')[0] : 'Trekker'),
                        avatarUrl: raw.avatarUrl || raw.avatar_url || 'https://i.pravatar.cc/100',
                        totalKm: raw.totalKm ?? raw.total_km ?? 0,
                        avgAltitude: raw.avgAltitude ?? raw.avg_altitude ?? 0,
                        avgTimeHr: raw.avgTimeHr ?? raw.avg_time_hr ?? 0,
                        tripHistory: Array.isArray(raw.tripHistory) ? raw.tripHistory : (Array.isArray(raw.trips) ? raw.trips : []),
                        preferences: raw.preferences || { difficulty: ['Moderate'], scenery: [] },
                        role: raw.role ? (String(raw.role).toLowerCase() === 'admin' ? 'admin' : 'user') : undefined,
                        email: raw.email,
                        status: raw.status,
                        bio: raw.bio || raw.description || '',
                        phone: raw.phone || raw.phone_number || '',
                        home_city: raw.home_city || raw.city || '',
                        home_country: raw.home_country || raw.country || ''
                    };
                })(usr);
                try { localStorage.setItem(USER_KEY, JSON.stringify(normalized)); } catch (e) {}
                setUser(normalized as any);
            }
        } catch (err) {
            throw err;
        }
    };

    const updateProfile = (updates: Partial<User>) => {
        setUser((prev: User | null) => {
            const updated = prev ? { ...prev, ...updates } : prev;
            try { if (updated) localStorage.setItem(USER_KEY, JSON.stringify(updated)); } catch (e) {}
            return updated;
        });
    };

    const logout = () => {
        try {
            // Remove known auth keys (both current and legacy names)
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem('trailsexplorer_token');
            localStorage.removeItem('trailsexplorer_user');
            // Remove other app-local keys that should be cleared on logout
            localStorage.removeItem('community_posts');
            localStorage.removeItem('market_cart');
            localStorage.removeItem('market_items');
            localStorage.removeItem('trails_explorer_view');
            // Any other keys can be added here if required
        } catch (e) {}
        setUser(null);
        setIsAuthenticated(false);
        try { if (typeof window !== 'undefined') window.location.href = '/'; } catch(e) {}
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

