import React from 'react';
import type { View } from '../types/view';
import { MOCK_SOCIAL_FEED, MOCK_GROUP, MOCK_CHALLENGES } from '../data/constants';

export interface CommunityProps {
  setView: (view: View) => void;
}

const Community: React.FC<CommunityProps> = ({ setView }) => {
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

export default Community;

