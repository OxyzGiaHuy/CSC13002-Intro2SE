import React, { useState } from 'react';
import type { Trail } from '../types/index';
import TrailCard from '../components/common/TrailCard';

export interface DiscoverProps {
  trails: Trail[];
  onSelectTrail: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const Discover: React.FC<DiscoverProps> = ({ trails, onSelectTrail, onToggleFavorite }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

    const filteredTrails = trails
        .filter(trail => trail.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(trail => difficultyFilter === 'all' || trail.difficulty.toLowerCase() === difficultyFilter);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-display text-forest-green mb-6 text-center">Discover Trails</h2>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search for a trail..."
                    className="flex-grow p-2 border bg-white border-gray-300 rounded-lg shadow-sm focus:ring-sage-green focus:border-sage-green"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="p-2 border bg-white border-gray-300 rounded-lg shadow-sm focus:ring-sage-green focus:border-sage-green"
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTrails.map(trail => (
                    <TrailCard key={trail.id} trail={trail} onSelect={() => onSelectTrail(trail.id)} onToggleFavorite={onToggleFavorite} />
                ))}
            </div>
        </div>
    );
};

export default Discover;

