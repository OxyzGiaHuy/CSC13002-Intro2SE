// @ts-nocheck
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../types/index';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    register: (name: string, email?: string) => void;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const STORAGE_KEY = 'trails_explorer_auth';

    const [user, setUser] = useState<User | null>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed.user || null;
        } catch (e) {
            return null;
        }
    });
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return false;
            const parsed = JSON.parse(raw);
            return !!parsed.isAuthenticated;
        } catch (e) {
            return false;
        }
    });
    const [role, setRole] = useState<'admin' | 'user'>(user?.role || 'user');

    // keep localStorage in sync whenever auth changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, isAuthenticated }));
        } catch (e) {
            // ignore quota errors
        }
    }, [user, isAuthenticated]);

    const login = (email: string) => {
        // Mock login logic: if email contains "admin", set role to admin
        const resolvedRole: 'admin' | 'user' = email.includes('admin') ? 'admin' : 'user';
        setRole(resolvedRole);
        const userData: User = {
            name: email.split('@')[0],
            avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(email)}/100/100`,
            totalKm: 0,
            avgAltitude: 0,
            avgTimeHr: 0,
            tripHistory: [],
            preferences: { difficulty: ['Easy', 'Medium', 'Hard'], scenery: [] },
            email,
            role: resolvedRole,
        };
        console.log('[Auth] login:', email, resolvedRole);
        setUser(userData);
        setIsAuthenticated(true);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, isAuthenticated: true })); } catch {}
    };

    const register = (name: string, email?: string) => {
        const newUser: User = {
            name,
            avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}/100/100`,
            totalKm: 0,
            avgAltitude: 0,
            avgTimeHr: 0,
            tripHistory: [],
            preferences: { difficulty: ['Easy', 'Medium', 'Hard'], scenery: [] },
            email: email,
            role: 'user',
        };
        console.log('[Auth] register:', name, email);
        setUser(newUser);
        setRole('user');
        setIsAuthenticated(true);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, isAuthenticated: true })); } catch {}
    };

    const updateProfile = (updates: Partial<User>) => {
        console.log('[Auth] updateProfile:', updates);
        setUser((prev: User | null) => {
            const updated = prev ? { ...prev, ...updates } : prev;
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updated, isAuthenticated })); } catch {}
            return updated;
        });
    };

    const logout = () => {
        console.log('[Auth] logout');
        setUser(null);
        setIsAuthenticated(false);
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

