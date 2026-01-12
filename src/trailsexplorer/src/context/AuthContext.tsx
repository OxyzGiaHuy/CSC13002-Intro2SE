// @ts-nocheck
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../types/index';
// MOCK_USER might still be used for initial structure if backend doesn't return everything, 
// but ideally we map backend response to User type.
import { MOCK_USER } from '../data/constants';

interface AuthContextType {
    user: User | null;
    token: string | null; // Added
    isAuthenticated: boolean;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password?: string) => Promise<void>;
    updateProfile: (updates: Partial<User>) => void;
    language: string;
    setLanguage: (lang: string) => void;
    joinedGroups: any[];
    refreshGroups: () => Promise<void>;
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

// Ensure this matches your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token')); // Initialize from local storage
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); // Initialize from existence of token
    const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'en');
    const [joinedGroups, setJoinedGroups] = useState<any[]>([]);

    const refreshGroups = async () => {
        if (!localStorage.getItem('token')) return;
        try {
            const { getMyGroups } = await import('../services/communityService');
            const groups = await getMyGroups();
            setJoinedGroups(Array.isArray(groups) ? groups : []);
        } catch (error) {
            console.error('[Auth] Failed to refresh groups:', error);
        }
    };

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Check for existing token on mount (validation)
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
                setIsAuthenticated(true);
                refreshGroups();
            } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
                setIsAuthenticated(false);
            }
        }
    }, []);

    const login = async (email: string, password?: string) => {
        try {
            const loginUrl = `${API_URL}/auth/login`;
            console.log('[Auth] Attempting login at:', loginUrl);
            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: password || 'password123' })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Login failed');
            }

            const response = await res.json();
            // Backend returns: { success: true, message: '...', data: { user_id, username, full_name, email, role, token } }
            const { token: newToken, user_id, username, full_name, email: userEmail, role } = response.data;

            // Map backend data to frontend User type
            const userData: User = {
                ...MOCK_USER, // fallback for UI fields not yet in DB
                id: user_id?.toString(),
                name: full_name || username, // Display full_name in UI
                email: userEmail,
                role: (role || 'user').toLowerCase() as 'admin' | 'user'
            };

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setToken(newToken); // Update state
            setIsAuthenticated(true);
            refreshGroups();
        } catch (error) {
            console.error('[Auth] Login error:', error);
            throw error;
        }
    };

    const register = async (name: string, email: string, password?: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: name, email, password: password || 'password123' })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Registration failed');
            }

            // Success: Check email for verification link
            const data = await res.json();
            alert('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
            console.log('[Auth] Registration response:', data);

        } catch (error) {
            console.error('[Auth] Register error:', error);
            throw error;
        }
    };

    const updateProfile = (updates: Partial<User>) => {
        console.log('[Auth] updateProfile (Local Only for now):', updates);
        setUser((prev: User | null) => {
            if (!prev) return null;
            const newUser = { ...prev, ...updates };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
        // TODO: Call backend PUT /api/user/profile
    };

    const logout = () => {
        console.log('[Auth] logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null); // Clear state
        setIsAuthenticated(false);
        setJoinedGroups([]);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, register, updateProfile, language, setLanguage, joinedGroups, refreshGroups }}>
            {children}
        </AuthContext.Provider>
    );
};

