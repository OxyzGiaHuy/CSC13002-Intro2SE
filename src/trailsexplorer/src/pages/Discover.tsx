import React, { useState, useEffect } from 'react';
import type { Trail } from '../types/index';
import TrailCard from '../components/common/TrailCard';
import { getTrails } from '../services/trailService';

export interface DiscoverProps {
    onSelectTrail: (id: number) => void;
    onToggleFavorite: (id: number) => void;
    initialTrails?: Trail[]; // renamed to avoid shadowing the local state
}

const Discover: React.FC<DiscoverProps> = ({ onSelectTrail, onToggleFavorite, initialTrails }) => {
    const [trails, setTrails] = useState<Trail[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (trails && trails.length) {
                // parent App already provides normalized trails — use directly
                setTrails(trails);
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
                setTrails(normalized as Trail[]);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to load trails');
            setTrails([]);
        }
        setIsLoading(false);
    };

    useEffect(() => { load(); }, [initialTrails]);

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
                            <TrailCard key={key} trail={trail} onSelect={onSelectTrail} onToggleFavorite={onToggleFavorite} />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Discover;

