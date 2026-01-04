import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { View } from '../types/view';
import { MOCK_SOCIAL_FEED, MOCK_GROUP, MOCK_CHALLENGES, MOCK_MARKETPLACE_ITEMS } from '../data/constants';
import type { SocialPost, MarketplaceItem } from '../types/index';

// Community now supports posting, marketplace, and cart

export interface CommunityProps {
  setView: (view: View) => void;
}

export const Community: React.FC<CommunityProps> = ({ setView }) => {
    const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => {
        useEffect(() => {
            const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
            document.addEventListener('keydown', onKey);
            return () => document.removeEventListener('keydown', onKey);
        }, [onClose]);

        if (typeof document === 'undefined') return null;
        return ReactDOM.createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
                <div onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>,
            document.body
        );
    };
    const [posts, setPosts] = useState<SocialPost[]>(() => {
        try {
            const raw = localStorage.getItem('community_posts');
            return raw ? JSON.parse(raw) : MOCK_SOCIAL_FEED;
        } catch {
            return MOCK_SOCIAL_FEED;
        }
    });
    const [newPostText, setNewPostText] = useState('');
    const [newPostImage, setNewPostImage] = useState<string | null>(null);
    const [marketItems, setMarketItems] = useState<MarketplaceItem[]>(() => {
        try {
            const raw = localStorage.getItem('market_items');
            return raw ? JSON.parse(raw) : MOCK_MARKETPLACE_ITEMS;
        } catch {
            return MOCK_MARKETPLACE_ITEMS;
        }
    });
    const [cart, setCart] = useState<MarketplaceItem[]>(() => {
        try {
            const raw = localStorage.getItem('market_cart');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });
    const [showSellModal, setShowSellModal] = useState(false);
    const [sellForm, setSellForm] = useState({ name: '', price: '', condition: 'Used', imagePreview: '' });
    const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

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
            imageUrl: newPostImage || undefined,
        };
        setPosts(prev => [p, ...prev]);
        setNewPostText('');
        setNewPostImage(null);
    };

    const handleNewPostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) { setNewPostImage(null); return; }
        const reader = new FileReader();
        reader.onload = () => setNewPostImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleAddToCart = (item: MarketplaceItem) => {
        setCart(prev => [...prev, item]);
    };

    const handleOpenSellModalForItem = (item: MarketplaceItem) => {
        // scroll clicked card into center of viewport for focus
        const el = itemRefs.current[item.id];
        if (el && typeof el.scrollIntoView === 'function') {
            try {
                el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            } catch (e) {
                // ignore
            }
        }
        setSellForm({
            name: item.name,
            price: String(item.price || ''),
            condition: item.condition || 'Used',
            imagePreview: item.imageUrl || '',
        });
        setShowSellModal(true);
    };

    useEffect(() => {
        try { localStorage.setItem('market_items', JSON.stringify(marketItems)); } catch {}
    }, [marketItems]);
    useEffect(() => {
        try { localStorage.setItem('market_cart', JSON.stringify(cart)); } catch {}
    }, [cart]);

    const handleSellSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const item: MarketplaceItem = {
            id: Date.now(),
            name: sellForm.name,
            price: Number(sellForm.price) || 0,
            imageUrl: sellForm.imagePreview || 'https://picsum.photos/seed/newitem/400/300',
            seller: 'You',
            condition: sellForm.condition as any,
        };
        setMarketItems(prev => [item, ...prev]);
        setShowSellModal(false);
        setSellForm({ name: '', price: '', condition: 'Used', imagePreview: '' });
    };

    const handleSellImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) { setSellForm(s => ({ ...s, imagePreview: '' })); return; }
        const reader = new FileReader();
        reader.onload = () => setSellForm(s => ({ ...s, imagePreview: reader.result as string }));
        reader.readAsDataURL(file);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
             <h2 className="text-3xl font-display text-forest-green mb-6 text-center">Community Hub</h2>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <textarea value={newPostText} onChange={e => setNewPostText(e.target.value)} placeholder="What's on your mind?" className="w-full p-3 border rounded-md" />
                        <div className="mt-2">
                            <input type="file" accept="image/*" onChange={handleNewPostImageChange} />
                            {newPostImage && <img src={newPostImage} alt="preview" className="mt-2 w-full max-h-48 object-cover rounded" />}
                        </div>
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
                            <div key={post.id} className="bg-white p-4 rounded-lg shadow-md item-animate">
                                <div className="flex items-center mb-2">
                                    <img src={post.avatarUrl} alt={post.author} className="w-10 h-10 rounded-full mr-3" />
                                    <div>
                                        <p className="font-bold">{post.author}</p>
                                        <p className="text-sm text-gray-500">on {post.trailName}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">{post.content}</p>
                                {post.imageUrl && <img src={post.imageUrl} alt="post" className="mt-2 rounded max-h-72 w-full object-cover" />}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-bold font-display text-forest-green mb-4">Marketplace</h3>
                        <div className="space-y-4">
                            {marketItems.map(item => (
                                <div key={item.id} ref={el => itemRefs.current[item.id] = el} className="bg-white p-4 rounded-lg shadow-md flex items-center item-animate">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{item.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{item.seller} • {item.condition}</p>
                                        <p className="text-sm text-earth-brown font-bold">{item.price.toLocaleString()} VND</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <button onClick={() => handleAddToCart(item)} className="px-3 py-2 bg-sage-green text-white rounded-md whitespace-nowrap btn-press">Add to Cart</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenSellModalForItem(item); }} className="px-3 py-2 bg-gray-100 rounded-md text-sm">Sell Item</button>
                                    </div>
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

            {/* Sell Modal (portal) */}
            {showSellModal && (
                <Modal onClose={() => setShowSellModal(false)}>
                    <div className="bg-white p-6 rounded-lg w-full max-w-md modal-content-animate">
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
                            <div>
                                <label className="block text-sm">Image</label>
                                <input type="file" accept="image/*" onChange={handleSellImageChange} />
                                {sellForm.imagePreview && <img src={sellForm.imagePreview} alt="sell preview" className="mt-2 w-full max-h-48 object-cover rounded" />}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowSellModal(false)} className="px-3 py-2">Cancel</button>
                                <button type="submit" className="px-3 py-2 bg-sage-green text-white rounded">Submit</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Community;

