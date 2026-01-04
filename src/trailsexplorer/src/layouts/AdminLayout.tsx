import React from 'react';
import { View } from '../types/view';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
    children: React.ReactNode;
    currentView: View;
    onNavigate: (view: View) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, onNavigate }) => {
    const { logout } = useAuth();

    const menuItems = [
        { label: 'Dashboard', view: 'admin_dashboard' as const, icon: '📊' },
        { label: 'Users', view: 'admin_users' as const, icon: '👥' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-forest-green text-white flex flex-col">
                <div className="p-6 border-b border-sage-green">
                    <h1 className="text-2xl font-display font-bold">Admin Panel</h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => onNavigate(item.view)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                currentView === item.view 
                                    ? 'bg-sage-green text-white font-medium' 
                                    : 'hover:bg-sage-green/50 text-gray-100'
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-sage-green space-y-2">
                    <button
                        onClick={() => onNavigate('home')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sage-green/50 text-gray-100 transition-colors"
                    >
                        <span>🏠</span> Back to Home
                    </button>
                    <button
                        onClick={() => {
                            logout();
                            onNavigate('home');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600/50 text-red-100 transition-colors"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
