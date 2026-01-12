import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../data/i18n';
import Logo from '../../components/Logo';
import logoImage from '../../assets/logo.png';
import type { AuthView } from '../types/view';

const RegisterPage: React.FC<{ setAuthView: (v: AuthView) => void }> = ({ setAuthView }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const lang = auth?.language || 'en';
    const T = useTranslations(lang);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!name.trim() || !email.trim() || !password.trim()) {
                throw new Error(T.profile.error.nameEmpty || 'Please fill in all fields');
            }
            
            await auth.register(name, email, password);
            // Clear form on success
            setName('');
            setEmail('');
            setPassword('');
            // Optionally redirect to login after success
            setTimeout(() => setAuthView('login'), 2000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || T.common.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-[#F1F5E8] relative">
            <div className="flex items-center justify-center mb-6">
                <Logo imageSrc={logoImage} size="lg" showText={true} />
            </div>
            <h2 className="text-3xl font-bold text-center text-[#1A5D1A] mb-2">{T.nav.register}</h2>
            <p className="text-center text-[#0F172A]/60 mb-6 text-sm">{T.auth.signupWelcome || 'Join Trails Explorer today'}</p>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.common.welcome}</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                        disabled={loading}
                        className="w-full px-4 py-3 border-2 border-[#F1F5E8] rounded-lg focus:border-[#1A5D1A] focus:ring-2 focus:ring-[#E8F0E0] outline-none transition-all bg-gradient-to-r from-[#F1F5E8] to-[#E8F0E0] disabled:opacity-50" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.auth.email || 'Email Address'}</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        disabled={loading}
                        className="w-full px-4 py-3 border-2 border-[#F1F5E8] rounded-lg focus:border-[#1A5D1A] focus:ring-2 focus:ring-[#E8F0E0] outline-none transition-all bg-gradient-to-r from-[#F1F5E8] to-[#E8F0E0] disabled:opacity-50" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.auth.password || 'Password'}</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        disabled={loading}
                        className="w-full px-4 py-3 border-2 border-[#F1F5E8] rounded-lg focus:border-[#1A5D1A] focus:ring-2 focus:ring-[#E8F0E0] outline-none transition-all bg-gradient-to-r from-[#F1F5E8] to-[#E8F0E0] disabled:opacity-50" 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#1A5D1A] to-[#4E9F3D] text-white py-3 rounded-lg hover:shadow-lg font-bold transition-all uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? `${T.common.loading}...` : T.nav.register}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-[#0F172A]/60">
                {T.auth.alreadyHave || 'Already have an account?'}{' '}
                <button 
                    onClick={() => setAuthView('login')} 
                    className="font-bold text-[#1A5D1A] hover:text-[#4E9F3D] transition-colors"
                >
                    {T.nav.login}
                </button>
            </p>
        </div>
    );
};

export default RegisterPage;
