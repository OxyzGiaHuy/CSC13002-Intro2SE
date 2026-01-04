
import React, { useState, useEffect, useRef } from 'react';
// lightweight CSS animations used instead of framer-motion for React 19 compatibility
import { GoogleGenAI, Type } from '@google/genai';
import {
    MOCK_TRAILS, MOCK_USER, MOCK_GUIDEBOOK_ARTICLES, MOCK_MARKETPLACE_ITEMS,
    MOCK_CHALLENGES, MOCK_SOCIAL_FEED, MOCK_WEATHER, MOCK_VOICE_LOGS, MOCK_GROUP,
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
import Header from './src/components/layout/Header';
import LoginPage from './src/pages/Login';
import RegisterPage from './src/pages/Register';
import { useAuth } from './src/context/AuthContext';
import Home from './src/pages/Home';
import Discover from './src/pages/Discover';
import TrailDetail from './src/pages/TrailDetail';
import Planner from './src/pages/Planner';
import Community from './src/pages/Community';
import Profile from './src/pages/Profile';

// --- OTHER COMPONENTS (MapView, GroupView, Login, Register) ---
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
                <Logo imageSrc={logoImage} size="lg" showText={true} />
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
                <Logo imageSrc={logoImage} size="lg" showText={true} />
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
    const { user, isAuthenticated, login, register, logout } = useAuth();

    useEffect(() => {
        console.log('[App] auth change', { user, isAuthenticated });
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
                setTrails(loadedTrails);
            } catch (error) {
                console.error('Failed to load trails:', error);
                setTrails(MOCK_TRAILS); // Fallback to mock data
            }
            setIsLoadingTrails(false);
        };
        loadTrails();
    }, []);

    // wrappers so Login/Register pages (which expect callbacks) work
    const handleLogin = (email: string) => {
        login(email);
        setView('home');
    };

    const handleRegister = (name: string) => {
        register(name);
        setView('home');
    };
    
    const handleLogout = () => {
        logout();
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
                if (user) {
                    return <GroupView group={MOCK_GROUP} currentUser={user} onBack={() => setView('community')} />;
                }
                return null;
            case 'profile':
                 if (user) {
                    return <Profile user={user} onSelectTrail={handleSelectTrail} trails={trails} />;
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
                    ? <LoginPage setAuthView={setAuthView} /> 
                    : <RegisterPage setAuthView={setAuthView} />
                }
            </div>
        )
    }

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
