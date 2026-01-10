import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!name.trim() || !email.trim() || !password.trim()) {
                throw new Error('Vui lòng điền đầy đủ thông tin');
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
            setError(err.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl relative">
            <div className="flex items-center justify-center mb-6">
                <Logo imageSrc={logoImage} size="lg" showText={true} />
            </div>
            <h2 className="text-2xl font-bold text-center text-forest-green mb-6">Create Your Account</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                        disabled={loading}
                        className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        disabled={loading}
                        className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        disabled={loading}
                        className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" 
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button onClick={() => setAuthView('login')} className="font-medium text-sage-green hover:underline">Log in</button>
            </p>
        </div>
    );
};

export default RegisterPage;
