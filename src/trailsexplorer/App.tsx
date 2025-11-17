
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import {
    MOCK_TRAILS, MOCK_USER, MOCK_GUIDEBOOK_ARTICLES, MOCK_MARKETPLACE_ITEMS,
    MOCK_CHALLENGES, MOCK_SOCIAL_FEED, MOCK_WEATHER, MOCK_VOICE_LOGS, MOCK_GROUP,
    LeafIcon, MountainIcon, CompassIcon, MenuIcon, XIcon, CheckIcon, UsersIcon,
    BookOpenIcon, MicrophoneIcon, SunIcon, CloudIcon, LightningBoltIcon, HeartIcon,
    MapIcon, ArrowLeftIcon, PaperAirplaneIcon, MapPinIcon
} from './constants';
import { generateTrekkingPlan, generateChecklist } from './services/geminiService';
import type { Trail, ItineraryPlan, ChecklistItem, User, Group, ChatMessage } from './types';

// Declare Leaflet global for TypeScript
declare var L: any;

// --- TYPE DEFINITIONS ---
type View = 'home' | 'discover' | 'planner' | 'community' | 'profile' | 'group'
    | { view: 'trailDetail', id: number, from: 'home' | 'discover' | 'profile' }
    | { view: 'mapView', id: number, fromTrailDetail: { view: 'trailDetail', id: number, from: 'home' | 'discover' | 'profile' } };
type AuthView = 'login' | 'register';

// --- REUSABLE COMPONENTS ---

const TrailCard: React.FC<{ trail: Trail, onSelect: (id: number) => void, onToggleFavorite: (id: number) => void }> = ({ trail, onSelect, onToggleFavorite }) => {
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


// --- PAGE COMPONENTS ---

const Header: React.FC<{ setView: (view: View) => void, currentView: View, onLogout: () => void }> = ({ setView, currentView, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navItems: { name: string, view: View }[] = [
        { name: 'Home', view: 'home' },
        { name: 'Discover', view: 'discover' },
        { name: 'AI Planner', view: 'planner' },
        { name: 'Community', view: 'community' },
        { name: 'Profile', view: 'profile' },
    ];

    const NavLink: React.FC<{ view: View, name: string }> = ({ view, name }) => {
        let isActive = false;
        if (typeof currentView === 'string') {
            isActive = currentView === view;
        } else if (currentView.view === 'trailDetail' || currentView.view === 'mapView' || (typeof view === 'string' && (view === 'community' || view === 'profile'))) {
             let baseView: string = '';
             if (currentView.view === 'mapView') {
                baseView = currentView.fromTrailDetail.from;
             } else if (currentView.view === 'trailDetail') {
                baseView = currentView.from;
             }
             isActive = baseView === view;
        }

        return (
            <button onClick={() => { setView(view); setIsMenuOpen(false); }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-sage-green font-bold' : 'text-forest-green hover:text-sage-green'}`}
            >
                {name}
            </button>
        );
    };

    return (
        <header className="bg-cream shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
                        <MountainIcon className="h-8 w-8 text-sage-green" />
                        <h1 className="ml-2 text-2xl font-display text-forest-green">TrailsExplorer</h1>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map(item => <NavLink key={item.name} {...item} />)}
                             <button onClick={onLogout} className="px-3 py-2 rounded-md text-sm font-medium text-forest-green hover:text-sage-green">
                                Logout
                            </button>
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                         <button onClick={onLogout} className="p-2 rounded-md text-forest-green hover:text-sage-green focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                            </svg>
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-forest-green hover:text-sage-green focus:outline-none">
                            {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map(item => <NavLink key={item.name} {...item} />)}
                    </div>
                </div>
            )}
        </header>
    );
};

const Home: React.FC<{ setView: (view: View) => void, trails: Trail[], onSelectTrail: (id: number) => void, onToggleFavorite: (id: number) => void }> = ({ setView, trails, onSelectTrail, onToggleFavorite }) => {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg mb-8" style={{ backgroundImage: "url('https://picsum.photos/seed/herobg/1200/400')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="bg-black bg-opacity-40 p-6 rounded-lg">
                    <h1 className="text-5xl font-display text-white mb-4">Find Your Next Adventure</h1>
                    <p className="text-xl text-gray-200 mb-6">Let our AI assistant plan the perfect trek for you.</p>
                    <button onClick={() => setView('planner')} className="bg-sage-green text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105">
                        Plan My Trip
                    </button>
                </div>
            </div>

            <h2 className="text-3xl font-display text-forest-green mb-6">Featured Trails</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trails.slice(0, 3).map(trail => (
                    <TrailCard key={trail.id} trail={trail} onSelect={() => onSelectTrail(trail.id)} onToggleFavorite={onToggleFavorite} />
                ))}
            </div>
        </div>
    );
};

const Discover: React.FC<{ trails: Trail[], onSelectTrail: (id: number) => void, onToggleFavorite: (id: number) => void }> = ({ trails, onSelectTrail, onToggleFavorite }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

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
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTrails.map(trail => (
                    <TrailCard key={trail.id} trail={trail} onSelect={() => onSelectTrail(trail.id)} onToggleFavorite={onToggleFavorite} />
                ))}
            </div>
        </div>
    );
};

const TrailDetail: React.FC<{ trailId: number, onBack: () => void, trails: Trail[], onToggleFavorite: (id: number) => void, onSelectMap: (id: number) => void }> = ({ trailId, onBack, trails, onToggleFavorite, onSelectMap }) => {
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

const Planner: React.FC = () => {
    const [location, setLocation] = useState('Tà Năng - Phan Dũng');
    const [duration, setDuration] = useState(3);
    const [difficulty, setDifficulty] = useState('Medium');
    const [interests, setInterests] = useState('beautiful grasslands, pine forests, and challenging climbs');
    const [plan, setPlan] = useState<ItineraryPlan | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [isLoadingPlan, setIsLoadingPlan] = useState(false);
    const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneratePlan = async () => {
        setIsLoadingPlan(true);
        setError(null);
        setPlan(null);
        try {
            const result = await generateTrekkingPlan(location, duration, difficulty, interests);
            setPlan(result);
        } catch (err) {
            setError('Failed to generate plan. Please try again.');
            console.error(err);
        }
        setIsLoadingPlan(false);
    };
    
    const handleGenerateChecklist = async () => {
        setIsLoadingChecklist(true);
        setChecklist([]);
        try {
            const result = await generateChecklist(location, duration, difficulty);
            if (result) {
                setChecklist(result.map((text, index) => ({ id: index, text, packed: false })));
            }
        } catch (err) {
            console.error(err);
        }
        setIsLoadingChecklist(false);
    };

    const toggleChecklistItem = (id: number) => {
        setChecklist(checklist.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-display text-forest-green mb-6 text-center">AI Trekking Planner</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold font-display text-forest-green mb-4">Plan Your Trip</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
                            <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm">
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Interests</label>
                            <textarea value={interests} onChange={e => setInterests(e.target.value)} rows={3} className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <button onClick={handleGeneratePlan} disabled={isLoadingPlan} className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                            {isLoadingPlan ? 'Generating Plan...' : 'Generate Plan'}
                        </button>
                        <button onClick={handleGenerateChecklist} disabled={isLoadingChecklist} className="w-full bg-earth-brown text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                            {isLoadingChecklist ? 'Generating Checklist...' : 'Generate Checklist'}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    {/* Plan Display */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">Your Itinerary</h3>
                        {isLoadingPlan && <p>Generating your personalized itinerary...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {!isLoadingPlan && !plan && <p className="text-gray-500">Your generated plan will appear here.</p>}
                        {plan && (
                            <div className="space-y-4">
                                {plan.plan.map(day => (
                                    <div key={day.day} className="border border-gray-200 p-4 rounded-lg">
                                        <h4 className="font-bold text-lg text-sage-green">Day {day.day}: {day.title}</h4>
                                        <p className="text-sm font-semibold">{day.distance_km} km</p>
                                        <p className="mt-2 text-gray-700">{day.route}</p>
                                        <div className="mt-2">
                                            <h5 className="font-semibold">Highlights:</h5>
                                            <ul className="list-disc list-inside text-gray-600">
                                                {day.highlights.map((h, i) => <li key={i}>{h}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Checklist Display */}
                    {checklist.length > 0 &&
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold font-display text-forest-green mb-4">Packing Checklist</h3>
                            <div className="space-y-2">
                                {checklist.map(item => (
                                    <div key={item.id} className="flex items-center">
                                        <input type="checkbox" id={`item-${item.id}`} checked={item.packed} onChange={() => toggleChecklistItem(item.id)} className="h-4 w-4 rounded border-gray-300 text-sage-green focus:ring-sage-green"/>
                                        <label htmlFor={`item-${item.id}`} className={`ml-3 block text-sm text-gray-900 ${item.packed ? 'line-through text-gray-500' : ''}`}>{item.text}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

const Community: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
             <h2 className="text-3xl font-display text-forest-green mb-6 text-center">Community Hub</h2>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold font-display text-forest-green mb-4">Activity Feed</h3>
                    <div className="space-y-6">
                        {MOCK_SOCIAL_FEED.map(post => (
                            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex items-center mb-2">
                                    <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full mr-3" />
                                    <div>
                                        <p className="font-bold">{post.author}</p>
                                        <p className="text-sm text-gray-500">on {post.trailName}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">{post.content}</p>
                                {post.imageUrl && <img src={post.imageUrl} alt="Post" className="rounded-lg w-full object-cover" />}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">My Trekking Groups</h3>
                         <div onClick={() => setView('group')} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                            <p className="font-bold text-lg text-sage-green">{MOCK_GROUP.name}</p>
                            <p className="text-sm text-gray-600 mb-2">on {MOCK_GROUP.trailName}</p>
                            <div className="flex -space-x-2 overflow-hidden">
                                {MOCK_GROUP.members.map(member => (
                                    <img key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={member.avatarUrl} alt={member.name} />
                                ))}
                            </div>
                         </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">Community Challenges</h3>
                        <div className="space-y-4">
                            {MOCK_CHALLENGES.map(challenge => (
                                <div key={challenge.id} className="bg-white p-4 rounded-lg shadow-md">
                                    <p className="font-bold">{challenge.title}</p>
                                    <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-sage-green h-2.5 rounded-full" style={{ width: `${(challenge.progress / challenge.goal) * 100}%` }}></div>
                                    </div>
                                    <p className="text-right text-sm mt-1">{challenge.progress} / {challenge.goal} {challenge.unit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

const Profile: React.FC<{ user: User, onSelectTrail: (id: number) => void, trails: Trail[] }> = ({ user, onSelectTrail, trails }) => {
    const favoriteTrails = trails.filter(t => t.isFavorited);
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full shadow-md" />
                    <div>
                        <h2 className="text-3xl font-display text-forest-green">{user.name}</h2>
                        <p className="text-gray-600">Passionate Trekker</p>
                    </div>
                </div>

                <h3 className="text-xl font-bold font-display text-forest-green mb-4">Trekking Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                    <div className="bg-light-tan p-4 rounded-lg">
                        <p className="text-2xl font-bold text-earth-brown">{user.totalKm}</p>
                        <p className="text-sm text-earth-brown">Km Trekked</p>
                    </div>
                    <div className="bg-light-tan p-4 rounded-lg">
                        <p className="text-2xl font-bold text-earth-brown">{user.avgAltitude}</p>
                        <p className="text-sm text-earth-brown">Avg. Altitude (m)</p>
                    </div>
                    <div className="bg-light-tan p-4 rounded-lg">
                        <p className="text-2xl font-bold text-earth-brown">{user.avgTimeHr}</p>
                        <p className="text-sm text-earth-brown">Avg. Time (hr)</p>
                    </div>
                     <div className="bg-light-tan p-4 rounded-lg">
                        <p className="text-2xl font-bold text-earth-brown">{user.tripHistory.length}</p>
                        <p className="text-sm text-earth-brown">Trips Taken</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">Trip History</h3>
                        <div className="space-y-4">
                            {user.tripHistory.map(trail => (
                                <div key={trail.id} onClick={() => onSelectTrail(trail.id)} className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                                    <img src={trail.imageUrl} alt={trail.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                    <div>
                                        <p className="font-semibold">{trail.name}</p>
                                        <p className="text-sm text-gray-500">{trail.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">Favorite Trails</h3>
                        <div className="space-y-4">
                            {favoriteTrails.length > 0 ? favoriteTrails.map(trail => (
                                <div key={trail.id} onClick={() => onSelectTrail(trail.id)} className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                                    <img src={trail.imageUrl} alt={trail.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                    <div>
                                        <p className="font-semibold">{trail.name}</p>
                                        <p className="text-sm text-gray-500">{trail.location}</p>
                                    </div>
                                    <HeartIcon className="w-6 h-6 text-red-500 ml-auto" filled />
                                </div>
                            )) : <p className="text-gray-500">You haven't favorited any trails yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MapView: React.FC<{ trailId: number, onBack: () => void, trails: Trail[] }> = ({ trailId, onBack, trails }) => {
    const trail = trails.find(t => t.id === trailId);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    useEffect(() => {
        if (trail && mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current).setView([trail.lat, trail.lng], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([trail.lat, trail.lng]).addTo(map)
                .bindPopup(`<b>${trail.name}</b>`)
                .openPopup();
            
            mapRef.current = map;
        }
        
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [trail]);

    if (!trail) return <div className="p-8 text-center">Trail map not found.</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <button onClick={onBack} className="flex items-center gap-2 text-sage-green mb-4 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" /> Back to Trail Details
            </button>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                 <div className="p-4 border-b">
                    <h2 className="text-2xl font-display text-forest-green">Map of {trail.name}</h2>
                    <p className="text-gray-600">{trail.location}</p>
                </div>
                <div ref={mapContainerRef} style={{ height: '600px', width: '100%' }} />
            </div>
        </div>
    );
};

const GroupView: React.FC<{ group: Group, currentUser: User, onBack: () => void }> = ({ group, currentUser, onBack }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(group.chatHistory);
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current).setView([group.members[0].lat, group.members[0].lng], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            group.members.forEach(member => {
                L.marker([member.lat, member.lng]).addTo(map)
                    .bindPopup(`<b>${member.name}</b><br>${member.status}`);
            });

            mapRef.current = map;
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [group.members]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const message: ChatMessage = {
            id: Date.now(),
            author: currentUser.name,
            avatarUrl: currentUser.avatarUrl,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrentUser: true,
        };
        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const getStatusColor = (status: 'On Track' | 'Lagging Behind' | 'Leader') => {
        switch (status) {
            case 'Leader': return 'text-yellow-500';
            case 'On Track': return 'text-green-500';
            case 'Lagging Behind': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <button onClick={onBack} className="flex items-center gap-2 text-sage-green mb-4 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" /> Back to Community
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Members & Map */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-display text-forest-green">{group.name}</h2>
                        <p className="text-gray-600">Currently on: {group.trailName}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">Members</h3>
                        <ul className="space-y-4">
                            {group.members.map(member => (
                                <li key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                                        <span>{member.name}</span>
                                    </div>
                                    <span className={`text-sm font-semibold ${getStatusColor(member.status)}`}>{member.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-4 border-b">
                            <h3 className="text-xl font-bold font-display text-forest-green">Live Map</h3>
                        </div>
                        <div ref={mapContainerRef} style={{ height: '300px', width: '100%' }} />
                    </div>
                </div>

                {/* Right Column: Chat */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-lg flex flex-col" style={{ height: 'calc(100vh - 12rem)' }}>
                    <h3 className="text-xl font-bold font-display text-forest-green p-4 border-b">Group Chat</h3>
                    <div className="flex-grow p-4 overflow-y-auto">
                        {chatMessages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 mb-4 ${msg.isCurrentUser ? 'justify-end' : ''}`}>
                                {!msg.isCurrentUser && <img src={msg.avatarUrl} alt={msg.author} className="w-8 h-8 rounded-full" />}
                                <div className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md ${msg.isCurrentUser ? 'bg-sage-green text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.isCurrentUser ? 'text-green-100' : 'text-gray-500'}`}>{msg.author}, {msg.timestamp}</p>
                                </div>
                                {msg.isCurrentUser && <img src={msg.avatarUrl} alt={msg.author} className="w-8 h-8 rounded-full" />}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-sage-green focus:border-sage-green"
                        />
                        <button type="submit" className="bg-sage-green text-white p-3 rounded-full hover:bg-opacity-90 transition-colors">
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- AUTHENTICATION COMPONENTS ---
const Login: React.FC<{ onLogin: (email: string) => void, setAuthView: (view: AuthView) => void }> = ({ onLogin, setAuthView }) => {
    const [email, setEmail] = useState('giahuy@trailsexplorer.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock validation
        if (email === 'giahuy@trailsexplorer.com' && password === 'password123') {
            onLogin(email);
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl relative">
             <div className="flex items-center justify-center mb-6">
                <MountainIcon className="h-10 w-10 text-sage-green" />
                <h1 className="ml-2 text-3xl font-display text-forest-green">TrailsExplorer</h1>
            </div>
            <h2 className="text-2xl font-bold text-center text-forest-green mb-6">Welcome Back</h2>
            {error && <p className="bg-red-100 text-red-700 p-2 rounded-md mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <button type="submit" className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">Login</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <button onClick={() => setAuthView('register')} className="font-medium text-sage-green hover:underline">Sign up</button>
            </p>
        </div>
    );
};

const Register: React.FC<{ onRegister: (name: string) => void, setAuthView: (view: AuthView) => void }> = ({ onRegister, setAuthView }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister(name || 'New Trekker');
    };

    return (
         <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl relative">
             <div className="flex items-center justify-center mb-6">
                <MountainIcon className="h-10 w-10 text-sage-green" />
                <h1 className="ml-2 text-3xl font-display text-forest-green">TrailsExplorer</h1>
            </div>
            <h2 className="text-2xl font-bold text-center text-forest-green mb-6">Create Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded-md shadow-sm" />
                </div>
                <button type="submit" className="w-full bg-sage-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors">Create Account</button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button onClick={() => setAuthView('login')} className="font-medium text-sage-green hover:underline">Log in</button>
            </p>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [trails, setTrails] = useState<Trail[]>(MOCK_TRAILS);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authView, setAuthView] = useState<AuthView>('login');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleLogin = (email: string) => {
        setCurrentUser(MOCK_USER);
        setIsAuthenticated(true);
    };

    const handleRegister = (name: string) => {
        const newUser: User = { ...MOCK_USER, name: name, tripHistory: [], totalKm: 0 };
        setCurrentUser(newUser);
        setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setView('home');
    };

    const handleSelectTrail = (id: number) => {
        let fromView: 'home' | 'discover' | 'profile' = 'discover'; // default
        if (typeof view === 'string') {
            if (view === 'home' || view === 'profile') {
                fromView = view;
            }
        }
        setView({ view: 'trailDetail', id, from: fromView });
    };
    
    const handleSelectMap = (trailId: number) => {
        if (typeof view === 'object' && view.view === 'trailDetail') {
            setView({ view: 'mapView', id: trailId, fromTrailDetail: view });
        }
    };

    const handleToggleFavorite = (id: number) => {
        setTrails(prevTrails =>
            prevTrails.map(trail =>
                trail.id === id ? { ...trail, isFavorited: !trail.isFavorited } : trail
            )
        );
    };

    const handleBack = () => {
        if (typeof view === 'object') {
            if (view.view === 'trailDetail') {
                setView(view.from);
            } else if (view.view === 'mapView') {
                setView(view.fromTrailDetail);
            }
        }
    }

    const renderContent = () => {
        if (typeof view === 'object') {
            if (view.view === 'trailDetail') {
                return <TrailDetail trailId={view.id} onBack={handleBack} trails={trails} onToggleFavorite={handleToggleFavorite} onSelectMap={handleSelectMap} />;
            }
             if (view.view === 'mapView') {
                return <MapView trailId={view.id} onBack={handleBack} trails={trails} />;
            }
        }

        switch (view) {
            case 'home':
                return <Home setView={setView} trails={trails} onSelectTrail={handleSelectTrail} onToggleFavorite={handleToggleFavorite} />;
            case 'discover':
                return <Discover trails={trails} onSelectTrail={handleSelectTrail} onToggleFavorite={handleToggleFavorite} />;
            case 'planner':
                return <Planner />;
            case 'community':
                return <Community setView={setView} />;
            case 'group':
                if (currentUser) {
                    return <GroupView group={MOCK_GROUP} currentUser={currentUser} onBack={() => setView('community')} />;
                }
                return null;
            case 'profile':
                 if (currentUser) {
                    return <Profile user={currentUser} onSelectTrail={handleSelectTrail} trails={trails} />;
                }
                return null;
            default:
                return <Home setView={setView} trails={trails} onSelectTrail={handleSelectTrail} onToggleFavorite={handleToggleFavorite} />;
        }
    };

    if (!isAuthenticated) {
        return (
             <div className="min-h-screen bg-cream flex items-center justify-center p-4" style={{ backgroundImage: "url('https://picsum.photos/seed/authbg/1600/1200')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                 <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                {authView === 'login' 
                    ? <Login onLogin={handleLogin} setAuthView={setAuthView} /> 
                    : <Register onRegister={handleRegister} setAuthView={setAuthView} />
                }
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream">
            <Header setView={setView} currentView={view} onLogout={handleLogout} />
            <main>{renderContent()}</main>
            <footer className="bg-forest-green text-cream mt-8 py-4">
                <div className="container mx-auto text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} TrailsExplorer. Adventure Awaits.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
