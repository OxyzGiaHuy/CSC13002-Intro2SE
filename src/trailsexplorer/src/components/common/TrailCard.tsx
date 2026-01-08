import React from 'react';
import type { Trail } from '../../types/index';
import { HeartIcon } from '../../data/constants';
// Use a bundler-managed asset as a reliable fallback so the dev server serves an actual image
import fallbackImg from '../../../assets/logo.png';

export interface TrailCardProps {
  trail: Trail;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const TrailCard: React.FC<TrailCardProps> = ({ trail, onSelect, onToggleFavorite }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full group">
            <div className="relative">
                <img
                    src={trail.imageUrl || fallbackImg}
                    alt={trail.name}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover flex-shrink-0"
                    loading="lazy"
                    onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        // Prevent infinite loop if the fallback is missing or also fails.
                        if (img.dataset.errorHandled === 'true') {
                            img.onerror = null;
                            return;
                        }
                        img.dataset.errorHandled = 'true';
                        img.src = fallbackImg as unknown as string;
                    }}
                />
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(trail.id); }}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                    aria-label={trail.isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                    <HeartIcon className="w-6 h-6 text-red-500" filled={trail.isFavorited} />
                </button>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex flex-col min-h-14">
                    <h3 title={trail.name} className="text-xl font-bold font-display text-forest-green leading-tight mb-1 truncate">{trail.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 break-words">{trail.location}</p>
                </div>

                <div className="mt-2 mb-4 flex items-center justify-between text-sm gap-4 h-8">
                    <span className={`px-3 py-1 rounded-full text-white text-xs ${trail.difficulty === 'Easy' ? 'bg-green-500' : trail.difficulty === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {trail.difficulty}
                    </span>
                    <span className="font-semibold text-earth-brown text-sm flex-none">{trail.rating} ★</span>
                </div>

                <button onClick={() => onSelect(trail.id)} className="mt-auto w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default React.memo(TrailCard);

