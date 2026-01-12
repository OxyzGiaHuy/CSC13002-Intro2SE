import React, { useState, useEffect, useRef } from 'react';
import type { User, Trail, ItineraryPlan, ItineraryDay } from '../types/index';
import type { View } from '../types/view';
import { HeartIcon } from '../data/constants';
import { useAuth } from '../context/AuthContext';
import { getSavedPlans } from '../../services/geminiService';
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
    const auth = useAuth();
    const lang = auth?.language || 'en';
    const T = useTranslations(lang);
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
    const [groups, setGroups] = useState<string[]>(['Weekend Hikers', 'Sapa Adventure']);
    const [newGroup, setNewGroup] = useState('');
    const [savedPlans, setSavedPlans] = useState<ItineraryPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<ItineraryPlan | null>(null);

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
        auth.updateProfile(form);
        setIsEditing(false);
        setToast(T.profile.saved);
        setTimeout(() => setToast(null), 2000);
    };

    if (isEditing) {
        return (
            <div className="min-h-screen bg-[#F0F9FF] pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 text-[#0EA5E9] hover:text-[#06B6D4] font-semibold mb-8 transition-colors"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" /> {T.profile.back}
                    </button>

                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-2">{T.profile.editProfile}</h1>
                        <p className="text-[#0F172A]/60 mb-8">{T.profile.updateYourInfo}</p>

                        <div className="space-y-8">
                            {/* Avatar Section */}
                            <div>
                                <label className="block text-sm font-bold uppercase tracking-wider text-[#0EA5E9] mb-4">{T.profile.profilePhoto}</label>
                                <div className="flex items-end gap-6">
                                    <div className="relative">
                                        <img 
                                            src={avatarPreview} 
                                            alt="preview" 
                                            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#0EA5E9]/20 shadow-lg" 
                                        />
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-6 py-3 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white rounded-xl hover:shadow-lg font-bold flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
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
                                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.profile.nameLabel}</label>
                                    <input 
                                        value={form.name} 
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[#F0F9FF] focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#E0F2FE] outline-none transition-all bg-[#F0F9FF]/50"
                                        placeholder={T.profile.nameLabel}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.profile.phoneLabel}</label>
                                    <input 
                                        value={form.phone} 
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[#F0F9FF] focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#E0F2FE] outline-none transition-all bg-[#F0F9FF]/50"
                                        placeholder="+84..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.profile.city}</label>
                                    <input 
                                        value={form.home_city} 
                                        onChange={e => setForm(f => ({ ...f, home_city: e.target.value }))} 
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[#F0F9FF] focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#E0F2FE] outline-none transition-all bg-[#F0F9FF]/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.profile.country}</label>
                                    <input 
                                        value={form.home_country} 
                                        onChange={e => setForm(f => ({ ...f, home_country: e.target.value }))} 
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[#F0F9FF] focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#E0F2FE] outline-none transition-all bg-[#F0F9FF]/50"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-bold text-[#0F172A] mb-2">{T.profile.bioLabel}</label>
                                <textarea 
                                    value={form.bio} 
                                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} 
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[#F0F9FF] focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#E0F2FE] outline-none transition-all resize-none bg-[#F0F9FF]/50"
                                    rows={4}
                                    placeholder={T.profile.bioPlaceholder}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={handleSaveProfile} 
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" /> {T.profile.saveChanges}
                                </button>
                                <button 
                                    onClick={() => setIsEditing(false)} 
                                    className="flex-1 px-6 py-4 bg-[#F0F9FF] text-[#0EA5E9] rounded-xl font-bold hover:bg-[#E0F2FE] transition-all"
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
        <div className="min-h-screen bg-[#F0F9FF]">
            {/* Hero Section - Profile Header */}
            <div className="bg-gradient-to-br from-[#0EA5E9] via-[#06B6D4] to-[#10B981] pt-12 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-white/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                            <img 
                                src={avatarPreview} 
                                alt={user.name} 
                                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover ring-4 ring-white shadow-2xl" 
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="text-white flex-1 text-center sm:text-left">
                            <h1 className="text-4xl sm:text-5xl font-bold mb-2">{user.name}</h1>
                            <p className="text-white/90 text-lg mb-3 flex items-center gap-2 justify-center sm:justify-start">
                                @{user.email?.split('@')[0] || 'trekker'} 
                                {(user.phone || user.bio) && <span className="w-1 h-1 bg-white/60 rounded-full"></span>}
                            </p>
                            {user.bio && (
                                <p className="text-white/85 text-base italic max-w-xl">"{user.bio}"</p>
                            )}
                            {(user.phone || user.home_city || user.home_country) && (
                                <div className="flex flex-wrap gap-3 justify-center sm:justify-start mt-4 text-white/80 text-sm">
                                    {user.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" /> {user.phone}
                                        </span>
                                    )}
                                    {(user.home_city || user.home_country) && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" /> {[user.home_city, user.home_country].filter(Boolean).join(', ')}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 w-full sm:w-auto">
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="px-6 py-3 bg-white text-[#0EA5E9] rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" /> {T.profile.editProfile}
                            </button>
                            <button 
                                onClick={() => auth.logout()} 
                                className="px-6 py-3 bg-red-500/80 hover:bg-red-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> {T.profile.logout}
                            </button>
                            <div className="lang-toggle bg-white/20 backdrop-blur-sm border border-white/30">
                                <Globe className="w-4 h-4 text-white flex-shrink-0" />
                                <div className="text-xs text-white font-bold">EN</div>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input 
                                        type="checkbox" 
                                        checked={lang === 'vi'} 
                                        onChange={e => auth.setLanguage(e.target.checked ? 'vi' : 'en')} 
                                        className="sr-only"
                                    />
                                    <div className="w-10 h-5 bg-white/30 rounded-full shadow-inner transition-colors"></div>
                                    <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300" style={{ transform: lang === 'vi' ? 'translateX(20px)' : 'translateX(0)' }} />
                                </label>
                                <div className="text-xs text-white font-bold">VI</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Overlapping Hero */}
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: <Activity className="w-6 h-6" />, value: user.totalKm || 0, label: T.profile.stats.kmTrekked },
                        { icon: <Mountain className="w-6 h-6" />, value: user.avgAltitude || 0, label: T.profile.stats.avgAltitude },
                        { icon: <Clock className="w-6 h-6" />, value: user.avgTimeHr || 0, label: T.profile.stats.avgTime },
                        { icon: <Map className="w-6 h-6" />, value: user.tripHistory.length, label: T.profile.stats.tripsCompleted }
                    ].map((stat, idx) => (
                        <div 
                            key={idx}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-l-4 border-[#0EA5E9]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-[#F0F9FF] rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <div className="text-[#0EA5E9]">{stat.icon}</div>
                                </div>
                                <Zap className="w-5 h-5 text-[#0EA5E9]/20 group-hover:text-[#0EA5E9]/40 transition-colors" />
                            </div>
                            <div className="text-3xl font-bold text-[#0EA5E9] mb-1">{stat.value}</div>
                            <div className="text-xs font-bold text-[#0F172A]/60 uppercase tracking-wide">{stat.label}</div>
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
                                <div className="p-3 bg-[#F0F9FF] rounded-xl">
                                    <Users className="w-6 h-6 text-[#0EA5E9]" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#0F172A]">{T.profile.myGroups}</h2>
                            </div>

                            {/* Add Group */}
                            <div className="flex gap-2 mb-6">
                                <input
                                    value={newGroup}
                                    onChange={e => setNewGroup(e.target.value)}
                                    placeholder={T.profile.newGroupName}
                                    className="flex-1 px-4 py-3 border-2 border-[#F0F9FF] rounded-lg focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#E0F2FE] outline-none transition-all bg-[#F0F9FF]/50"
                                />
                                <button
                                    onClick={() => { if (newGroup.trim()) { setGroups(g => [newGroup.trim(), ...g]); setNewGroup(''); } }}
                                    className="px-6 py-3 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white rounded-lg hover:shadow-lg font-bold transition-all"
                                >
                                    {T.profile.create}
                                </button>
                            </div>

                            {/* Groups List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {groups.map((g, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] rounded-xl hover:shadow-lg transition-all group border-l-4 border-[#0EA5E9]/50 hover:border-[#0EA5E9] cursor-pointer">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {g.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-[#0F172A] truncate">{g}</span>
                                        </div>
                                        <button onClick={() => setView({ view: 'group', name: g })} className="text-[#0EA5E9] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm flex items-center gap-1 ml-2 flex-shrink-0">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Trip History Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <h2 className="text-2xl font-bold text-[#0F172A] mb-6">{T.profile.tripHistory}</h2>
                            {user.tripHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {user.tripHistory.map(trail => (
                                        <div 
                                            key={trail.id} 
                                            onClick={() => onSelectTrail(trail.id)} 
                                            className="flex items-center gap-4 p-4 hover:bg-[#F0F9FF] rounded-xl transition-all cursor-pointer group border-l-4 border-transparent hover:border-[#0EA5E9]"
                                        >
                                            <img src={trail.imageUrl} alt={trail.name} className="w-16 h-16 rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0" />
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-bold text-[#0F172A] group-hover:text-[#0EA5E9] transition-colors">{trail.name}</h4>
                                                <p className="text-sm text-[#0F172A]/60 flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" /> {trail.location}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-[#F0F9FF] text-[#0EA5E9] text-xs font-bold rounded-full flex-shrink-0">{T.profile.completed}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-[#F0F9FF]/30 rounded-xl border-2 border-dashed border-[#0EA5E9]/20">
                                    <Map className="w-12 h-12 text-[#0EA5E9]/30 mx-auto mb-3" />
                                    <p className="text-[#0F172A]/60 font-medium mb-3">{T.profile.noTrips}</p>
                                    <button onClick={() => setView('discover')} className="text-[#0EA5E9] text-sm font-bold hover:underline">{T.profile.exploreLater}</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-8">
                        {/* Saved Plans */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-[#F0F9FF] rounded-xl">
                                    <Calendar className="w-6 h-6 text-[#0EA5E9]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A]">{T.profile.savedPlans}</h3>
                            </div>

                            {savedPlans.length > 0 ? (
                                <div className="space-y-3">
                                    {savedPlans.slice(0, 5).map(plan => (
                                        <div 
                                            key={plan.id} 
                                            className="bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer group border-l-4 border-[#0EA5E9]/30 hover:border-[#0EA5E9]"
                                            onClick={() => setSelectedPlan(plan)}
                                        >
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <h4 className="font-bold text-[#0EA5E9] group-hover:text-[#0284C7] text-sm">{plan.location || `Trip #${plan.id}`}</h4>
                                                <span className="text-xs bg-white px-2 py-1 rounded-full border border-[#0EA5E9]/20 font-bold text-[#0EA5E9] flex-shrink-0">{plan.duration}d</span>
                                            </div>
                                            <p className="text-xs text-[#0F172A]/60 line-clamp-2 mb-2">
                                                {plan.plan[0]?.highlights.slice(0, 2).join(', ')}...
                                            </p>
                                            <button className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider hover:text-[#0284C7] transition-colors">{T.profile.viewDetails}</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-[#F0F9FF]/30 rounded-xl border-2 border-dashed border-[#0EA5E9]/20">
                                    <Calendar className="w-8 h-8 text-[#0EA5E9]/30 mx-auto mb-2" />
                                    <p className="text-xs text-[#0F172A]/60 mb-3 font-medium">{T.profile.noPlans}</p>
                                    <button onClick={() => setView('planner')} className="text-[#0EA5E9] text-xs font-bold hover:underline">{T.profile.createPlan}</button>
                                </div>
                            )}
                        </div>

                        {/* Favorites */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-[#FFE4E4] rounded-xl">
                                    <HeartIcon className="w-6 h-6 text-red-500" filled />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A]">{T.profile.favorites}</h3>
                            </div>

                            {favoriteTrails.length > 0 ? (
                                <div className="space-y-2">
                                    {favoriteTrails.slice(0, 5).map(trail => (
                                        <div 
                                            key={trail.id} 
                                            onClick={() => onSelectTrail(trail.id)} 
                                            className="flex items-center gap-3 p-3 hover:bg-[#FFE4E4]/30 rounded-lg cursor-pointer transition-all group border-l-4 border-transparent hover:border-red-500"
                                        >
                                            <img src={trail.imageUrl} alt={trail.name} className="w-10 h-10 rounded-lg object-cover group-hover:shadow-md transition-shadow flex-shrink-0" />
                                            <div className="min-w-0 flex-grow">
                                                <p className="font-semibold text-xs text-[#0F172A] truncate group-hover:text-[#0EA5E9]">{trail.name}</p>
                                                <p className="text-xs text-[#0F172A]/50 truncate">{trail.location}</p>
                                            </div>
                                            <HeartIcon className="w-4 h-4 text-red-500 flex-shrink-0" filled />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-[#FFE4E4]/20 rounded-xl border-2 border-dashed border-red-200">
                                    <HeartIcon className="w-8 h-8 text-red-300 mx-auto mb-2" filled />
                                    <p className="text-xs text-[#0F172A]/60 font-medium mb-3">{T.profile.noFavorites}</p>
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
                        <div className="p-6 border-b-2 border-[#F0F9FF] flex justify-between items-start bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE]">
                            <div>
                                <h3 className="text-2xl font-bold text-[#0EA5E9]">{selectedPlan.location}</h3>
                                <p className="text-sm text-[#0F172A]/60 flex items-center gap-1 mt-1">
                                    <Calendar className="w-4 h-4" /> {selectedPlan.duration} {T.profile.days}
                                </p>
                            </div>
                            <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-white/50 rounded-full transition-colors flex-shrink-0">
                                <X className="w-6 h-6 text-[#0EA5E9]" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {selectedPlan.plan.map((day: ItineraryDay) => (
                                <div key={day.day} className="relative pl-6 border-l-4 border-[#0EA5E9]/30 pb-6 last:border-0">
                                    <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#0EA5E9] to-[#06B6D4] border-2 border-white shadow-md"></div>
                                    <h4 className="font-bold text-lg text-[#0EA5E9] mb-3">Day {day.day}: {day.title}</h4>
                                    <div className="bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] rounded-xl p-4 space-y-3 border-2 border-[#0EA5E9]/10">
                                        <p className="text-sm text-[#0F172A] font-medium">📍 {day.route} ({day.distance_km} km)</p>
                                        {day.highlights.length > 0 && (
                                            <div>
                                                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">✨ {T.profile.highlights}</span>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {day.highlights.map((h, i) => (
                                                        <span key={i} className="text-xs bg-white border-2 border-[#0EA5E9]/20 px-3 py-1 rounded-lg text-[#0F172A] font-medium">{h}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {day.camping_suggestion && (
                                            <p className="text-sm text-[#0F172A]">🏕️ {day.camping_suggestion}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t-2 border-[#F0F9FF] bg-[#F0F9FF]/30 flex justify-end">
                            <button onClick={() => setSelectedPlan(null)} className="px-6 py-2 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white rounded-lg hover:shadow-lg font-bold transition-all">
                                {T.profile.close}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-gradient-to-r from-[#0EA5E9] to-[#06B6D4] text-white px-6 py-4 rounded-xl shadow-2xl font-semibold animate-slideUp">
                    ✓ {toast}
                </div>
            )}
        </div>
    );
};

export default Profile;

