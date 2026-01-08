
import React, { useState, useEffect, useRef } from 'react';
// lightweight CSS animations used instead of framer-motion for React 19 compatibility
import { GoogleGenAI, Type } from '@google/genai';
import {
    MOCK_GUIDEBOOK_ARTICLES, MOCK_MARKETPLACE_ITEMS,
    MOCK_CHALLENGES, MOCK_WEATHER, MOCK_VOICE_LOGS, MOCK_GROUP,
    LeafIcon, MountainIcon, CompassIcon, MenuIcon, XIcon, CheckIcon, UsersIcon,
    BookOpenIcon, MicrophoneIcon, SunIcon, CloudIcon, LightningBoltIcon, HeartIcon,
    MapIcon, ArrowLeftIcon, PaperAirplaneIcon, MapPinIcon
} from './src/data/constants';
import { generateTrekkingPlan, generateChecklist } from './services/geminiService';
import { getTrails } from './src/services/trailService';
import type { Trail, ItineraryPlan, ChecklistItem, User, Group, ChatMessage } from './src/types';
import Logo from './components/Logo';
import logoImage from './assets/logo.png';

// Declare Leaflet global for TypeScript
declare var L: any;

// --- TYPE DEFINITIONS ---
import type { View, AuthView } from './src/types/view';

// --- IMPORT COMPONENTS & PAGES ---
import TrailCard from './src/components/common/TrailCard';
import MapView from './src/components/common/MapView'; // Refactored MapView
import Header from './src/components/layout/Header';
import AdminLayout from './src/layouts/AdminLayout'; // Admin Layout
import Dashboard from './src/pages/admin/Dashboard'; // Admin Dashboard
import Users from './src/pages/admin/Users'; // Admin Users
import LoginPage from './src/pages/Login';
import RegisterPage from './src/pages/Register';
import { useAuth } from './src/context/AuthContext';
import Home from './src/pages/Home';
import Discover from './src/pages/Discover';
import TrailDetail from './src/pages/TrailDetail';
import Planner from './src/pages/Planner';
import Community from './src/pages/Community';
import Profile from './src/pages/Profile';

// --- OTHER COMPONENTS (GroupView) ---
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




// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
    const VIEW_KEY = 'trails_explorer_view';
    const [view, setView] = useState<View>(() => {
        try {
            const raw = localStorage.getItem(VIEW_KEY);
            if (!raw) return 'home' as View;
            return JSON.parse(raw) as View;
        } catch (e) {
            return 'home' as View;
        }
    });
    const [trails, setTrails] = useState<Trail[]>([]);
    const [isLoadingTrails, setIsLoadingTrails] = useState(true);
    const [authView, setAuthView] = useState<AuthView>('login');
    const { user, isAuthenticated, logout } = useAuth();
    const prevAuth = useRef(isAuthenticated);

    useEffect(() => {
        console.log('[App] auth change', { user, isAuthenticated });

        // Detect login event (transition from false to true)
        if (!prevAuth.current && isAuthenticated) {
            console.log('User just logged in. Role:', user?.role);
            if (user?.role === 'admin') {
                console.log('Redirecting to Admin Dashboard');
                setView('admin_dashboard');
            } else {
                setView('home');
            }
        }
        prevAuth.current = isAuthenticated;
    }, [user, isAuthenticated]);

    // persist current view so F5 restores where user was
    useEffect(() => {
        try {
            localStorage.setItem(VIEW_KEY, JSON.stringify(view));
        } catch (e) {
            // ignore
        }
    }, [view]);

    // Load trails using service layer
    useEffect(() => {
        const loadTrails = async () => {
            setIsLoadingTrails(true);
            try {
                const loadedTrails = await getTrails();
                // normalize backend rows into frontend-friendly shape
                const extractLatLng = (obj: any) => {
                    if (!obj) return { lat: null, lng: null };
                    // GeoJSON style
                    if (obj.coordinates && Array.isArray(obj.coordinates)) {
                        const [lng, lat] = obj.coordinates;
                        return { lat: Number(lat) || null, lng: Number(lng) || null };
                    }
                    // WKT POINT string: POINT(lng lat)
                    if (typeof obj === 'string' && obj.startsWith('POINT')) {
                        const inside = obj.replace(/POINT\(|\)/g, '').trim();
                        const parts = inside.split(/\s+/);
                        if (parts.length >= 2) {
                            const lng = Number(parts[0]);
                            const lat = Number(parts[1]);
                            return { lat: isFinite(lat) ? lat : null, lng: isFinite(lng) ? lng : null };
                        }
                    }
                    // object with lat/lng or x/y
                    if (typeof obj === 'object') {
                        if (obj.lat !== undefined && obj.lng !== undefined) return { lat: Number(obj.lat) || null, lng: Number(obj.lng) || null };
                        if (obj.y !== undefined && obj.x !== undefined) return { lat: Number(obj.y) || null, lng: Number(obj.x) || null };
                        if (obj.latitude !== undefined && obj.longitude !== undefined) return { lat: Number(obj.latitude) || null, lng: Number(obj.longitude) || null };
                    }
                    return { lat: null, lng: null };
                };

                const normalized = Array.isArray(loadedTrails) ? loadedTrails.map((t: any, i: number) => ({
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
                })).map((nt: any, idx: number) => {
                    // second pass to attach lat/lng using original loadedTrails data
                    const original = Array.isArray(loadedTrails) ? loadedTrails[idx] : null;
                    let lat = null, lng = null;
                    if (original) {
                        const fromStart = extractLatLng(original.start_point || original.startPoint || original.location_coordinates || original.location_coordinates_geojson);
                        if (fromStart.lat !== null && fromStart.lng !== null) {
                            lat = fromStart.lat; lng = fromStart.lng;
                        } else {
                            // try fields directly
                            lat = original.lat ?? original.latitude ?? null;
                            lng = original.lng ?? original.longitude ?? original.lon ?? original.long ?? null;
                        }
                    }
                    return { ...nt, lat: lat, lng: lng };
                }) : [];
                setTrails(normalized as Trail[]);
            } catch (error) {
                console.error('Failed to load trails:', error);
                setTrails([]);
            }
            setIsLoadingTrails(false);
        };
        loadTrails();
    }, []);

    // wrappers so Login/Register pages (which expect callbacks) work
    // Handlers removed as logic is now handled in components via useAuth context directly.


    const handleSelectTrail = React.useCallback((id: number) => {
        let fromView: 'home' | 'discover' | 'profile' = 'discover'; // default
        if (typeof view === 'string') {
            if (view === 'home' || view === 'profile') {
                fromView = view;
            }
        }
        setView({ view: 'trailDetail', id, from: fromView });
    }, [view]);

    const handleSelectMap = React.useCallback((trailId: number) => {
        if (typeof view === 'object' && view.view === 'trailDetail') {
            setView({ view: 'mapView', id: trailId, fromTrailDetail: view });
        }
    }, [view]);

    const handleToggleFavorite = React.useCallback((id: number) => {
        setTrails(prevTrails =>
            prevTrails.map(trail =>
                (trail as any).id === id ? { ...trail, isFavorited: !(trail as any).isFavorited } : trail
            )
        );
    }, []);

    const handleBack = React.useCallback(() => {
        if (typeof view === 'object') {
            if (view.view === 'trailDetail') {
                setView(view.from);
            } else if (view.view === 'mapView') {
                setView(view.fromTrailDetail);
            }
        }
    }, [view]);

    const renderContent = () => {
        if (typeof view === 'object') {
            if (view.view === 'trailDetail') {
                return <TrailDetail trailId={view.id} onBack={handleBack} trails={trails} onToggleFavorite={handleToggleFavorite} onSelectMap={handleSelectMap} />;
            }
            if (view.view === 'mapView') {
                return <MapView trailId={view.id} onBack={handleBack} trails={trails} />;
            }
            if (view.view === 'group') {
                if (user) {
                    let groupToRender = MOCK_GROUP;
                    if (view.name !== MOCK_GROUP.name) {
                        groupToRender = {
                            ...MOCK_GROUP,
                            id: Date.now(),
                            name: view.name,
                            trailName: 'Planning Phase',
                            members: [{ ...MOCK_GROUP.members[0], name: user.name, avatarUrl: user.avatarUrl, status: 'Leader' }],
                            chatHistory: []
                        };
                    }
                    return <GroupView group={groupToRender} currentUser={user} onBack={() => setView('community')} />;
                }
                return <Home setView={setView} trails={trails} onSelectTrail={handleSelectTrail} onToggleFavorite={handleToggleFavorite} />;
            }
        }

        switch (view) {
            case 'home':
                return <Home setView={setView} trails={trails} onSelectTrail={handleSelectTrail} onToggleFavorite={handleToggleFavorite} />;
            case 'discover':
                return <Discover initialTrails={trails} onSelectTrail={handleSelectTrail} onToggleFavorite={handleToggleFavorite} />;
            case 'planner':
                return <Planner />;
            case 'community':
                return <Community setView={setView} />;

            case 'profile':
                if (user) {
                    return <Profile user={user} onSelectTrail={handleSelectTrail} trails={trails} setView={setView} />;
                }
                return null;
            case 'admin_dashboard':
                return <Dashboard />;
            case 'admin_users':
                return <Users />;
            default:
                return <Home setView={setView} trails={trails} onSelectTrail={handleSelectTrail} onToggleFavorite={handleToggleFavorite} />;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-4" style={{ backgroundImage: "url('https://picsum.photos/seed/authbg/1600/1200')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                {authView === 'login'
                    ? <LoginPage setAuthView={setAuthView} />
                    : <RegisterPage setAuthView={setAuthView} />
                }
            </div>
        )
    }

    // Check if current view is an admin view
    const isAdminView = view === 'admin_dashboard' || view === 'admin_users';
    const isUserAdmin = user?.role === 'admin';

    console.log('App Render:', { view, isAdminView, userRole: user?.role, isAuthenticated });

    if (isAdminView) {
        if (isUserAdmin) {
            return (
                <AdminLayout currentView={view} onNavigate={setView}>
                    {renderContent()}
                </AdminLayout>
            );
        }
        // If admin view but not admin user (and user exists), the useEffect will redirect.
        // While waiting, we can return null or a loader to prevent flashing the wrong layout.
        if (user) return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
    }

    const handleLogout = React.useCallback(() => {
        try {
            logout();
            setView('home');
        } catch (e) {
            console.error('Logout failed', e);
        }
    }, [logout]);

    return (
        <div className="min-h-screen bg-cream">
            <Header setView={setView} currentView={view} onLogout={handleLogout} userName={user?.name} />
            <main>
                <div key={typeof view === 'string' ? view : JSON.stringify(view)} className="page-animate">
                    {renderContent()}
                </div>
            </main>
            <footer className="bg-forest-green text-cream mt-8 py-4">
                <div className="container mx-auto text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} TrailsExplorer. Adventure Awaits.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
