import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../../components/Logo';
import logoImage from '../../assets/logo.png';
import type { AuthView } from '../types/view';

const LoginPage: React.FC<{ setAuthView: (v: AuthView) => void }> = ({ setAuthView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter email');
            return;
        }
        // Mock validation: accept any password
        auth.login(email);
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl relative">
             <div className="flex items-center justify-center mb-6">
                <Logo imageSrc={logoImage} size="lg" showText={true} />
            </div>
            <h2 className="text-2xl font-bold text-center text-forest-green mb-6">Welcome Back</h2>
            {error && <p className="bg-red-100 text-red-700 p-2 rounded-md mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <button type="submit" className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">Login</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button onClick={() => setAuthView('register')} className="font-medium text-sage-green hover:underline">Sign up</button>
            </p>
        </div>
    );
};

export default LoginPage;
