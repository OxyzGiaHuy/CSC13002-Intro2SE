// @ts-nocheck
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

const TOKEN_KEY = 'trails_explorer_token';
const USER_KEY = 'trails_explorer_user';

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
                try { localStorage.setItem(USER_KEY, JSON.stringify(usr)); } catch (e) {}
                setUser(usr);
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
                try { localStorage.setItem(USER_KEY, JSON.stringify(usr)); } catch (e) {}
                setUser(usr);
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
        try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch (e) {}
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

