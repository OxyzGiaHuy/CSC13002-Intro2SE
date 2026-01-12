import React, { useState } from 'react';
import type { Trail } from '../types/index';
import TrailCard from '../components/common/TrailCard';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../data/i18n';

export interface DiscoverProps {
    trails: Trail[];
    onSelectTrail: (id: number) => void;
    onToggleFavorite: (id: number | string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ trails, onSelectTrail, onToggleFavorite }: DiscoverProps) => {
    const auth = useAuth();
    const lang = auth?.language || 'en';
    const T = useTranslations(lang);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

    const filteredTrails = trails
        .filter(trail => trail.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(trail => difficultyFilter === 'all' || trail.difficulty.toLowerCase() === difficultyFilter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F1F5E8] via-white to-[#F1F5E8]">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1A5D1A] mb-4">{T.discover.filters}</h2>
                    <p className="text-[#0F172A]/60 text-lg">{T.home.subtitle}</p>
                </div>

                {/* Premium Search & Filter Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-2xl shadow-xl shadow-[#1A5D1A]/10 border-2 border-[#F1F5E8]">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A5D1A]/40" />
                            <input
                                type="text"
                                placeholder={T.home.searchPlaceholder}
                                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-[#F1F5E8] to-[#E8F0E0] border-none rounded-xl focus:ring-2 focus:ring-[#1A5D1A] outline-none transition-all placeholder:text-[#0F172A]/40 text-[#0F172A] font-medium"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="relative md:w-64">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                <Filter className="w-4 h-4 text-[#1A5D1A]/40" />
                            </div>
                            <select
                                className="w-full pl-10 pr-10 py-3 bg-gradient-to-r from-[#F1F5E8] to-[#E8F0E0] border-none rounded-xl focus:ring-2 focus:ring-[#1A5D1A] outline-none transition-all appearance-none text-[#0F172A] font-bold cursor-pointer"
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                            >
                                <option value="all">{T.discover.all}</option>
                                <option value="easy">{T.discover.easy}</option>
                                <option value="moderate">{T.discover.moderate}</option>
                                <option value="hard">{T.discover.hard}</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A5D1A]/40 pointer-events-none" />
                        </div>
                    </div>

                    {searchTerm || difficultyFilter !== 'all' ? (
                        <p className="mt-4 text-sm text-[#0F172A]/60 text-center">
                            {T.discover.noResults} <span className="font-bold text-[#1A5D1A]">{filteredTrails.length}</span> {filteredTrails.length === 1 ? 'trail' : T.discover.noResults}
                        </p>
                    ) : null}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTrails.length > 0 ? filteredTrails.map(trail => (
                        <TrailCard key={trail.id} trail={trail} onSelect={() => onSelectTrail(trail.id)} onToggleFavorite={onToggleFavorite} />
                    )) : (
                        <div className="col-span-full text-center py-16">
                            <p className="text-xl text-[#0F172A]/60 mb-2">{T.discover.noResults}</p>
                            <p className="text-sm text-[#0F172A]/40">{T.home.subtitle}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;

