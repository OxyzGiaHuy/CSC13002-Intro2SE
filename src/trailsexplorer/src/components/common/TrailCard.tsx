import * as React from 'react';
import type { Trail } from '../../types/index';
import { HeartIcon } from '../../data/constants';
import { Zap, Activity, Flame, Star } from 'lucide-react';

interface TrailCardProps {
    trail: Trail;
    onSelect: () => void;
    onToggleFavorite: (id: number | string) => void;
}

const formatDistance = (km: number) => {
    return km >= 1 ? `${km} km` : `${(km * 1000).toFixed(0)} m`;
};

const TrailCard: React.FC<TrailCardProps> = ({ trail, onSelect, onToggleFavorite }: TrailCardProps) => {
    const getDifficultyStyles = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-200',
                    icon: <Zap className="w-3.5 h-3.5 fill-emerald-500" />,
                    label: 'EASY'
                };
            case 'hard':
                return {
                    bg: 'bg-rose-50',
                    text: 'text-rose-700',
                    border: 'border-rose-200',
                    icon: <Flame className="w-3.5 h-3.5 fill-rose-500" />,
                    label: 'HARD'
                };
            default: // Moderate
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    border: 'border-amber-200',
                    icon: <Activity className="w-3.5 h-3.5" />,
                    label: 'MODERATE'
                };
        }
    };

    const diffStyles = getDifficultyStyles(trail.difficulty);

    return (
        <div
            onClick={onSelect}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer transform hover:-translate-y-1"
        >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={trail.imageUrl}
                    alt={trail.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Difficulty Badge */}
                <div className="absolute top-4 left-4">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border ${diffStyles.bg} ${diffStyles.text} ${diffStyles.border} shadow-sm`}>
                        {diffStyles.icon}
                        <span className="text-[10px] font-black tracking-widest leading-none mt-0.5">{diffStyles.label}</span>
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/20 shadow-lg">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-800">{trail.rating > 0 ? trail.rating.toFixed(1) : (4.5).toFixed(1)}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex-grow flex flex-col">
                <div className="mb-2">
                    <p className="text-xs font-semibold text-sage-green uppercase tracking-wider mb-1">{trail.location}</p>
                    <h3 className="text-xl font-bold font-display text-forest-green line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-green-800 transition-colors">
                        {trail.name}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Distance</span>
                            <span className="text-sm font-bold text-gray-700">{formatDistance(trail.length_km)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Duration</span>
                            <span className="text-sm font-bold text-gray-700">{trail.duration_hr} hr</span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(trail.id);
                        }}
                        className="p-2.5 rounded-full bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-all active:scale-90"
                    >
                        <HeartIcon className={`w-5 h-5 ${trail.isFavorited ? 'text-rose-500 fill-current' : ''}`} filled={trail.isFavorited} />
                    </button>
                </div>
            </div>

            {/* Hover Action Bar */}
            <div className="bg-forest-green text-white py-3 text-center text-sm font-bold transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                View Details
            </div>
        </div>
    );
};

export default TrailCard;


