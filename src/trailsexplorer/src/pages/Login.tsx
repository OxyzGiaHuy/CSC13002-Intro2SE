import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../data/i18n';
import Logo from '../../components/Logo';
import logoImage from '../../assets/logo.png';
import type { AuthView } from '../types/view';

const LoginPage: React.FC<{ setAuthView: (v: AuthView) => void }> = ({ setAuthView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();
    const lang = auth?.language || 'en';
    const T = useTranslations(lang);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email) {
            setError(T.profile.error.nameEmpty || 'Please enter email');
            return;
        }
        try {
            await auth.login(email, password);
        } catch (err: any) {
            setError(err.message || T.common.error);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-[#F0F9FF] relative">
            <div className="flex items-center justify-center mb-6">
                <Logo imageSrc={logoImage} size="lg" showText={true} />
            </div>
            <h2 className="text-3xl font-bold text-center text-[#0EA5E9] mb-2">{T.nav.login}</h2>
            <p className="text-center text-[#0F172A]/60 mb-6 text-sm">{T.auth.loginWelcome || 'Welcome back to Trails Explorer'}</p>
            {error && <p className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-center border-2 border-red-200 text-sm font-medium">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.auth.email || 'Email Address'}</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border-2 border-[#F0F9FF] rounded-lg focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#E0F2FE] outline-none transition-all bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE]" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.auth.password || 'Password'}</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border-2 border-[#F0F9FF] rounded-lg focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#E0F2FE] outline-none transition-all bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE]" 
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white py-3 rounded-lg hover:shadow-lg font-bold transition-all uppercase tracking-wide"
                >
                    {T.nav.login}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-[#0F172A]/60">
                {T.auth.noAccount || "Don't have an account?"}{' '}
                <button 
                    onClick={() => setAuthView('register')} 
                    className="font-bold text-[#0EA5E9] hover:text-[#0284C7] transition-colors"
                >
                    {T.nav.register}
                </button>
            </p>
        </div>
    );
};

export default LoginPage;
