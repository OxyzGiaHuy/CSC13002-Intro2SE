import React, { useState } from 'react';
import type { View } from '../../types/view';
import Logo from '../../../components/Logo';
import logoImage from '../../../assets/logo.png';
import { MenuIcon, XIcon } from '../../data/constants';

export interface HeaderProps {
    setView: (view: View) => void;
    currentView: View;
    userRole?: string; // Keep userRole for admin dashboard link logic
}

const Header: React.FC<HeaderProps> = ({ setView, currentView, userRole }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navItems: { name: string, view: View }[] = [
        { name: 'Home', view: 'home' },
        { name: 'Discover', view: 'discover' },
        { name: 'AI Planner', view: 'planner' },
        { name: 'Community', view: 'community' },
        { name: 'Profile', view: 'profile' },
    ];

    if (userRole === 'admin') {
        navItems.push({ name: 'Dashboard', view: 'admin_dashboard' });
    }

    const NavLink: React.FC<{ view: View, name: string }> = ({ view, name }) => {
        let isActive = false;
        if (typeof currentView === 'string') {
            isActive = currentView === view;
        } else if (currentView.view === 'trailDetail' || currentView.view === 'mapView' || (typeof view === 'string' && (view === 'community' || view === 'profile'))) {
            let baseView: string = '';
            if (currentView.view === 'mapView') {
                baseView = currentView.fromTrailDetail.from;
            } else if (currentView.view === 'trailDetail') {
                baseView = currentView.from;
            }
            isActive = baseView === view;
        }

        return (
            <button onClick={() => { setView(view); setIsMenuOpen(false); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? 'bg-[#047857] text-white shadow-lg shadow-[#047857]/30' : 'text-[#0F172A] hover:bg-[#F0FDF4] hover:text-[#047857] hover:shadow-md'}`}
            >
                {name}
            </button>
        );
    };

    return (
        <header className="bg-white/95 backdrop-blur-lg border-b border-[#DCFCE7]/40 sticky top-0 z-50 transition-all duration-300 shadow-lg shadow-[#047857]/5">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="cursor-pointer" onClick={() => setView('home')}>
                        <Logo imageSrc={logoImage} size="md" showText={true} />
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map(item => <NavLink key={item.name} {...item} />)}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-[#047857] hover:text-[#10B981] hover:bg-[#F0FDF4] focus:outline-none transition-colors">
                            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map(item => <NavLink key={item.name} {...item} />)}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

