import React, { useState, useEffect } from 'react';
import type { User, Trail, ItineraryPlan, ItineraryDay } from '../types/index';
import type { View } from '../types/view';
import { HeartIcon } from '../data/constants';
import { useAuth } from '../context/AuthContext';
import { getSavedPlans } from '../../services/geminiService';
import { User as UserIcon, Phone, MapPin, Activity, Mountain, Clock, Map, X, Calendar, ArrowRight } from 'lucide-react';

export interface ProfileProps {
    user: User;
    onSelectTrail: (id: number) => void;
    trails: Trail[];
    setView: (view: View) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onSelectTrail, trails, setView }) => {
    const favoriteTrails = trails.filter(t => t.isFavorited);
    const auth = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(() => ({
        name: user?.name || '',
        avatarUrl: user?.avatarUrl || '',
        bio: (user as any)?.bio || '',
        phone: (user as any)?.phone || '',
        home_city: (user as any)?.home_city || '',
        home_country: (user as any)?.home_country || ''
    }));
    const [groups, setGroups] = useState<string[]>(['Weekend Hikers', 'Sapa Adventure']);
    const [newGroup, setNewGroup] = useState('');

    // sync form whenever the passed `user` changes (so saved profile updates reflect here)
    useEffect(() => {
        setForm({
            name: user?.name || '',
            avatarUrl: user?.avatarUrl || '',
            bio: (user as any)?.bio || '',
            phone: (user as any)?.phone || '',
            home_city: (user as any)?.home_city || '',
            home_country: (user as any)?.home_country || ''
        });
    }, [user]);

    // Saved AI Plans Section - New Feature
    const [savedPlans, setSavedPlans] = useState<ItineraryPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<ItineraryPlan | null>(null);

    useEffect(() => {
        let mounted = true;
        getSavedPlans().then(plans => {
            if (mounted) setSavedPlans(plans);
        }).catch(() => {});
        return () => { mounted = false; };
    }, []);

    // Sync form with user data when not editing or when user updates
    useEffect(() => {
        if (!isEditing) {
            setForm({
                name: user.name,
                avatarUrl: user.avatarUrl,
                bio: user.bio || '',
                phone: user.phone || '',
                home_city: user.home_city || '',
                home_country: user.home_country || ''
            });
        }
    }, [user, isEditing]);

    const handleSaveProfile = () => {
        auth.updateProfile(form);
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="relative group">
                        <img src={form.avatarUrl} alt={form.name} className="w-32 h-32 rounded-full shadow-lg object-cover ring-4 ring-white" />
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-xs text-center p-2">
                                Change URL in Edit
                            </div>
                        )}
                    </div>

                    <div className="flex-grow space-y-4">
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Display Name</label>
                                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sage-green outline-none" placeholder="Your Name" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Avatar URL</label>
                                    <input value={form.avatarUrl} onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sage-green outline-none" placeholder="https://..." />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Bio</label>
                                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sage-green outline-none" placeholder="Tell us about your adventures..." rows={2} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-sage-green outline-none" placeholder="+84..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                                    <div className="flex gap-2">
                                        <input value={form.home_city} onChange={e => setForm(f => ({ ...f, home_city: e.target.value }))} className="w-1/2 p-2 border rounded-lg" placeholder="City" />
                                        <input value={form.home_country} onChange={e => setForm(f => ({ ...f, home_country: e.target.value }))} className="w-1/2 p-2 border rounded-lg" placeholder="Country" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <h1 className="text-3xl font-display font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                                        @{user.email?.split('@')[0] || 'trekker'} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {user.bio || 'Passionate Trekker'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    {user.phone && <div className="flex items-center gap-1"><Phone className="w-4 h-4 text-sage-green" /> {user.phone}</div>}
                                    {(user.home_city || user.home_country) && (
                                        <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-sage-green" /> {[user.home_city, user.home_country].filter(Boolean).join(', ')}</div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex-shrink-0 flex gap-2">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                                <button onClick={handleSaveProfile} className="px-4 py-2 bg-forest-green text-white rounded-lg hover:bg-green-900 font-medium shadow-sm">Save Changes</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Edit Profile</button>
                                <button onClick={() => auth.logout()} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium border border-red-100">Logout</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Modern Stats */}
                {!isEditing && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                        <div className="p-4 rounded-xl bg-green-50/50 border border-green-100 flex flex-col items-center justify-center gap-1 group hover:bg-green-50 transition-colors">
                            <Activity className="w-6 h-6 text-sage-green mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-3xl font-bold text-forest-green">{user.totalKm}</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Km Trekked</span>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col items-center justify-center gap-1 group hover:bg-amber-50 transition-colors">
                            <Mountain className="w-6 h-6 text-earth-brown mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-3xl font-bold text-earth-brown">{user.avgAltitude}</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Altitude (m)</span>
                        </div>
                        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col items-center justify-center gap-1 group hover:bg-blue-50 transition-colors">
                            <Clock className="w-6 h-6 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-3xl font-bold text-blue-700">{user.avgTimeHr}</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Time (hr)</span>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex flex-col items-center justify-center gap-1 group hover:bg-purple-50 transition-colors">
                            <Map className="w-6 h-6 text-purple-600 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-3xl font-bold text-purple-700">{Array.isArray(user.tripHistory) ? user.tripHistory.length : 0}</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Trips Completed</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Trip History & Favorites */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Groups Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold font-display text-forest-green flex items-center gap-2">
                                <UserIcon className="w-5 h-5" /> My Groups
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    value={newGroup}
                                    onChange={e => setNewGroup(e.target.value)}
                                    placeholder="New group name..."
                                    className="p-2 text-sm border rounded-lg focus:ring-2 focus:ring-sage-green outline-none w-48"
                                />
                                <button
                                    onClick={() => { if (newGroup.trim()) { setGroups(g => [newGroup.trim(), ...g]); setNewGroup(''); } }}
                                    className="px-3 py-2 bg-sage-green text-white rounded-lg text-sm font-bold hover:bg-forest-green transition-colors"
                                >
                                    + Create
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {groups.map((g, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group cursor-pointer border border-transparent hover:border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-sage-green/10 flex items-center justify-center text-sage-green font-bold">
                                            {g.charAt(0)}
                                        </div>
                                        <span className="font-semibold text-gray-700">{g}</span>
                                    </div>
                                    <button onClick={() => setView({ view: 'group', name: g })} className="text-sage-green opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm flex items-center gap-1">
                                        Enter <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold font-display text-forest-green mb-6">Trip History</h3>
                        {Array.isArray(user.tripHistory) && user.tripHistory.length > 0 ? (
                            <div className="space-y-4">
                                {(user.tripHistory || []).map(trail => (
                                    <div key={trail.id} onClick={() => onSelectTrail(trail.id)} className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                        <img src={trail.imageUrl} alt={trail.name} className="w-20 h-20 rounded-xl object-cover shadow-sm mr-4" />
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-gray-900 group-hover:text-forest-green transition-colors">{trail.name}</h4>
                                            <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {trail.location}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Completed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-center text-gray-500 py-8">No trips recorded yet.</p>}
                    </div>
                </div>

                {/* Right Col: Plans & Favorites */}
                <div className="space-y-8">
                    {/* Saved Plans */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> Saved Plans
                        </h3>
                        <div className="space-y-4">
                            {savedPlans.length > 0 ? savedPlans.map(plan => (
                                <div key={plan.id} className="bg-gradient-to-br from-green-50 to-white border border-green-100 p-4 rounded-xl hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedPlan(plan)}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-forest-green">{plan.location || `Trip #${plan.id}`}</h4>
                                        <span className="text-xs bg-white px-2 py-1 rounded-full border border-green-100 font-semibold text-sage-green">{plan.duration} Days</span>
                                    </div>
                                    <div className="text-xs text-gray-600 line-clamp-2 mb-3">
                                        {(plan.plan?.[0]?.highlights || []).join(', ')}...
                                    </div>
                                    <button className="text-xs font-bold text-sage-green uppercase tracking-wider hover:text-forest-green">View Details</button>
                                </div>
                            )) : (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-500 mb-2">No plans yet</p>
                                    <button onClick={() => setView('planner')} className="text-sage-green text-sm font-bold hover:underline">Create a Plan</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Favorites */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4 flex items-center gap-2">
                            <HeartIcon className="w-5 h-5 text-red-500" filled /> Favorites
                        </h3>
                        <div className="space-y-3">
                            {favoriteTrails.length > 0 ? favoriteTrails.map(trail => (
                                <div key={trail.id} onClick={() => onSelectTrail(trail.id)} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                    <img src={trail.imageUrl} alt={trail.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">{trail.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{trail.location}</p>
                                    </div>
                                </div>
                            )) : <p className="text-gray-500 text-sm">No favorites added.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Details Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-2xl font-display font-bold text-forest-green">{selectedPlan.location} Trip</h3>
                                <p className="text-sm text-gray-600">{selectedPlan.duration} Days • Created on {new Date(selectedPlan.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {selectedPlan.plan.map((day: ItineraryDay) => (
                                <div key={day.day} className="relative pl-6 border-l-2 border-sage-green/30 last:border-0 pb-6">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-sage-green border-2 border-white shadow-sm"></div>
                                    <h4 className="font-bold text-lg text-gray-900 mb-1">Day {day.day}: {day.title}</h4>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <p className="text-sm text-gray-700 font-medium">📍 Route: <span className="font-normal">{day.route} ({day.distance_km} km)</span></p>
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase">Highlights</span>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {day.highlights.map((h, i) => (
                                                    <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-700">{h}</span>
                                                ))}
                                            </div>
                                        </div>
                                        {day.camping_suggestion && (
                                            <p className="text-sm text-gray-700">🏕️ <span className="font-semibold">Camping:</span> {day.camping_suggestion}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <button onClick={() => setSelectedPlan(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

