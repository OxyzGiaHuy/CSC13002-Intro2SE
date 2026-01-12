import React from 'react';
import type { View } from '../types/view';
import type { Trail } from '../types/index';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../data/i18n';
import TrailCard from '../components/common/TrailCard';

export interface HomeProps {
    setView: (view: View) => void;
    trails: Trail[];
    onSelectTrail: (id: number) => void;
    onToggleFavorite: (id: number | string) => void;
}

const Home: React.FC<HomeProps> = ({ setView, trails, onSelectTrail, onToggleFavorite }) => {
    const auth = useAuth();
    const lang = auth?.language || 'en';
    const T = useTranslations(lang);
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4]">
            {/* Hero Section */}
            <div className="relative h-[500px] flex items-center justify-center text-center px-4 bg-gradient-to-r from-[#047857] to-[#10B981]">
                <div
                    className="absolute inset-0 z-0 opacity-60"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/40 z-10"></div>

                <div className="relative z-20 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white drop-shadow-lg tracking-tight">
                        {T.home.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto font-light leading-relaxed">
                        {T.home.subtitle}
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => setView('planner')}
                            className="bg-white text-[#047857] font-bold py-4 px-10 rounded-full hover:bg-[#F0FDF4] transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                        >
                            {T.home.explore}
                        </button>
                        <button
                            onClick={() => setView('discover')}
                            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold py-4 px-10 rounded-full hover:bg-white/20 transition-all duration-300 text-lg"
                        >
                            {T.discover.title}
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-end justify-between mb-10 border-b-2 border-[#047857]/20 pb-4">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-[#047857]">{T.home.featured}</h2>
                        <p className="text-[#047857]/60 mt-2">{T.home.subtitle}</p>
                    </div>
                    <button onClick={() => setView('discover')} className="text-[#10B981] hover:text-[#047857] font-semibold hidden md:block transition-colors">
                        {T.home.viewMore} →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trails.slice(0, 3).map(trail => (
                        <TrailCard key={trail.id} trail={trail} onSelect={() => onSelectTrail(trail.id)} onToggleFavorite={onToggleFavorite} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;

