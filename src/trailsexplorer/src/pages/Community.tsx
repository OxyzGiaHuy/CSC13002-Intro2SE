import React, { useState, useEffect } from 'react';
import type { View } from '../types/view';
import { MOCK_SOCIAL_FEED, MOCK_GROUP, MOCK_CHALLENGES, MOCK_MARKETPLACE_ITEMS } from '../data/constants';
import type { SocialPost, MarketplaceItem } from '../types/index';

// Community now supports posting, marketplace, and cart

export interface CommunityProps {
    setView: (view: View) => void;
}

export const Community: React.FC<CommunityProps> = ({ setView }) => {
    const [posts, setPosts] = useState<SocialPost[]>(() => {
        try {
            const raw = localStorage.getItem('community_posts');
            return raw ? JSON.parse(raw) : MOCK_SOCIAL_FEED;
        } catch {
            return MOCK_SOCIAL_FEED;
        }
    });
    const [newPostText, setNewPostText] = useState('');
    const [marketItems, setMarketItems] = useState<MarketplaceItem[]>(MOCK_MARKETPLACE_ITEMS);
    const [cart, setCart] = useState<MarketplaceItem[]>([]);
    const [showSellModal, setShowSellModal] = useState(false);
    const [sellForm, setSellForm] = useState({ name: '', price: '', condition: 'Used' });

    useEffect(() => {
        localStorage.setItem('community_posts', JSON.stringify(posts));
    }, [posts]);

    const handlePost = () => {
        if (!newPostText.trim()) return;
        const p: SocialPost = {
            id: Date.now(),
            author: 'You',
            avatarUrl: 'https://picsum.photos/seed/me/40/40',
            content: newPostText,
            trailName: 'Local Trail',
        };
        setPosts(prev => [p, ...prev]);
        setNewPostText('');
    };

    const handleAddToCart = (item: MarketplaceItem) => {
        setCart(prev => [...prev, item]);
    };

    const handleSellSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const item: MarketplaceItem = {
            id: Date.now(),
            name: sellForm.name,
            price: Number(sellForm.price) || 0,
            imageUrl: 'https://picsum.photos/seed/newitem/400/300',
            seller: 'You',
            condition: sellForm.condition as any,
        };
        setMarketItems(prev => [item, ...prev]);
        setShowSellModal(false);
        setSellForm({ name: '', price: '', condition: 'Used' });
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-display text-forest-green mb-6 text-center">Community Hub</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <textarea value={newPostText} onChange={e => setNewPostText(e.target.value)} placeholder="What's on your mind?" className="w-full p-3 border rounded-md" />
                        <div className="flex justify-between mt-3">
                            <div className="flex gap-2">
                                <button onClick={() => setShowSellModal(true)} className="px-3 py-2 bg-gray-100 rounded-md">Sell Item</button>
                            </div>
                            <button onClick={handlePost} className="px-4 py-2 bg-sage-green text-white rounded-md">Post</button>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold font-display text-forest-green mb-4">Activity Feed</h3>
                    <div className="space-y-6">
                        {posts.map(post => (
                            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex items-center mb-2">
                                    <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full mr-3" />
                                    <div>
                                        <p className="font-bold">{post.author}</p>
                                        <p className="text-sm text-gray-500">on {post.trailName}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">{post.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">Marketplace</h3>
                        <div className="space-y-4">
                            {marketItems.map(item => (
                                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className="font-semibold truncate">{item.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{item.seller} • {item.condition}</p>
                                        <p className="text-sm text-earth-brown font-bold">{item.price.toLocaleString()} VND</p>
                                    </div>
                                    <button onClick={() => handleAddToCart(item)} className="ml-auto px-4 py-2 bg-sage-green text-white rounded-md whitespace-nowrap flex-shrink-0 hover:bg-forest-green transition-colors font-medium text-sm">Add to Cart</button>
                                </div>
                            ))}
                        </div>
                    </div>
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

            {/* Sell Modal */}
            {showSellModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Sell Item</h3>
                        <form onSubmit={handleSellSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm">Name</label>
                                <input value={sellForm.name} onChange={e => setSellForm(s => ({ ...s, name: e.target.value }))} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm">Price</label>
                                <input value={sellForm.price} onChange={e => setSellForm(s => ({ ...s, price: e.target.value }))} className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm">Condition</label>
                                <select value={sellForm.condition} onChange={e => setSellForm(s => ({ ...s, condition: e.target.value }))} className="w-full p-2 border rounded">
                                    <option>New</option>
                                    <option>Like New</option>
                                    <option>Used</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowSellModal(false)} className="px-3 py-2">Cancel</button>
                                <button type="submit" className="px-3 py-2 bg-sage-green text-white rounded">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;

