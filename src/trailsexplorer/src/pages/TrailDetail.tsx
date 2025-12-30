import React from 'react';
import type { Trail } from '../types/index';
import { 
    ArrowLeftIcon, 
    HeartIcon, 
    MapIcon, 
    SunIcon, 
    CloudIcon, 
    LightningBoltIcon 
} from '../data/constants';
import { MOCK_WEATHER } from '../data/constants';

export interface TrailDetailProps {
  trailId: number;
  onBack: () => void;
  trails: Trail[];
  onToggleFavorite: (id: number) => void;
  onSelectMap: (id: number) => void;
}

const TrailDetail: React.FC<TrailDetailProps> = ({ trailId, onBack, trails, onToggleFavorite, onSelectMap }) => {
    const trail = trails.find(t => t.id === trailId);
    if (!trail) return <div className="p-8 text-center">Trail not found.</div>;

    const WeatherIcon = ({ condition }: { condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' }) => {
        switch (condition) {
            case 'Sunny': return <SunIcon className="w-8 h-8 text-yellow-500" />;
            case 'Cloudy': return <CloudIcon className="w-8 h-8 text-gray-500" />;
            case 'Rainy': return <CloudIcon className="w-8 h-8 text-blue-500" />; // Simplified
            case 'Stormy': return <LightningBoltIcon className="w-8 h-8 text-yellow-600" />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <button onClick={onBack} className="flex items-center gap-2 text-sage-green mb-4 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" /> Back to list
            </button>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="relative">
                    <img src={trail.imageUrl} alt={trail.name} className="w-full h-64 md:h-96 object-cover" />
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                        <h1 className="text-4xl font-display text-white">{trail.name}</h1>
                        <p className="text-lg text-gray-200">{trail.location}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(trail.id); }}
                        className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg"
                        aria-label={trail.isFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                        <HeartIcon className="w-8 h-8 text-red-500" filled={trail.isFavorited} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6 border-b pb-6">
                        <div><p className="text-sm text-gray-500">Difficulty</p><p className="font-bold text-lg">{trail.difficulty}</p></div>
                        <div><p className="text-sm text-gray-500">Length</p><p className="font-bold text-lg">{trail.length_km} km</p></div>
                        <div><p className="text-sm text-gray-500">Duration</p><p className="font-bold text-lg">{trail.duration_hr} hr</p></div>
                        <div><p className="text-sm text-gray-500">Rating</p><p className="font-bold text-lg">{trail.rating} ★</p></div>
                    </div>

                    <button onClick={() => onSelectMap(trail.id)} className="w-full bg-earth-brown text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors mb-6 flex items-center justify-center gap-2 text-lg">
                        <MapIcon className="w-6 h-6" /> View on Map
                    </button>

                    <div className="mb-6">
                        <h3 className="text-2xl font-display text-forest-green mb-2">Description</h3>
                        <p className="text-gray-700">{trail.description}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-2xl font-display text-forest-green mb-2">Scenery</h3>
                        <div className="flex flex-wrap gap-2">
                            {trail.scenery.map(s => <span key={s} className="bg-light-tan text-earth-brown px-3 py-1 rounded-full text-sm">{s}</span>)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-display text-forest-green mb-4">Weather Forecast</h3>
                            <div className="space-y-3">
                                {MOCK_WEATHER.map(w => (
                                    <div key={w.day} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <p className="font-semibold">{w.day}</p>
                                        <div className="flex items-center gap-2">
                                            <p>{w.temp_c}°C</p>
                                            <WeatherIcon condition={w.condition} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-display text-forest-green mb-4">Reviews</h3>
                            <div className="space-y-4">
                                {trail.reviews.map(r => (
                                    <div key={r.username} className="flex gap-3">
                                        <img src={r.avatarUrl} alt={r.username} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold">{r.username} <span className="font-normal text-yellow-500">{r.rating} ★</span></p>
                                            <p className="text-gray-600">{r.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrailDetail;

