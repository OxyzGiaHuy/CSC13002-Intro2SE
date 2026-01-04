import React, { useState, useEffect } from 'react';
import type { User, Trail } from '../types/index';
import { HeartIcon } from '../data/constants';
import { useAuth } from '../context/AuthContext';

export interface ProfileProps {
  user: User;
  onSelectTrail: (id: number) => void;
  trails: Trail[];
}

const Profile: React.FC<ProfileProps> = ({ user, onSelectTrail, trails }) => {
    const favoriteTrails = trails.filter(t => t.isFavorited);
    const auth = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name: user.name, avatarUrl: user.avatarUrl });
    const [groups, setGroups] = useState<string[]>([]);
    const [newGroup, setNewGroup] = useState('');

    // sync form whenever the passed `user` changes (so saved profile updates reflect here)
    useEffect(() => {
        setForm({ name: user.name, avatarUrl: user.avatarUrl });
    }, [user.name, user.avatarUrl]);

    // persist groups per-user so they survive refresh
    const groupsKey = `user_groups_${user.email || 'default'}`;
    useEffect(() => {
        try {
            const raw = localStorage.getItem(groupsKey);
            if (raw) setGroups(JSON.parse(raw));
        } catch (e) {
            // ignore
        }
    }, [groupsKey]);
    useEffect(() => {
        try {
            localStorage.setItem(groupsKey, JSON.stringify(groups));
        } catch (e) {
            // ignore
        }
    }, [groups, groupsKey]);
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b">
                    <img src={form.avatarUrl} alt={form.name} className="w-24 h-24 rounded-full shadow-md" />
                    <div>
                        {isEditing ? (
                            <div className="space-y-2">
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="p-2 border rounded" />
                                <input value={form.avatarUrl} onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))} className="p-2 border rounded" />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-display text-forest-green">{form.name}</h2>
                                <p className="text-gray-600">Passionate Trekker</p>
                            </>
                        )}
                    </div>
                    <div className="ml-auto">
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button onClick={() => { auth.updateProfile({ name: form.name, avatarUrl: form.avatarUrl }); setIsEditing(false); }} className="px-3 py-2 bg-sage-green text-white rounded">Save</button>
                                <button onClick={() => { setIsEditing(false); setForm({ name: user.name, avatarUrl: user.avatarUrl }); }} className="px-3 py-2">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-3 py-2 bg-gray-100 rounded">Edit Profile</button>
                        )}
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
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold font-display text-forest-green mb-4">Groups</h3>
                    <div className="flex gap-2 mb-4">
                        <input value={newGroup} onChange={e => setNewGroup(e.target.value)} placeholder="Group name" className="p-2 border rounded flex-grow" />
                        <button onClick={() => {
                            const name = newGroup.trim();
                            if (!name) return;
                            setGroups(prev => {
                                const updated = [name, ...prev];
                                try { localStorage.setItem(groupsKey, JSON.stringify(updated)); } catch {}
                                return updated;
                            });
                            setNewGroup('');
                        }} className="px-3 py-2 bg-sage-green text-white rounded">Create Group</button>
                    </div>
                    <ul className="space-y-2">
                        {groups.map((g, i) => (
                            <li key={i} className="bg-gray-50 p-2 rounded item-animate">{g}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;

