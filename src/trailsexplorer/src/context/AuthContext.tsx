// @ts-nocheck
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '../types/index';
// MOCK_USER might still be used for initial structure if backend doesn't return everything, 
// but ideally we map backend response to User type.
import { MOCK_USER } from '../data/constants';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password?: string) => Promise<void>;
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

// Ensure this matches your backend URL
const API_URL = '/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = async (email: string, password?: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
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
            const { token, user_id, username, full_name, email: userEmail, role } = response.data;

            // Map backend data to frontend User type
            const userData: User = {
                ...MOCK_USER, // fallback for UI fields not yet in DB
                id: user_id?.toString(),
                name: full_name || username, // Display full_name in UI
                email: userEmail,
                role: (role || 'user').toLowerCase() as 'admin' | 'user'
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsAuthenticated(true);
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
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

