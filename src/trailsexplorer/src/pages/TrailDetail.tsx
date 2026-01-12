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
import { Zap, Activity, Flame, Star, Map as LucideMap, X, Navigation, Bed, AlertTriangle } from 'lucide-react';

const MOCK_HOMESTAYS = [
    { id: 1, name: "Sunset Hill Homestay", price: "450k/night", distance: "0.5km from end", image: "https://picsum.photos/seed/home1/300/200" },
    { id: 2, name: "Forest Edge Cabin", price: "600k/night", distance: "1.2km from end", image: "https://picsum.photos/seed/home2/300/200" },
    { id: 3, name: "Trailblazer Dorm", price: "150k/bed", distance: "200m from start", image: "https://picsum.photos/seed/home3/300/200" },
];

export interface TrailDetailProps {
    trailId: number;
    onBack: () => void;
    trails: Trail[];
    onToggleFavorite: (id: number) => void;
    onSelectMap: (id: number) => void;
}

const TrailDetail: React.FC<TrailDetailProps> = ({ trailId, onBack, trails, onToggleFavorite, onSelectMap }) => {
    // Initial trail from props (might have partial data)
    const initialTrail = trails.find(t => t.id === trailId);
    const [trail, setTrail] = React.useState<Trail | undefined>(initialTrail);
    // Demo States
    const [show3DMap, setShow3DMap] = React.useState(false);
    const [showNavigation, setShowNavigation] = React.useState(false);
    const [isOffTrail, setIsOffTrail] = React.useState(false);
    const [simProgress, setSimProgress] = React.useState(0); // 0-100 for navigation sim

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

    if (!trail) return <div className="p-8 text-center text-gray-500">Trail not found.</div>;

    const getDifficultyStyles = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return {
                    badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30',
                    icon: <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />,
                    text: 'text-emerald-500'
                };
            case 'hard':
                return {
                    badge: 'bg-rose-900/40 text-rose-300 border-rose-500/30',
                    icon: <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />,
                    text: 'text-rose-500'
                };
            default:
                return {
                    badge: 'bg-amber-900/40 text-amber-300 border-amber-500/30',
                    icon: <Activity className="w-4 h-4 text-amber-400" />,
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
        <div className="min-h-screen bg-gray-50 pb-16">
            {/* Immersive Hero Section */}
            <div className="relative h-[60vh] w-full">
                <img src={trail.imageUrl} alt={trail.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

                <div className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all backdrop-blur-sm">
                        <ArrowLeftIcon className="w-5 h-5" /> Back
                    </button>
                    <button onClick={() => setShow3DMap(true)} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all backdrop-blur-sm shadow-lg border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M12 12l8-4.5" /><path d="M12 12v9" /><path d="M12 12L4 7.5" /></svg>
                        <span className="font-bold text-sm">View 3D Map</span>
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container mx-auto">
                        <div className="max-w-4xl">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 mb-4 text-xs font-bold tracking-widest uppercase backdrop-blur-md rounded-full border shadow-2xl ${diffStyles.badge}`}>
                                {diffStyles.icon}
                                <span>{trail.difficulty} Level</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 leading-tight">
                                {trail.name}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 flex items-center gap-2">
                                <MapIcon className="w-5 h-5 text-sage-green" /> {trail.location}
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
                    <HeartIcon className={`w-8 h-8 ${trail.isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`} filled={trail.isFavorited} />
                </button>
            </div>

            {/* Main Content Info */}
            <div className="container mx-auto px-4 md:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Key Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Distance</span>
                                <span className="text-2xl font-display font-bold text-forest-green">{trail.length_km} <span className="text-sm align-middle text-gray-400 font-sans font-normal">km</span></span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Duration</span>
                                <span className="text-2xl font-display font-bold text-earth-brown">{trail.duration_hr} <span className="text-sm align-middle text-gray-400 font-sans font-normal">hr</span></span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                                <span className="text-xs text-gray-400 uppercase font-black tracking-widest mb-2">Rating</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-2xl font-display font-bold text-gray-900">{trail.rating > 0 ? trail.rating.toFixed(1) : (4.5).toFixed(1)} <span className="text-sm align-middle text-gray-400 font-sans font-normal">/5</span></span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowNavigation(true)}
                                className="bg-forest-green hover:bg-green-900 text-white p-6 rounded-2xl shadow-xl shadow-green-900/20 flex flex-col items-center justify-center transition-all transform hover:scale-[1.02] active:scale-95 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/abstract-topographic-map-lines-background_23-2148508734.jpg')] opacity-20 mix-blend-overlay"></div>
                                <Navigation className="w-6 h-6 mb-2" />
                                <span className="font-black text-xs uppercase tracking-widest text-center">Start Navigation</span>
                            </button>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">About the Trail</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
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
                            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Community Reviews ({trail.reviews.length})</h3>
                            <div className="space-y-6">
                                {trail.reviews.map((r, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-4 mb-4">
                                            <img
                                                src={r.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.username}`}
                                                alt={r.full_name}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 bg-gray-100"
                                            />
                                            <div>
                                                <p className="font-bold text-gray-900">
                                                    {r.full_name} <span className="text-gray-500 font-normal text-sm">(@{r.username})</span>
                                                </p>
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
                                <SunIcon className="w-5 h-5" /> Weather Forecast
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

                        {/* Nearby Stays (Test Case 21) */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Bed className="w-5 h-5 text-forest-green" /> Nearby Stays
                            </h3>
                            <div className="space-y-4">
                                {MOCK_HOMESTAYS.map(home => (
                                    <div key={home.id} className="flex gap-3 items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors">
                                        <img src={home.image} alt={home.name} className="w-16 h-16 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-forest-green">{home.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{home.distance}</p>
                                            <p className="text-xs font-bold text-sage-green mt-1">{home.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">
                                View All Listings
                            </button>
                        </div>

                        {/* CTA Box */}
                        <div className="bg-earth-brown/5 p-6 rounded-3xl border border-earth-brown/10">
                            <h3 className="text-xl font-display font-bold text-earth-brown mb-2">Ready to go?</h3>
                            <p className="text-sm text-gray-600 mb-4">Make sure you have all your gear ready. Check our AI planner for a custom packing list.</p>
                            <button
                                onClick={() => {
                                    alert(`Generating AI Packing List for ${trail.name}...\n\n(This feature will be fully integrated with the Planner soon!)`);
                                }}
                                className="w-full py-3 bg-earth-brown text-white font-bold rounded-xl hover:bg-earth-brown/90 transition-colors shadow-lg shadow-orange-900/10">
                                Generate Packing List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* 3D Map Modal (Test Case 20) */}
            {show3DMap && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-[90vw] h-[80vh] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                        <button onClick={() => setShow3DMap(false)} className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors"><X /></button>
                        <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur px-4 py-2 rounded-xl text-white font-bold border border-white/10 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 3D Terrain View
                        </div>
                        {/* Fake 3D Content */}
                        <div className="w-full h-full flex items-center justify-center perspective-[1000px] overflow-hidden bg-gradient-to-b from-blue-900/20 to-black">
                            <div className="relative w-full h-full group">
                                <img
                                    src="https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=2070&auto=format&fit=crop"
                                    className="w-full h-full object-cover opacity-80 transition-transform duration-[2s] ease-in-out scale-110 group-hover:scale-125 group-hover:rotate-x-12"
                                    style={{ transform: "perspective(1000px) rotateX(20deg) scale(1.2)" }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                            <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur border border-white/10 font-bold transition-all">Reset View</button>
                            <button className="bg-sage-green hover:bg-forest-green text-white px-6 py-3 rounded-xl shadow-lg shadow-green-900/50 font-bold transition-all">Flyover Mode</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Modal (Test Case 27) */}
            {showNavigation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full h-full sm:w-[400px] sm:h-[800px] bg-gray-900 sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-gray-800 ring-4 ring-black">
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 p-6 pt-10 bg-gradient-to-b from-black/80 to-transparent z-20 flex justify-between items-start">
                            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl text-white border border-white/10">
                                <p className="text-xs text-gray-400 uppercase font-black">Dist. Remaining</p>
                                <p className="text-2xl font-display font-bold">3.2 km</p>
                            </div>
                            <button onClick={() => setShowNavigation(false)} className="p-2 bg-black/40 text-white rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"><X /></button>
                        </div>

                        {/* Map View */}
                        <div className="absolute inset-0 bg-gray-800">
                            <img src="https://images.unsplash.com/photo-1624026676760-5896a84f332d?q=80&w=2664&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale-[0.3]" />
                            {/* Trail Path */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 10px rgba(74, 222, 128, 0.5))' }}>
                                <path d="M 100 800 C 150 700, 100 500, 200 400 S 300 200, 200 0" stroke="#4ade80" strokeWidth="6" fill="none" strokeDasharray="10 5" />
                            </svg>
                            {/* User Marker */}
                            <div
                                className={`absolute transition-all duration-1000 ease-in-out flex flex-col items-center justify-center ${isOffTrail ? 'top-[400px] left-[320px]' : 'top-[390px] left-[190px]'}`}
                            >
                                <div className={`w-6 h-6 rounded-full border-4 shadow-xl ${isOffTrail ? 'bg-red-500 border-red-200 animate-ping' : 'bg-blue-500 border-white'}`}></div>
                                {isOffTrail && (
                                    <div className="absolute w-6 h-6 bg-red-500/50 rounded-full animate-ping"></div>
                                )}
                            </div>
                        </div>

                        {/* Warnings Overlay */}
                        {isOffTrail && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-red-500/10 pointer-events-none backdrop-blur-[2px] animate-pulse">
                                <div className="bg-red-600 text-white p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-[80%] mx-auto animate-bounce-short border-2 border-red-400">
                                    <AlertTriangle className="w-12 h-12 mb-2" />
                                    <h3 className="text-2xl font-black uppercase">Wrong Way!</h3>
                                    <p className="opacity-90 mt-1">You have deviated 50m from the trail.</p>
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-black via-black/80 to-transparent z-20 space-y-4">
                            <button
                                onClick={() => setIsOffTrail(!isOffTrail)}
                                className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 border-b-4 ${isOffTrail ? 'bg-blue-600 border-blue-800 text-white' : 'bg-red-600 border-red-800 text-white'
                                    }`}
                            >
                                {isOffTrail ? 'Return to Trail (Simulate)' : 'Simulate Off-Trail Deviation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default TrailDetail;
