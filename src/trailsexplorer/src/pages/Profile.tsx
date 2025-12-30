import React from 'react';
import type { User, Trail } from '../types/index';
import { HeartIcon } from '../data/constants';

export interface ProfileProps {
  user: User;
  onSelectTrail: (id: number) => void;
  trails: Trail[];
}

const Profile: React.FC<ProfileProps> = ({ user, onSelectTrail, trails }) => {
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

export default Profile;

