import React, { useState, useEffect, useRef } from 'react';
import type { User, Trail, ItineraryPlan, ItineraryDay } from '../types/index';
import type { View } from '../types/view';
import { HeartIcon } from '../data/constants';
import { useAuth } from '../context/AuthContext';
import { getSavedPlans } from '../../services/geminiService';
import { getAdminProfileData } from '../services/adminService';
import { User as UserIcon, Phone, MapPin, Activity, Mountain, Clock, Map, X, Calendar, ArrowRight, Upload, Users, Zap, Globe, Settings, Edit3, LogOut, Check } from 'lucide-react';
import { useTranslations } from '../data/i18n';
import './profile.css';

export interface ProfileProps {
    user: User;
    onSelectTrail: (id: number) => void;
    trails: Trail[];
    setView: (view: View) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onSelectTrail, trails, setView }) => {
    const { language, joinedGroups, updateProfile, logout, setLanguage } = useAuth();
    const lang = language || 'en';
    const T = useTranslations(lang);
    const isAdmin = user?.role === 'admin';
    const favoriteTrails = trails.filter(t => t.isFavorited);

    const [isEditing, setIsEditing] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>(user.avatarUrl);

    const [form, setForm] = useState({
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio || '',
        phone: user.phone || '',
        home_city: user.home_city || '',
        home_country: user.home_country || ''
    });
    const [newGroup, setNewGroup] = useState('');
    const [savedPlans, setSavedPlans] = useState<ItineraryPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<ItineraryPlan | null>(null);

    // Load admin profile data if user is admin
    useEffect(() => {
        const loadAdminData = async () => {
            if (!isAdmin) return;
            try {
                const adminData = await getAdminProfileData();
                if (adminData) {
                    // Update form with admin data from DB
                    setForm(prev => ({
                        ...prev,
                        name: adminData.full_name || adminData.username || prev.name,
                        bio: adminData.bio || prev.bio,
                        phone: adminData.phone || prev.phone,
                        home_city: adminData.home_city || prev.home_city,
                        home_country: adminData.home_country || prev.home_country
                    }));
                    if (adminData.avatar_url) {
                        setAvatarPreview(adminData.avatar_url);
                    }
                }
            } catch (err) {
                console.error('[Profile] Error loading admin data:', err);
            }
        };
        loadAdminData();
    }, [isAdmin]);

    useEffect(() => {
        const fetchPlans = async () => {
            const plans = await getSavedPlans();
            setSavedPlans(plans);
        };
        fetchPlans();
    }, []);

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
            setAvatarPreview(user.avatarUrl);
        }
    }, [user, isEditing]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setAvatarPreview(result);
                setForm(f => ({ ...f, avatarUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        if (!form.name || form.name.trim().length === 0) {
            setToast(T.profile.error.nameEmpty);
            setTimeout(() => setToast(null), 2500);
            return;
        }
        updateProfile(form);
        setIsEditing(false);
        setToast(T.profile.saved);
        setTimeout(() => setToast(null), 2000);
    };

    if (isEditing) {
        return (
            <div className="min-h-screen bg-cream pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 text-forest-green hover:text-sage-green font-semibold mb-8 transition-colors"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" /> {T.profile.back}
                    </button>

                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{T.profile.editProfile}</h1>
                        <p className="text-gray-900/60 mb-8">{T.profile.updateYourInfo}</p>

                        <div className="space-y-8">
                            {/* Avatar Section */}
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-forest-green mb-4">{T.profile.profilePhoto}</label>
                                <div className="flex items-end gap-6">
                                    <div className="relative">
                                        <img
                                            src={avatarPreview}
                                            alt="preview"
                                            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-forest-green/20 shadow-lg"
                                        />
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-6 py-3 bg-gradient-to-r from-sage-green to-forest-green text-white rounded-xl hover:shadow-lg font-bold flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                                    >
                                        <Upload className="w-5 h-5" /> {T.profile.changePhoto}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Basic Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">{T.profile.nameLabel}</label>
                                    <input
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-green-50 focus:border-forest-green focus:ring-2 focus:ring-green-100 outline-none transition-all bg-green-50/50"
                                        placeholder={T.profile.nameLabel}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">{T.profile.phoneLabel}</label>
                                    <input
                                        value={form.phone}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-green-50 focus:border-forest-green focus:ring-2 focus:ring-green-100 outline-none transition-all bg-green-50/50"
                                        placeholder="+84..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">{T.profile.city}</label>
                                    <input
                                        value={form.home_city}
                                        onChange={e => setForm(f => ({ ...f, home_city: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-green-50 focus:border-forest-green focus:ring-2 focus:ring-green-100 outline-none transition-all bg-green-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">{T.profile.country}</label>
                                    <input
                                        value={form.home_country}
                                        onChange={e => setForm(f => ({ ...f, home_country: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-green-50 focus:border-forest-green focus:ring-2 focus:ring-green-100 outline-none transition-all bg-green-50/50"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">{T.profile.bioLabel}</label>
                                <textarea
                                    value={form.bio}
                                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-green-50 focus:border-forest-green focus:ring-2 focus:ring-green-100 outline-none transition-all resize-none bg-green-50/50"
                                    rows={4}
                                    placeholder={T.profile.bioPlaceholder}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-sage-green to-forest-green text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" /> {T.profile.saveChanges}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-6 py-4 bg-green-50 text-forest-green rounded-xl font-bold hover:bg-green-100 transition-all"
                                >
                                    {T.profile.cancel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero Section - Profile Header */}
            <div className="bg-gradient-to-br from-forest-green to-forest-green/90 pt-12 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
                        {/* Avatar */}
                        <div className="relative group shrink-0">
                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-white/40 to-white/10 rounded-[2rem] blur-sm opacity-75 group-hover:opacity-100 transition duration-500"></div>
                            <img
                                src={avatarPreview}
                                alt={user.name}
                                className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-[1.75rem] object-cover ring-4 ring-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="text-white flex-1 text-center md:text-left space-y-3">
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-1">{user.name}</h1>
                                <div className="flex items-center gap-2 justify-center md:justify-start text-white/70 font-medium">
                                    <span className="text-sm">@{user.email?.split('@')[0] || 'trekker'}</span>
                                    {(user.phone || user.bio) && <span className="w-1 h-1 bg-white/30 rounded-full"></span>}
                                    {user.phone && <span className="text-sm flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</span>}
                                </div>
                            </div>

                            {user.bio && (
                                <p className="text-white/90 text-sm sm:text-base italic max-w-xl leading-relaxed">
                                    "{user.bio}"
                                </p>
                            )}

                            {(user.home_city || user.home_country) && (
                                <div className="flex items-center gap-1.5 justify-center md:justify-start text-white/80 text-xs font-semibold uppercase tracking-wider">
                                    <MapPin className="w-3.5 h-3.5 text-sage-green" />
                                    <span>{[user.home_city, user.home_country].filter(Boolean).join(', ')}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons & Language */}
                        <div className="flex flex-col gap-3 w-full sm:w-auto md:min-w-[200px]">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full px-5 py-2.5 bg-white text-forest-green rounded-xl font-bold hover:bg-white/90 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                            >
                                <Edit3 className="w-4 h-4 text-forest-green/70 group-hover:scale-110 transition-transform" />
                                {T.profile.editProfile}
                            </button>
                            <button
                                onClick={() => logout()}
                                className="w-full px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-white border border-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4 opacity-70" />
                                {T.profile.logout}
                            </button>

                            <div className="lang-toggle flex items-center justify-between gap-3 bg-black/20 backdrop-blur-xl border border-white/10 p-1.5 px-3 rounded-xl">
                                <span className="text-[10px] text-white/50 font-black tracking-tighter uppercase">Lang</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold transition-colors ${lang === 'en' ? 'text-white' : 'text-white/40'}`}>EN</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={lang === 'vi'}
                                            onChange={e => setLanguage(e.target.checked ? 'vi' : 'en')}
                                            className="sr-only"
                                        />
                                        <div className="w-8 h-4 bg-white/10 rounded-full transition-colors"></div>
                                        <span className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${lang === 'vi' ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </label>
                                    <span className={`text-[10px] font-bold transition-colors ${lang === 'vi' ? 'text-white' : 'text-white/40'}`}>VI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Overlapping Hero */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: <Activity className="w-6 h-6" />, value: user.totalKm || 0, label: T.profile.stats.kmTrekked, color: 'text-forest-green' },
                        { icon: <Mountain className="w-6 h-6" />, value: user.avgAltitude || 0, label: T.profile.stats.avgAltitude, color: 'text-earth-brown' },
                        { icon: <Clock className="w-6 h-6" />, value: user.avgTimeHr || 0, label: T.profile.stats.avgTime, color: 'text-blue-700' },
                        { icon: <Map className="w-6 h-6" />, value: user.tripHistory.length, label: T.profile.stats.tripsCompleted, color: 'text-purple-700' }
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group border-l-4 border-forest-green flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-green-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                    <div className="text-forest-green scale-75 origin-center">{stat.icon}</div>
                                </div>
                                <Zap className="w-3.5 h-3.5 text-forest-green/20 group-hover:text-forest-green/40 transition-colors" />
                            </div>
                            <div>
                                <div className={`text-2xl font-black ${stat.color ? stat.color : 'text-forest-green'} leading-none mb-1`}>{stat.value}</div>
                                <div className="text-[10px] font-black text-gray-900/40 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Groups Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-green-50 rounded-xl">
                                    <Users className="w-6 h-6 text-forest-green" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{T.profile.myGroups}</h2>
                            </div>

                            {/* Add Group */}
                            <div className="flex shadow-sm mb-6 group/input max-w-md">
                                <input
                                    value={newGroup}
                                    onChange={e => setNewGroup(e.target.value)}
                                    placeholder={T.profile.newGroupName}
                                    className="flex-1 px-4 py-3 border-2 border-r-0 border-green-50 rounded-l-xl focus:border-forest-green focus:ring-0 outline-none transition-all bg-green-50/30 font-medium placeholder:text-gray-400"
                                />
                                <button
                                    onClick={async () => {
                                        if (newGroup.trim()) {
                                            try {
                                                const { createGroup } = await import('../services/communityService');
                                                await createGroup({ name: newGroup.trim(), privacy: 'PUBLIC' });
                                                const { refreshGroups } = useAuth();
                                                if (refreshGroups) await refreshGroups();
                                                setNewGroup('');
                                            } catch (err) {
                                                console.error('Failed to create group', err);
                                            }
                                        }
                                    }}
                                    className="px-6 py-3 bg-forest-green text-white rounded-r-xl hover:bg-forest-green/90 font-bold transition-all flex items-center gap-2"
                                >
                                    <Zap className="w-4 h-4 text-sage-green" />
                                    {T.profile.create}
                                </button>
                            </div>

                            {/* Groups List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {joinedGroups.map((g, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-cream/50 rounded-xl hover:bg-white hover:shadow-md transition-all group border border-green-50 hover:border-sage-green/30 cursor-pointer">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {g.avatar_url ? (
                                                <img src={g.avatar_url} className="w-10 h-10 rounded-lg object-cover shadow-sm" alt={g.name} />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-forest-green flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                                                    {g.name?.charAt(0) || '?'}
                                                </div>
                                            )}
                                            <span className="font-bold text-gray-900 truncate tracking-tight">{g.name}</span>
                                        </div>
                                        <button onClick={() => setView({ view: 'group', name: g.name })} className="text-forest-green opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm flex items-center gap-1 ml-2 flex-shrink-0">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {joinedGroups.length === 0 && (
                                    <div className="sm:col-span-2 text-center py-8 text-gray-400 font-medium italic">
                                        No groups joined yet. Adventure awaits!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trip History Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{T.profile.tripHistory}</h2>
                            {user.tripHistory.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.tripHistory.map(trail => {
                                        // Sync with the actual trails data for consistency (images, correct IDs, etc.)
                                        const actualTrail = trails.find(t =>
                                            t.id === trail.id ||
                                            t.name.toLowerCase() === trail.name.toLowerCase() ||
                                            t.name.toLowerCase().includes(trail.name.toLowerCase())
                                        ) || trail;

                                        return (
                                            <div
                                                key={trail.id}
                                                onClick={() => onSelectTrail(actualTrail.id)}
                                                className="group relative bg-cream/40 rounded-2xl overflow-hidden border border-green-100/50 hover:shadow-xl transition-all duration-500 cursor-pointer"
                                            >
                                                <div className="aspect-[16/9] w-full overflow-hidden">
                                                    <img
                                                        src={actualTrail.imageUrl}
                                                        alt={actualTrail.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                                    <div className="absolute top-4 right-4">
                                                        <span className="px-3 py-1 bg-forest-green/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                            {T.profile.completed}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-extrabold text-gray-900 group-hover:text-forest-green transition-colors line-clamp-1">{actualTrail.name}</h4>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                                                            <MapPin className="w-3 h-3 text-sage-green" /> {actualTrail.location}
                                                        </p>
                                                        <ArrowRight className="w-4 h-4 text-forest-green opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-green-50/30 rounded-xl border-2 border-dashed border-forest-green/20">
                                    <Map className="w-12 h-12 text-forest-green/30 mx-auto mb-3" />
                                    <p className="text-gray-900/60 font-medium mb-3">{T.profile.noTrips}</p>
                                    <button onClick={() => setView('discover')} className="text-forest-green text-sm font-bold hover:underline">{T.profile.exploreLater}</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-8">
                        {/* Saved Plans */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-green-50 rounded-xl">
                                    <Calendar className="w-6 h-6 text-forest-green" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{T.profile.savedPlans}</h3>
                            </div>

                            {savedPlans.length > 0 ? (
                                <div className="space-y-3">
                                    {savedPlans.slice(0, 5).map(plan => (
                                        <div
                                            key={plan.id}
                                            className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer group border-l-4 border-sage-green/30 hover:border-sage-green"
                                            onClick={() => setSelectedPlan(plan)}
                                        >
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <h4 className="font-bold text-forest-green group-hover:text-green-800 text-sm">{plan.location || `Trip #${plan.id}`}</h4>
                                                <span className="text-xs bg-white px-2 py-1 rounded-full border border-forest-green/20 font-bold text-forest-green flex-shrink-0">{plan.duration}d</span>
                                            </div>
                                            <p className="text-xs text-gray-900/60 line-clamp-2 mb-2">
                                                {plan.plan[0]?.highlights.slice(0, 2).join(', ')}...
                                            </p>
                                            <button className="text-xs font-bold text-forest-green uppercase tracking-wider hover:text-green-800 transition-colors">{T.profile.viewDetails}</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-green-50/30 rounded-xl border-2 border-dashed border-forest-green/20">
                                    <Calendar className="w-8 h-8 text-forest-green/30 mx-auto mb-2" />
                                    <p className="text-xs text-gray-900/60 mb-3 font-medium">{T.profile.noPlans}</p>
                                    <button onClick={() => setView('planner')} className="text-forest-green text-xs font-bold hover:underline">{T.profile.createPlan}</button>
                                </div>
                            )}
                        </div>

                        {/* Favorites */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-red-100/50 rounded-xl">
                                    <HeartIcon className="w-6 h-6 text-red-500" filled />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{T.profile.favorites}</h3>
                            </div>

                            {favoriteTrails.length > 0 ? (
                                <div className="space-y-2">
                                    {favoriteTrails.slice(0, 5).map(trail => (
                                        <div
                                            key={trail.id}
                                            onClick={() => onSelectTrail(trail.id)}
                                            className="flex items-center gap-3 p-3 hover:bg-red-50/50 rounded-lg cursor-pointer transition-all group border-l-4 border-transparent hover:border-red-500"
                                        >
                                            <img src={trail.imageUrl} alt={trail.name} className="w-10 h-10 rounded-lg object-cover group-hover:shadow-md transition-shadow flex-shrink-0" />
                                            <div className="min-w-0 flex-grow">
                                                <p className="font-semibold text-xs text-gray-900 truncate group-hover:text-forest-green">{trail.name}</p>
                                                <p className="text-xs text-gray-900/50 truncate">{trail.location}</p>
                                            </div>
                                            <HeartIcon className="w-4 h-4 text-red-500 flex-shrink-0" filled />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-red-50/20 rounded-xl border-2 border-dashed border-red-200">
                                    <HeartIcon className="w-8 h-8 text-red-300 mx-auto mb-2" filled />
                                    <p className="text-xs text-gray-900/60 font-medium mb-3">{T.profile.noFavorites}</p>
                                    <button onClick={() => setView('discover')} className="text-red-500 text-xs font-bold hover:underline">{T.profile.addFavorites}</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b-2 border-green-50 flex justify-between items-start bg-gradient-to-r from-green-50 to-green-100">
                            <div>
                                <h3 className="text-2xl font-bold text-forest-green">{selectedPlan.location}</h3>
                                <p className="text-sm text-gray-900/60 flex items-center gap-1 mt-1">
                                    <Calendar className="w-4 h-4" /> {selectedPlan.duration} {T.profile.days}
                                </p>
                            </div>
                            <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-white/50 rounded-full transition-colors flex-shrink-0">
                                <X className="w-6 h-6 text-forest-green" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {selectedPlan.plan.map((day: ItineraryDay) => (
                                <div key={day.day} className="relative pl-6 border-l-4 border-forest-green/30 pb-6 last:border-0">
                                    <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-gradient-to-br from-sage-green to-forest-green border-2 border-white shadow-md"></div>
                                    <h4 className="font-bold text-lg text-forest-green mb-3">Day {day.day}: {day.title}</h4>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 space-y-3 border-2 border-sage-green/10">
                                        <p className="text-sm text-gray-900 font-medium">📍 {day.route} ({day.distance_km} km)</p>
                                        {day.highlights.length > 0 && (
                                            <div>
                                                <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">✨ {T.profile.highlights}</span>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {day.highlights.map((h, i) => (
                                                        <span key={i} className="text-xs bg-white border-2 border-forest-green/20 px-3 py-1 rounded-lg text-gray-900 font-medium">{h}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {day.camping_suggestion && (
                                            <p className="text-sm text-gray-900">🏕️ {day.camping_suggestion}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t-2 border-green-50 bg-green-50/30 flex justify-end">
                            <button onClick={() => setSelectedPlan(null)} className="px-6 py-2 bg-gradient-to-r from-sage-green to-forest-green text-white rounded-lg hover:shadow-lg font-bold transition-all">
                                {T.profile.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-gradient-to-r from-sage-green to-forest-green text-white px-6 py-4 rounded-xl shadow-2xl font-semibold animate-slideUp">
                    ✓ {toast}
                </div>
            )}
        </div>
    );
};

export default Profile;
