import React, { useState, useEffect } from 'react';
import type { Trail } from '../types/index';
import TrailCard from '../components/common/TrailCard';
import { getTrails } from '../services/trailService';

export interface DiscoverProps {
  onSelectTrail: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const Discover: React.FC<DiscoverProps> = ({ onSelectTrail, onToggleFavorite }) => {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getTrails();
            setTrails(data);
        } catch (err: any) {
            setError(err?.message || 'Failed to load trails');
            setTrails([]);
        }
        setIsLoading(false);
    };

    useEffect(() => { load(); }, []);

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
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            {isLoading && <div className="text-center p-8">Loading trails…</div>}
            {error && (
                <div className="text-center p-6">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button onClick={load} className="px-4 py-2 bg-sage-green text-white rounded-md">Retry</button>
                </div>
            )}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTrails.map(trail => (
                        <TrailCard key={trail.id} trail={trail} onSelect={() => onSelectTrail(trail.id)} onToggleFavorite={onToggleFavorite} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Discover;

