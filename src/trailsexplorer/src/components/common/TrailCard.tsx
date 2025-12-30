import React from 'react';
import type { Trail } from '../../types/index';
import { HeartIcon } from '../../data/constants';

export interface TrailCardProps {
  trail: Trail;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const TrailCard: React.FC<TrailCardProps> = ({ trail, onSelect, onToggleFavorite }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <div className="relative">
                <img src={trail.imageUrl} alt={trail.name} className="w-full h-48 object-cover" />
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(trail.id); }}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                    aria-label={trail.isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                    <HeartIcon className="w-6 h-6 text-red-500" filled={trail.isFavorited} />
                </button>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold font-display text-forest-green">{trail.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{trail.location}</p>
                <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-white ${trail.difficulty === 'Easy' ? 'bg-green-500' : trail.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {trail.difficulty}
                    </span>
                    <span className="font-semibold text-earth-brown">{trail.rating} ★</span>
                </div>
                <button onClick={() => onSelect(trail.id)} className="mt-4 w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default TrailCard;

