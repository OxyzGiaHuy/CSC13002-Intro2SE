// @ts-nocheck
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types/index';
import { MOCK_USER } from '../data/constants';

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
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<'admin' | 'user'>('user');

    const login = (email: string) => {
        // Mock login logic: if email contains "admin", set role to admin
        const resolvedRole: 'admin' | 'user' = email.includes('admin') ? 'admin' : 'user';
        setRole(resolvedRole);
        const userData: User = { ...MOCK_USER, name: email.split('@')[0], email, role: resolvedRole };
        console.log('[Auth] login:', email, resolvedRole);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const register = (name: string, email?: string) => {
        const newUser: User = {
            ...MOCK_USER,
            name: name,
            tripHistory: [],
            totalKm: 0,
            email: email,
            role: 'user',
        };
        console.log('[Auth] register:', name, email);
        setUser(newUser);
        setRole('user');
        setIsAuthenticated(true);
    };

    const updateProfile = (updates: Partial<User>) => {
        console.log('[Auth] updateProfile:', updates);
        setUser((prev: User | null) => prev ? { ...prev, ...updates } : prev);
    };

    const logout = () => {
        console.log('[Auth] logout');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

