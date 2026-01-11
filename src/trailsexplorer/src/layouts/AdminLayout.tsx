import React from 'react';
import { LayoutDashboard, Users, Home, LogOut, ShieldCheck, FileText, MessageSquare } from 'lucide-react';
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
        { label: 'Dashboard', view: 'admin_dashboard' as const, icon: LayoutDashboard },
        { label: 'Users', view: 'admin_users' as const, icon: Users },
        { label: 'Reviews Moderation', view: 'admin_reviews_moderation' as const, icon: FileText },
        { label: 'Posts Moderation', view: 'admin_posts_moderation' as const, icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm hidden md:flex">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-forest-green" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">Admin System</h1>
                        <p className="text-xs text-gray-500 font-medium">Trails Explorer</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Overview</p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.view;
                        return (
                            <button
                                key={item.view}
                                onClick={() => onNavigate(item.view)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-forest-green text-white shadow-md shadow-green-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-green-700'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-600'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 space-y-2">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                    <button
                        onClick={() => onNavigate('home')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-green-700 transition-colors font-medium"
                    >
                        <Home className="w-5 h-5 text-gray-400" /> Back to Home
                    </button>
                    <button
                        onClick={() => {
                            logout();
                            onNavigate('home');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5 text-red-400" /> Logout
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
