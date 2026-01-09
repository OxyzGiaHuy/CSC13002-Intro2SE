import React, { useState } from 'react';
import type { Trail } from '../types/index';
import TrailCard from '../components/common/TrailCard';
import { Search, ChevronDown, Filter } from 'lucide-react';

export interface DiscoverProps {
    trails: Trail[];
    onSelectTrail: (id: number) => void;
    onToggleFavorite: (id: number) => void;
}

const Discover: React.FC<DiscoverProps> = ({ trails, onSelectTrail, onToggleFavorite }: DiscoverProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

    const filteredTrails = trails
        .filter(trail => trail.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(trail => difficultyFilter === 'all' || trail.difficulty.toLowerCase() === difficultyFilter);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-display font-bold text-forest-green mb-8 text-center tracking-tight">Explore the Great Outdoors</h2>

            {/* Premium Search & Filter Bar */}
            <div className="max-w-4xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-2xl shadow-xl shadow-green-900/5 border border-gray-100">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for a trail..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-sage-green transition-all placeholder:text-gray-400 text-gray-700"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative md:w-64">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <Filter className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            className="w-full pl-10 pr-10 py-3 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-sage-green transition-all appearance-none text-gray-700 font-medium cursor-pointer"
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                        >
                            <option value="all">Every Difficulty</option>
                            <option value="easy">Easy Level</option>
                            <option value="moderate">Moderate Level</option>
                            <option value="hard">Hard Level</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {searchTerm || difficultyFilter !== 'all' ? (
                    <p className="mt-4 text-sm text-gray-500 text-center">
                        Found <span className="font-bold text-sage-green">{filteredTrails.length}</span> {filteredTrails.length === 1 ? 'trail' : 'trails'} matching your search
                    </p>
                ) : null}
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

