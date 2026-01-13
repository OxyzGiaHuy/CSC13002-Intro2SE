import React, { useState } from 'react';
import type { View } from '../../types/view';
import Logo from '../../../components/Logo';
import logoImage from '../../../assets/logo.png';
import { MenuIcon, XIcon } from '../../data/constants';

import { useAuth } from '../../context/AuthContext';
import { useTranslations } from '../../data/i18n';

export interface HeaderProps {
    setView: (view: View) => void;
    currentView: View;
    userRole?: string; // Keep userRole for admin dashboard link logic
}

const Header: React.FC<HeaderProps> = ({ setView, currentView, userRole }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { language } = useAuth();
    const T = useTranslations(language || 'en');

    const navItems: { name: string, view: View }[] = [
        { name: T.nav.home, view: 'home' },
        { name: T.nav.discover, view: 'discover' },
        { name: T.nav.planner, view: 'planner' },
        { name: T.nav.community, view: 'community' },
        { name: T.nav.profile, view: 'profile' },
    ];

    if (userRole === 'admin') {
        navItems.push({ name: T.nav.admin, view: 'admin_dashboard' });
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive ? 'bg-forest-green text-white shadow-md shadow-green-100' : 'text-gray-600 hover:bg-green-50 hover:text-forest-green'}`}
            >
                {name}
            </button>
        );
    };

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="cursor-pointer" onClick={() => setView('home')}>
                        <Logo imageSrc={logoImage} size="md" showText={false} />
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map(item => <NavLink key={item.name} {...item} />)}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-forest-green hover:text-sage-green focus:outline-none">
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

