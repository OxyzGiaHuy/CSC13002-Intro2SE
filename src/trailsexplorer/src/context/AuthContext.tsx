import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '../types/index';
import { MOCK_USER } from '../data/constants';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    register: (name: string) => void;
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

    const login = (email: string) => {
        // Mock login logic: if email contains "admin", set role to admin
        const role = email.includes('admin') ? 'admin' : 'user';
        const userData: User = { ...MOCK_USER, name: email.split('@')[0] };
        setUser(userData);
        setIsAuthenticated(true);
    };

    const register = (name: string) => {
        const newUser: User = {
            ...MOCK_USER,
            name: name,
            tripHistory: [],
            totalKm: 0,
        };
        setUser(newUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

