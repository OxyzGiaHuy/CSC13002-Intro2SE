import React from 'react';
import type { Trail } from '../types/index';
import { getTrailById } from '../services/trailService';
import {
    ArrowLeftIcon,
    HeartIcon,
    MapIcon,
    SunIcon,
    CloudIcon,
    LightningBoltIcon
} from '../data/constants';
import { MOCK_WEATHER } from '../data/constants';
import { Zap, Activity, Flame, Star, Map as LucideMap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../data/i18n';

export interface TrailDetailProps {
    trailId: number;
    onBack: () => void;
    trails: Trail[];
    onToggleFavorite: (id: number) => void;
    onSelectMap: (id: number) => void;
}

const TrailDetail: React.FC<TrailDetailProps> = ({ trailId, onBack, trails, onToggleFavorite, onSelectMap }) => {
    const auth = useAuth();
    const lang = auth?.language || 'en';
    const T = useTranslations(lang);
    // Initial trail from props (might have partial data)
    const initialTrail = trails.find(t => t.id === trailId);
    const [trail, setTrail] = React.useState<Trail | undefined>(initialTrail);

    React.useEffect(() => {
        const fetchDetail = async () => {
            if (trailId) {
                const detailedTrail = await getTrailById(trailId);
                if (detailedTrail) {
                    setTrail(detailedTrail);
                }
            }
        };
        fetchDetail();
    }, [trailId]);

    if (!trail) return <div className="p-8 text-center text-[#0F172A]/60">{T.discover.noResults}</div>;

    const getDifficultyStyles = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return {
                    badge: 'bg-[#DCFCE7] text-[#047857] border-[#047857]',
                    icon: <Zap className="w-4 h-4 text-[#047857] fill-[#047857]" />,
                    text: 'text-[#047857]'
                };
            case 'hard':
                return {
                    badge: 'bg-red-50 text-red-600 border-red-200',
                    icon: <Flame className="w-4 h-4 text-red-500 fill-red-500" />,
                    text: 'text-red-500'
                };
            default:
                return {
                    badge: 'bg-amber-50 text-amber-600 border-amber-200',
                    icon: <Activity className="w-4 h-4 text-amber-500" />,
                    text: 'text-amber-500'
                };
        }
    };

    const diffStyles = getDifficultyStyles(trail.difficulty);

    const WeatherIcon = ({ condition }: { condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' }) => {
        switch (condition) {
            case 'Sunny': return <SunIcon className="w-6 h-6 text-yellow-500" />;
            case 'Cloudy': return <CloudIcon className="w-6 h-6 text-gray-400" />;
            case 'Rainy': return <CloudIcon className="w-6 h-6 text-blue-400" />;
            case 'Stormy': return <LightningBoltIcon className="w-6 h-6 text-yellow-600" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#F0FDF4] pb-16">
            {/* Immersive Hero Section */}
            <div className="relative h-[60vh] w-full">
                <img src={trail.imageUrl} alt={trail.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                {/* Navbar Placeholder/Back Button */}
                <div className="absolute top-0 left-0 p-6 z-10">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all backdrop-blur-sm font-medium">
                        <ArrowLeftIcon className="w-5 h-5" /> {T.common.back || 'Back'}
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container mx-auto">
                        <div className="max-w-4xl">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 mb-4 text-xs font-bold tracking-widest uppercase backdrop-blur-md rounded-full border shadow-2xl ${diffStyles.badge}`}>
                                {diffStyles.icon}
                                <span>{trail.difficulty} {T.trailDetail.difficulty || 'Level'}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 leading-tight">
                                {trail.name}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 flex items-center gap-2">
                                <MapIcon className="w-5 h-5 text-[#047857]" /> {trail.location}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Favorite Button (Floating) */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(trail.id); }}
                    className="absolute bottom-[-28px] right-8 md:right-16 bg-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform z-20"
                    aria-label={trail.isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                    <HeartIcon className={`w-8 h-8 ${trail.isFavorited ? 'text-red-500 fill-current' : 'text-[#0F172A]/40'}`} filled={trail.isFavorited} />
                </button>
            </div>

            {/* Main Content Info */}
            <div className="container mx-auto px-4 md:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Key Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#F0FDF4] flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow">
                                <span className="text-xs text-[#047857] uppercase font-bold tracking-widest mb-2">{T.trailDetail.distance || 'Distance'}</span>
                                <span className="text-2xl font-bold text-[#047857]">{trail.length_km} <span className="text-sm align-middle text-[#0F172A]/60 font-normal">km</span></span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#F0FDF4] flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow">
                                <span className="text-xs text-[#047857] uppercase font-bold tracking-widest mb-2">{T.trailDetail.duration || 'Duration'}</span>
                                <span className="text-2xl font-bold text-[#047857]">{trail.duration_hr} <span className="text-sm align-middle text-[#0F172A]/60 font-normal">hr</span></span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[#F0FDF4] flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow">
                                <span className="text-xs text-[#047857] uppercase font-bold tracking-widest mb-2">{T.trailDetail.rating || 'Rating'}</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-2xl font-bold text-[#047857]">{trail.rating > 0 ? trail.rating.toFixed(1) : (4.5).toFixed(1)} <span className="text-sm align-middle text-[#0F172A]/60 font-normal">/5</span></span>
                                </div>
                            </div>
                            <button
                                onClick={() => onSelectMap(trail.id)}
                                className="bg-gradient-to-r from-[#047857] to-[#10B981] hover:shadow-lg text-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center transition-all transform hover:scale-[1.02] active:scale-95 font-bold"
                            >
                                <LucideMap className="w-6 h-6 mb-2" />
                                <span className="text-xs uppercase tracking-widest">{T.trailDetail.map || 'Map'}</span>
                            </button>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#047857] mb-4">{T.trailDetail.description || 'About the Trail'}</h2>
                            <p className="text-[#0F172A]/70 leading-relaxed text-lg">
                                {trail.description}
                            </p>
                        </div>

                        {/* Scenery Tags */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Highlights</h3>
                            <div className="flex flex-wrap gap-2">
                                {trail.scenery.map(s => (
                                    <span key={s} className="px-4 py-2 bg-sage-green/10 text-sage-green rounded-full text-sm font-medium border border-sage-green/20">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div>
                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">{T.trailDetail.communityReviews} ({trail.reviews.length})</h3>
                            <div className="space-y-6">
                                {trail.reviews.map((r, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-4 mb-4">
                                            <img
                                                src={r.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.full_name)}&background=random`}
                                                alt={r.full_name}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 bg-gray-100"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    // Prevent infinite loop if fallback also fails
                                                    if (!target.src.includes('ui-avatars.com')) {
                                                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.full_name)}&background=random`;
                                                    }
                                                }}
                                            />
                                            <div>
                                                <p className="font-bold text-gray-900">{r.full_name}</p>
                                                <div className="flex text-yellow-400 text-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i}>{i < r.rating ? "★" : "☆"}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm lg:text-base">"{r.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Weather & Extra Info */}
                    <div className="space-y-8">
                        {/* Weather Card */}
                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                            <h3 className="text-xl font-display font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <SunIcon className="w-5 h-5" /> {T.trailDetail.weatherForecast}
                            </h3>
                            <div className="space-y-3">
                                {MOCK_WEATHER.map(w => (
                                    <div key={w.day} className="flex justify-between items-center bg-white/60 p-3 rounded-xl backdrop-blur-sm">
                                        <span className="font-medium text-gray-700">{w.day}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900">{w.temp_c}°C</span>
                                            <WeatherIcon condition={w.condition} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-xs text-blue-400 text-center">
                                *Forecast based on historical averages
                            </div>
                        </div>

                        {/* CTA Box */}
                        <div className="bg-earth-brown/5 p-6 rounded-3xl border border-earth-brown/10">
                            <h3 className="text-xl font-display font-bold text-earth-brown mb-2">Ready to go?</h3>
                            <p className="text-sm text-gray-600 mb-4">{T.trailDetail.packingMessage}</p>
                            <button
                                onClick={() => {
                                    alert(`Generating AI Packing List for ${trail.name}...\n\n(This feature will be fully integrated with the Planner soon!)`);
                                }}
                                className="w-full py-3 bg-earth-brown text-white font-bold rounded-xl hover:bg-earth-brown/90 transition-colors shadow-lg shadow-orange-900/10">
                                {T.trailDetail.generatePackingList}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrailDetail;

