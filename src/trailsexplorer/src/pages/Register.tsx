import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../../components/Logo';
import logoImage from '../../assets/logo.png';
import type { AuthView } from '../types/view';

const RegisterPage: React.FC<{ setAuthView: (v: AuthView) => void }> = ({ setAuthView }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalName = name || 'New Trekker';
        try {
            await auth.register(finalName, email, password);
        } catch (err: any) {
            // Ideally we should have an error state here too, but for now log/alert
            console.error(err);
            alert(err.message || 'Registration failed');
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl relative">
            <div className="flex items-center justify-center mb-6">
                <Logo imageSrc={logoImage} size="lg" showText={true} />
            </div>
            <h2 className="text-2xl font-bold text-center text-forest-green mb-6">Create Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <button type="submit" className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">Create Account</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button onClick={() => setAuthView('login')} className="font-medium text-sage-green hover:underline">Log in</button>
            </p>
        </div>
    );
};

export default RegisterPage;
