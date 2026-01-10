import React from 'react';
import type { View } from '../types/view';
import type { Trail } from '../types/index';
import TrailCard from '../components/common/TrailCard';

export interface HomeProps {
    setView: (view: View) => void;
    trails: Trail[];
    onSelectTrail: (id: number) => void;
    onToggleFavorite: (id: number | string) => void;
}

const Home: React.FC<HomeProps> = ({ setView, trails, onSelectTrail, onToggleFavorite }) => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[500px] flex items-center justify-center text-center px-4 bg-gray-900">
                <div
                    className="absolute inset-0 z-0 opacity-60"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10"></div>

                <div className="relative z-20 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white drop-shadow-lg tracking-tight">
                        Discover the <span className="text-sage-green">Wild</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Your intelligent companion for every step of the journey. Plan, track, and explore with confidence.
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => setView('planner')}
                            className="bg-sage-green text-white font-bold py-4 px-10 rounded-full hover:bg-forest-green transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-900/20 text-lg"
                        >
                            Plan My Trip
                        </button>
                        <button
                            onClick={() => setView('discover')}
                            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold py-4 px-10 rounded-full hover:bg-white/20 transition-all duration-300 text-lg"
                        >
                            Explore Trails
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-forest-green">Featured Trails</h2>
                        <p className="text-gray-500 mt-2">Curated selection of best rated adventures this week</p>
                    </div>
                    <button onClick={() => setView('discover')} className="text-sage-green hover:text-forest-green font-semibold hidden md:block">
                        View All →
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

