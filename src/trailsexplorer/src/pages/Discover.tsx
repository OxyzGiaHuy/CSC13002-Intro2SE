import React, { useState, useEffect } from 'react';
import type { Trail } from '../types/index';
import TrailCard from '../components/common/TrailCard';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { getTrails } from '../services/trailService';

export interface DiscoverProps {
    initialTrails?: Trail[];
    onSelectTrail: (id: number) => void;
    onToggleFavorite: (id: number | string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ initialTrails = [], onSelectTrail, onToggleFavorite }: DiscoverProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [localTrails, setLocalTrails] = useState<Trail[]>(initialTrails || []);

    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (initialTrails && initialTrails.length) {
                // parent App already provides normalized trails — use directly
                setLocalTrails(initialTrails);
            } else {
                const data = await getTrails();
                // normalize backend rows into frontend-friendly shape
                const normalized = Array.isArray(data) ? data.map((t: any, i: number) => ({
                    id: t.id ?? t.trail_id ?? (t as any)?._id ?? i,
                    name: t.name,
                    description: t.description,
                    short_description: t.short_description,
                    difficulty: (function(d:any){ if(!d) return 'Unknown'; const m = String(d).toLowerCase(); if(m==='easy' || m==='easier' || m==='1') return 'Easy'; if(m.includes('moder')) return 'Moderate'; if(m.includes('hard')) return 'Hard'; return d; })(t.difficulty || t.category_id),
                    length_km: parseFloat(t.length_km) || parseFloat(t.length || 0) || 0,
                    duration_hr: t.duration_hr ?? t.estimated_duration_hours ?? t.duration ?? null,
                    rating: parseFloat(t.rating ?? t.avg_rating ?? 0) || 0,
                    location: [t.location_region, t.location_province, t.location_district].filter(Boolean).join(', '),
                    imageUrl: t.imageUrl ?? t.image_url ?? t.cover_image_url ?? null,
                    scenery: t.scenery || t.features || t.tags || [],
                    reviews: t.reviews || []
                })) : [];
                setLocalTrails(normalized as Trail[]);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load trails');
            setLocalTrails([]);
        }
        setIsLoading(false);
    };

    useEffect(() => { load(); }, [initialTrails]);

    const filteredTrails = localTrails
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

            {isLoading && <div className="text-center p-8">Loading trails…</div>}
            {error && (
                <div className="text-center p-6">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button onClick={load} className="px-4 py-2 bg-sage-green text-white rounded-md">Retry</button>
                </div>
            )}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {Array.isArray(filteredTrails) && filteredTrails.map((trail, idx) => {
                        const key = (trail as any)?.id ?? (trail as any)?._id ?? idx;
                        if (!((trail as any)?.id)) console.warn('[Discover] trail missing id, using index as key', trail);
                        return (
                            <TrailCard key={key} trail={trail} onSelect={() => onSelectTrail((trail as any).id)} onToggleFavorite={onToggleFavorite} />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Discover;

