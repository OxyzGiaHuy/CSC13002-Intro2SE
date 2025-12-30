import React from 'react';
import type { View } from '../types/view';
import type { Trail } from '../types/index';
import TrailCard from '../components/common/TrailCard';

export interface HomeProps {
  setView: (view: View) => void;
  trails: Trail[];
  onSelectTrail: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const Home: React.FC<HomeProps> = ({ setView, trails, onSelectTrail, onToggleFavorite }) => {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg mb-8" style={{ backgroundImage: "url('https://picsum.photos/seed/herobg/1200/400')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="bg-black bg-opacity-40 p-6 rounded-lg">
                    <h1 className="text-5xl font-display text-white mb-4">Find Your Next Adventure</h1>
                    <p className="text-xl text-gray-200 mb-6">Let our AI assistant plan the perfect trek for you.</p>
                    <button onClick={() => setView('planner')} className="bg-sage-green text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105">
                        Plan My Trip
                    </button>
                </div>
            </div>

            <h2 className="text-3xl font-display text-forest-green mb-6">Featured Trails</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trails.slice(0, 3).map(trail => (
                    <TrailCard key={trail.id} trail={trail} onSelect={() => onSelectTrail(trail.id)} onToggleFavorite={onToggleFavorite} />
                ))}
            </div>
        </div>
    );
};

export default Home;

