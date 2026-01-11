import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { View } from '../types/view';
import { SocialPost, MarketplaceItem, Group, Challenge } from '../types/index';
import { getPosts, createPost, likePost, sharePost, getComments, addComment, getMarketplaceItems, createMarketplaceItem, getGroups, getChallenges, getNotifications, markNotificationAsRead, joinGroup, getGroupMessages, sendGroupMessage, joinChallenge } from '../services/communityService';
import { ArrowRight, MessageSquare, Heart, Share2, Users, ShoppingBag, Trophy, Image as ImageIcon, Search, Filter, Plus, ShoppingCart, Bold, Italic, Link as LinkIcon, List, LayoutGrid, Activity, Bell, X, Send, BookOpen, Check, MessageCircle, CheckCircle } from 'lucide-react';
import { MOCK_GUIDEBOOK_ARTICLES } from '../data/constants';
import { GuidebookArticle } from '../types/index';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';

export interface CommunityProps {
    setView: (view: View) => void;
}

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    if (typeof document === 'undefined') return null;
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4" onClick={onClose}>
            <div onClick={e => e.stopPropagation()} className="relative w-full max-w-6xl">
                {children}
            </div>
        </div>,
        document.body
    );
};

const SIMULATED_USERS = [
    {
        username: 'Alex Mountain',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        bio: 'Alpine climber and mountain photographer based in Chamonix. Always seeking the next summit.',
        location: 'Chamonix, FR',
        stats: { trails: 142, distance: 3420, trips: 56 }
    },
    {
        username: 'Minh Trail',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        bio: 'Lover of Northwest loops and sticky mud. Finding beauty in every step.',
        location: 'Hà Giang, VN',
        stats: { trails: 54, distance: 1250, trips: 22 }
    },
    {
        username: 'Sarah Trailblazer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        bio: 'Ultralight backpacking enthusiast. 3x PCT finisher. Lover of wild places and good coffee.',
        location: 'Seattle, WA',
        stats: { trails: 89, distance: 8200, trips: 34 }
    },
    {
        username: 'Lan Peaks',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        bio: 'City escape artist and morning hiker. The best view follows the hardest climb.',
        location: 'Lâm Đồng, VN',
        stats: { trails: 38, distance: 420, trips: 45 }
    },
    {
        username: 'Chris Peaks',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        bio: 'Peak bagger and trail runner. If there is a hill, I will run up it.',
        location: 'Boulder, CO',
        stats: { trails: 215, distance: 1240, trips: 89 }
    },
    {
        username: 'Jenny Pines',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        bio: 'Wilderness guide and wilderness first responder. Teaching people how to respect nature.',
        location: 'Portland, OR',
        stats: { trails: 67, distance: 980, trips: 112 }
    },
    {
        username: 'Mike Treks',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        bio: 'Gear nerd and winter trekker. Testing the limits of thermal layers.',
        location: 'Anchorage, AK',
        stats: { trails: 45, distance: 2100, trips: 28 }
    },
    {
        username: 'Dương Nomad',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
        bio: 'Capturing the serenity of Central Highlands. Adventure is out there.',
        location: 'Đắk Lắk, VN',
        stats: { trails: 29, distance: 890, trips: 15 }
    }
];

const MediaGallery = ({ images }: { images: string[] }) => {
    if (!images || images.length === 0) return null;
    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'; };
    if (images.length === 1) return <div className="overflow-hidden"><img src={images[0]} onError={handleImgError} className="w-full h-auto max-h-[500px] object-cover" /></div>;
    if (images.length === 2) return <div className="grid grid-cols-2 gap-1 h-64">{images.map((img, i) => <img key={i} src={img} onError={handleImgError} className="w-full h-full object-cover" alt={`media ${i + 1}`} />)}</div>;
    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-80">
            <div className="row-span-2"><img src={images[0]} onError={handleImgError} className="w-full h-full object-cover" /></div>
            <div className="h-full"><img src={images[1]} onError={handleImgError} className="w-full h-full object-cover" /></div>
            <div className="h-full relative overflow-hidden group/more">
                <img src={images[2]} onError={handleImgError} className="w-full h-full object-cover" />
                {images.length > 3 && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-black text-xl">+{images.length - 3}</span></div>}
            </div>
        </div>
    );
};

const SkeletonPulse = () => (
    <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2"><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded w-5/6"></div></div>
        </div>
    </div>
);

const PostSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6 min-h-[400px] animate-pulse">
        <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-gray-200 rounded-full"></div><div className="h-4 bg-gray-200 rounded w-1/4"></div></div>
        <div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-3 bg-gray-100 rounded"></div></div>
        <div className="h-64 bg-gray-100 rounded mt-4"></div>
    </div>
);

const MarketItemSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border p-4 animate-pulse">
        <div className="h-48 bg-gray-100 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
    </div>
);

const ChevronRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>
);

export const Community: React.FC<CommunityProps> = ({ setView: setAppView }) => {
    const [view, setView] = useState<'FEED' | 'MARKET' | 'GROUPS' | 'CHALLENGES' | 'GUIDEBOOK' | 'LEADERBOARD'>('FEED');
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [marketItems, setMarketItems] = useState<MarketplaceItem[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useAuth();

    // Post Detail Modal State
    const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    // New Post State
    const [newPostText, setNewPostText] = useState('');
    const [newPostImage, setNewPostImage] = useState<string | null>(null);

    // Cart (Local for now)
    const [cart, setCart] = useState<MarketplaceItem[]>(() => {
        try {
            const raw = localStorage.getItem('market_cart');
            return raw ? JSON.parse(raw) : [];
        } catch { return []; }
    });

    // Modals state
    const [showSellModal, setShowSellModal] = useState(false);
    const [showChallengesModal, setShowChallengesModal] = useState(false);
    const [sellForm, setSellForm] = useState({ name: '', price: '', condition: 'GOOD', imagePreview: '' });

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const [filterType, setFilterType] = useState('ALL');

    // Chat / Group State
    const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
    const [showChatModal, setShowChatModal] = useState(false);
    const [currentChatGroup, setCurrentChatGroup] = useState<Group | null>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState('');

    // Guidebook State
    const [selectedArticle, setSelectedArticle] = useState<GuidebookArticle | null>(null);

    // Marketplace Filters
    const [marketCategory, setMarketCategory] = useState('ALL');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [debouncedPriceRange, setDebouncedPriceRange] = useState({ min: '', max: '' });
    const [condition, setCondition] = useState('ALL');

    const observerTarget = useRef(null);

    // Debounce Price Range
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPriceRange(priceRange);
        }, 500);
        return () => clearTimeout(timer);
    }, [priceRange]);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery.trim());
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const loadPosts = async (reset = true) => {
        setLoadingPosts(true);
        try {
            const currentPage = reset ? 1 : page + 1;
            const postsData = await getPosts(currentPage, 10, filterType, debouncedSearchQuery, user?.id);
            const postsArr = Array.isArray(postsData) ? postsData : (postsData.data || []);

            if (reset) {
                setPosts(postsArr);
                setPage(1);
            } else {
                setPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.post_id));
                    const newPosts = postsArr.filter((p: any) => !existingIds.has(p.post_id));
                    return [...prev, ...newPosts];
                });
                setPage(currentPage);
            }
            setHasMore(postsArr.length >= 10);
        } catch (err) {
            console.error("Error loading posts:", err);
        } finally {
            setLoadingPosts(false);
        }
    };

    const loadMarketplaceItems = async () => {
        try {
            const items = await getMarketplaceItems({
                category: marketCategory,
                condition,
                price_min: debouncedPriceRange.min ? Number(debouncedPriceRange.min) : undefined,
                price_max: debouncedPriceRange.max ? Number(debouncedPriceRange.max) : undefined,
                search: debouncedSearchQuery
            });
            setMarketItems(Array.isArray(items) ? items : (items.data || []));
        } catch (err) {
            console.error("Market filter error:", err);
        }
    };

    // Initial Fetch (Page 1 + Other Data)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    getGroups(),
                    getChallenges(),
                    getNotifications()
                ]);

                const getArray = (data: any) => {
                    if (Array.isArray(data)) return data;
                    if (data && Array.isArray(data.data)) return data.data;
                    return [];
                };

                if (results[0].status === 'fulfilled') setGroups(getArray(results[0].value));
                if (results[1].status === 'fulfilled') setChallenges(getArray(results[1].value));

            } catch (error) {
                console.error("Critical error fetching community data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        loadPosts();
    }, [filterType, debouncedSearchQuery, user?.id]);

    useEffect(() => {
        loadMarketplaceItems();
    }, [marketCategory, condition, debouncedPriceRange, debouncedSearchQuery]);

    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
    };

    const getSimulatedUser = (postId: any) => {
        if (!postId) {
            return SIMULATED_USERS[0];
        }
        const str = String(postId);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % SIMULATED_USERS.length;
        return SIMULATED_USERS[index];
    };



    const loadMorePosts = async () => {
        if (loadingPosts || !hasMore) return;
        await loadPosts(false);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }
        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [observerTarget, hasMore, loadingPosts, filterType, debouncedSearchQuery, user?.id]);

    const handlePost = async () => {
        if (!newPostText.trim()) return;
        try {
            const newPost = await createPost({
                content: newPostText,
                title: '',
                content_type: 'TEXT',
                media_urls: newPostImage ? [newPostImage] : []
            });
            const postWithUser = {
                ...newPost,
                user: {
                    username: user?.name || 'You',
                    avatar_url: user?.avatarUrl || 'https://ui-avatars.com/api/?name=You&background=random'
                }
            };
            setPosts(prev => [postWithUser, ...prev]);
            setNewPostText('');
            setNewPostImage(null);
        } catch (error: any) {
            console.error("Error creating post:", error);
            const msg = error.response?.data?.message || error.message || "Failed to create post.";
            alert(`Error: ${msg}`);
        }
    };

    const handleNewPostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) { setNewPostImage(null); return; }
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Please select an image under 5MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setNewPostImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleAddToCart = (item: MarketplaceItem) => {
        setCart(prev => [...prev, item]);
        alert(`Added ${item.title} to your bag!`);
    };

    const handleSellSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newItem = await createMarketplaceItem({
                title: sellForm.name,
                price: Number(sellForm.price),
                condition: sellForm.condition,
                image_url: sellForm.imagePreview,
                description: 'User listed item',
                category: 'OTHER'
            });
            setMarketItems(prev => [newItem, ...prev]);
            setShowSellModal(false);
            setSellForm({ name: '', price: '', condition: 'GOOD', imagePreview: '' });
        } catch (error: any) {
            console.error("Error listing item detailed:", error);
            const msg = error.response?.data?.message || error.message || "Failed to list item.";
            alert(`Error: ${msg}`);
        }
    };

    const handleSellImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) { setSellForm(s => ({ ...s, imagePreview: '' })); return; }
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Please select an image under 5MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setSellForm(s => ({ ...s, imagePreview: reader.result as string }));
        reader.readAsDataURL(file);
    };


    // Group Functions
    const handleJoinGroup = async (e: React.MouseEvent, group: Group) => {
        e.stopPropagation();
        try {
            await joinGroup(group.group_id);
            setJoinedGroups(prev => new Set(prev).add(group.group_id));
            alert(`Joined ${group.name} successfully!`);
            // Refresh groups to update member count
            const updatedGroups = await getGroups();
            setGroups(Array.isArray(updatedGroups) ? updatedGroups : (updatedGroups.data || []));
        } catch (error) {
            console.error("Join group failed", error);
            alert("Failed to join group");
        }
    };

    const handleOpenChat = async (group: Group) => {
        setCurrentChatGroup(group);
        setShowChatModal(true);
        try {
            const msgs = await getGroupMessages(group.group_id);
            setChatMessages(Array.isArray(msgs) ? msgs : []);
        } catch (e) {
            console.error("Failed to load messages", e);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || !currentChatGroup) return;
        try {
            const newMsg = await sendGroupMessage(currentChatGroup.group_id, chatInput);
            setChatMessages(prev => [...prev, newMsg]);
            setChatInput('');
        } catch (error) {
            console.error("Send message failed", error);
        }
    };

    const handleLike = async (postId: number) => {
        const post = posts.find(p => p.post_id === postId);
        if (!post) return;

        const isLiked = post.is_liked;
        const newLikeCount = isLiked ? (post.like_count || 1) - 1 : (post.like_count || 0) + 1;

        // Optimistic Update
        setPosts(prev => prev.map(p =>
            p.post_id === postId
                ? { ...p, like_count: newLikeCount, is_liked: !isLiked }
                : p
        ));

        try {
            await likePost(postId);
        } catch (error) {
            console.error("Like failed:", error);
            // Revert on failure
            setPosts(prev => prev.map(p =>
                p.post_id === postId
                    ? { ...p, like_count: isLiked ? newLikeCount + 1 : newLikeCount - 1, is_liked: isLiked }
                    : p
            ));
        }
    };

    const handleShare = async (postId: number) => {
        try {
            setPosts(prev => prev.map(p =>
                p.post_id === postId ? { ...p, share_count: (p.share_count || 0) + 1 } : p
            ));
            await sharePost(postId);
            const postUrl = `${window.location.origin}/community?post=${postId}`;
            await navigator.clipboard.writeText(postUrl);
            alert("Post link copied to clipboard!");

            // Open the post detail modal
            const post = posts.find(p => p.post_id === postId);
            if (post) handleOpenPostDetail(post);

        } catch (error) {
            console.error("Share failed:", error);
            alert("Failed to copy link. Please try again.");
        }
    };

    const getSimulatedComments = (count: number) => {
        const texts = [
            "Tuyệt vời quá bác ơi! 😍",
            "View đỉnh của chóp luôn!",
            "Chuyến này đi hết bao nhiêu lúa vậy ạ?",
            "Cảm giác đứng trên đó chắc phê lắm nhỉ.",
            "Thèm đi quá đi...",
            "Ảnh đẹp xuất sắc!",
            "Cung này có khó đi không bác?",
            "Lên plan đi anh em ơi 🚀",
            "Xin info lịch trình với ạ.",
            "Quá đã!",
            "Thời tiết đẹp thật.",
            "Ước gì được ở đó ngay bây giờ.",
            "10 điểm không có nhưng.",
            "Bác chụp bằng máy gì thế?",
            "Nhìn mê chữ ê kéo dài...",
            "Đẹp như tranh vẽ.",
            "Hóng bài review chi tiết ạ.",
            "Chất lượng quá!",
            "Nhìn chill phết.",
            "Tuyệt phẩm nhân gian!"
        ];

        return Array.from({ length: count }).map((_, i) => ({
            comment_id: `mock-${Date.now()}-${i}`,
            content: texts[i % texts.length],
            created_at: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
            User: SIMULATED_USERS[i % SIMULATED_USERS.length]
        }));
    };

    const handleOpenPostDetail = async (post: SocialPost) => {
        if (!post) {
            return;
        }

        // Ensure user object is preserved when opening modal
        setSelectedPost(post);
        setIsLoadingComments(true);
        // Reset comments to empty array to prevent stale data or render errors
        setComments([]);
        try {
            const data = await getComments(post.post_id);
            if (Array.isArray(data) && data.length > 0) {
                setComments(data);
                // Update selected post comment count to match fetched data
                setSelectedPost(prev => prev ? { ...prev, comment_count: data.length } : null);
            } else if ((post.comment_count || 0) > 0) {
                // Fallback to simulated comments if API returns empty but count > 0
                const mockComments = getSimulatedComments(post.comment_count || 5);
                setComments(mockComments);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error("Failed to load comments", error);
            // Fallback on error if count > 0
            if ((post.comment_count || 0) > 0) {
                const mockComments = getSimulatedComments(post.comment_count || 5);
                setComments(mockComments);
            } else {
                setComments([]);
            }
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPost || !newComment.trim()) return;

        try {
            // @ts-ignore
            const comment = await addComment(selectedPost.post_id, newComment);

            // Optimistically add comment to list with current user details
            const optimisticComment = {
                ...comment,
                User: {
                    username: user?.name || 'You',
                    avatar_url: user?.avatarUrl || 'https://ui-avatars.com/api/?name=You'
                }
            };

            setComments(prev => [...prev, optimisticComment]);
            setNewComment('');

            // Update comment count in BOTH the modal post and the main list
            setSelectedPost(prev => prev ? { ...prev, comment_count: (prev.comment_count || 0) + 1 } : null);
            setPosts(prev => prev.map(p => p.post_id === selectedPost.post_id ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p));

        } catch (error) {
            console.error("Failed to add comment", error);
            alert("Failed to send comment. Please try again.");
        }
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const insertFormat = (format: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = newPostText;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);
        let newText = '';
        let newCursorPos = end;
        switch (format) {
            case 'bold':
                newText = `${before}**${selection || 'bold'}**${after}`;
                newCursorPos = selection ? end + 4 : start + 6;
                break;
            case 'italic':
                newText = `${before}_${selection || 'italic'}_${after}`;
                newCursorPos = selection ? end + 2 : start + 3;
                break;
            case 'link':
                newText = `${before}[${selection || 'link text'}](url)${after}`;
                newCursorPos = selection ? end + 7 : start + 13;
                break;
            case 'list':
                newText = `${before}\n- ${selection || 'list item'}${after}`;
                newCursorPos = selection ? end + 3 : start + 12;
                break;
            default: return;
        }
        setNewPostText(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="xl:col-span-3">
                    {view === 'FEED' && (
                        <>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-2xl mx-auto">
                                <div className="flex gap-4 mb-4">
                                    <img src={user?.avatarUrl || "https://ui-avatars.com/api/?name=You&background=random"} className="w-10 h-10 rounded-full flex-shrink-0" alt="Your avatar" />
                                    <div className="flex-1">
                                        <div className="flex gap-2 mb-2">
                                            <button onClick={() => insertFormat('bold')} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Bold size={16} /></button>
                                            <button onClick={() => insertFormat('italic')} className="p-1 hover:bg-gray-100 rounded text-gray-500"><Italic size={16} /></button>
                                            <button onClick={() => insertFormat('link')} className="p-1 hover:bg-gray-100 rounded text-gray-500"><LinkIcon size={16} /></button>
                                            <button onClick={() => insertFormat('list')} className="p-1 hover:bg-gray-100 rounded text-gray-500"><List size={16} /></button>
                                        </div>
                                        <textarea
                                            ref={textareaRef}
                                            value={newPostText}
                                            onChange={e => setNewPostText(e.target.value)}
                                            placeholder="Share your adventure..."
                                            className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-sage-green resize-none min-h-[100px]"
                                        />
                                    </div>
                                </div>
                                {newPostImage && (
                                    <div className="relative mb-4 ml-14 group">
                                        <img src={newPostImage} alt="preview" className="w-full max-h-60 object-cover rounded-lg" />
                                        <button onClick={() => setNewPostImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">✕</button>
                                    </div>
                                )}
                                <div className="flex justify-between items-center ml-14">
                                    <label className="cursor-pointer text-gray-500 hover:text-sage-green flex items-center gap-2 text-sm">
                                        <ImageIcon size={18} />
                                        <input type="file" accept="image/*" onChange={handleNewPostImageChange} className="hidden" />
                                        <span>Add Photo</span>
                                    </label>
                                    <button onClick={handlePost} disabled={!newPostText.trim()} className="px-6 py-2 bg-sage-green text-white rounded-full font-bold">Post</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-display font-bold text-forest-green flex items-center gap-2"><Activity /> Activity Feed</h3>
                                <div className="flex gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm" />
                                    </div>
                                    <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-gray-50 border-none rounded-xl text-sm px-4">
                                        <option value="ALL">All Content</option>
                                        <option value="TRIP_REPORT">Trip Reports</option>
                                        <option value="PHOTO">Photos</option>
                                        <option value="QUESTION">Questions</option>
                                    </select>
                                </div>
                            </div>

                            <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                {posts.map(post => (
                                    <div key={post.post_id} className="break-inside-avoid bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3 relative group/user">
                                                {(() => {
                                                    const simUser = getSimulatedUser(post.post_id);
                                                    // Debug log to check user data structure
                                                    if (!post.user && !(post as any).User) {
                                                        console.log("Missing user for post:", post);
                                                    }

                                                    const username = post.user?.username || (post as any).User?.username || simUser.username;
                                                    const avatar = post.user?.avatar_url || (post as any).User?.avatar_url || simUser.avatar;
                                                    return (
                                                        <>
                                                            <img src={avatar} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                                                            <div>
                                                                <p className="font-bold text-gray-800 text-sm">{username}</p>
                                                                <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                                                            </div>
                                                            <div className="absolute top-10 left-0 z-50 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all pointer-events-none group-hover/user:pointer-events-auto">
                                                                <div className="flex items-start gap-4 mb-4">
                                                                    <img src={avatar} className="w-16 h-16 rounded-2xl object-cover" alt="User" />
                                                                    <div>
                                                                        <p className="font-bold text-gray-900 text-lg">{username}</p>
                                                                        <p className="text-xs text-sage-green font-bold uppercase">{simUser.location}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-gray-600 mb-4 italic">"{simUser.bio}"</p>
                                                                <div className="grid grid-cols-3 gap-1 bg-gray-50 rounded-xl p-3 mb-4">
                                                                    <div className="text-center"><p className="font-bold">{simUser.stats.trails}</p><p className="text-[10px] uppercase">Trails</p></div>
                                                                    <div className="text-center border-x"><p className="font-bold">{simUser.stats.distance}km</p><p className="text-[10px] uppercase">Dist</p></div>
                                                                    <div className="text-center"><p className="font-bold">{simUser.stats.trips}</p><p className="text-[10px] uppercase">Trips</p></div>
                                                                </div>
                                                                <button className="w-full py-2 bg-forest-green text-white rounded-xl text-sm font-bold">Follow</button>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                        <div className="px-4 pb-4">
                                            <div className="prose prose-sm prose-sage max-w-none text-gray-600 text-sm">
                                                <ReactMarkdown>{post.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                        {post.media_urls && post.media_urls.length > 0 && <MediaGallery images={post.media_urls} />}
                                        <div className="p-4 bg-gray-50/50 flex items-center justify-between border-t border-gray-100 rounded-b-2xl">
                                            <div className="flex items-center gap-6 pt-2">
                                                <button
                                                    onClick={() => handleLike(post.post_id)}
                                                    className={`flex items-center gap-2 ${post.is_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                                                >
                                                    <Heart size={20} className={post.is_liked ? 'fill-current' : ''} />
                                                    <span className="text-sm font-medium">{post.like_count || 0}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleOpenPostDetail(post)}
                                                    className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                                                >
                                                    <MessageCircle size={20} />
                                                    <span className="text-sm font-medium">{post.comment_count || 0}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleShare(post.post_id)}
                                                    className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
                                                >
                                                    <Share2 size={20} />
                                                    <span className="text-sm font-medium">{post.share_count || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div ref={observerTarget} className="h-20" />
                        </>
                    )}

                    {view === 'MARKET' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-display font-bold text-forest-green flex items-center gap-2"><ShoppingBag /> Gear Marketplace</h3>
                                <button onClick={() => setShowSellModal(true)} className="px-4 py-2 bg-sage-green text-white rounded-xl text-sm font-bold flex items-center gap-2">+ Sell Gear</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {marketItems.filter(item => item.images && item.images.length > 0).map(item => (
                                    <div key={item.item_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
                                        <div className="relative h-48 bg-gray-100">
                                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">{item.condition.replace('_', ' ')}</div>
                                            <div className="absolute top-3 right-3 bg-forest-green text-white px-3 py-1 rounded-lg text-sm font-bold shadow-md">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.price))}</div>
                                        </div>
                                        <div className="p-5">
                                            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h4>
                                            <p className="text-[10px] text-gray-400 mb-4 font-bold uppercase">{item.category}</p>
                                            <button onClick={() => handleAddToCart(item)} className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-sage-green hover:text-white transition-all">Add to Bag</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'GROUPS' && (
                        <div>
                            <h3 className="text-2xl font-display font-bold text-forest-green mb-6 flex items-center gap-2"><Users /> Discussion Groups</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {groups.map(group => {
                                    const isJoined = joinedGroups.has(group.group_id);
                                    return (
                                        <div key={group.group_id}
                                            onClick={() => isJoined ? handleOpenChat(group) : null}
                                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-xl transition-all border-l-4 border-l-sage-green cursor-pointer">
                                            <img src={group.avatar_url} className="w-16 h-16 rounded-xl object-cover" alt={group.name} />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 mb-1 truncate">{group.name}</h4>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{group.description}</p>
                                                <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase">
                                                    <span>{group.member_count} Members</span>
                                                    {isJoined ? (
                                                        <span className="text-forest-green flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                                                            <MessageSquare size={12} /> Chat
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => handleJoinGroup(e, group)}
                                                            className="text-sage-green bg-sage-green/10 px-4 py-2 rounded-xl hover:bg-sage-green hover:text-white transition-all font-bold"
                                                        >
                                                            Join Now →
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {view === 'CHALLENGES' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-display font-bold text-forest-green flex items-center gap-2"><Trophy /> Active Challenges</h3>
                                <button onClick={() => setShowChallengesModal(true)} className="text-sm font-bold text-sage-green bg-sage-green/5 py-2 px-4 rounded-xl">View All</button>
                            </div>
                            <div className="space-y-4">
                                {challenges.filter(c => c.is_joined).length > 0 ? (
                                    challenges.filter(c => c.is_joined).map(challenge => (
                                        <div key={challenge.challenge_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all group relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-900 mb-1">{challenge.name}</h4>
                                                    <p className="text-sm text-gray-500 max-w-lg">{challenge.description}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-xs font-bold ring-1 ring-orange-100">
                                                        {challenge.target_value} {challenge.unit}
                                                    </div>
                                                    <span className="text-xs font-black text-forest-green bg-green-50 px-2 py-1 rounded">JOINED</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 relative z-10 min-h-[1.5rem]">
                                                <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden border">
                                                    <div className="h-full bg-gradient-to-r from-sage-green to-forest-green rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, ((Number(challenge.progress || 0) / Number(challenge.target_value)) * 100))}%` }}></div>
                                                </div>
                                                <span className="text-sm font-black text-forest-green">{Math.round((Number(challenge.progress || 0) / Number(challenge.target_value)) * 100)}%</span>
                                            </div>
                                            <Trophy className="absolute -right-6 -bottom-6 w-32 h-32 text-gray-50/30 group-hover:rotate-12 transition-transform" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <Trophy className="w-12 h-12 text-gray-300 mb-2" />
                                        <p className="text-gray-500 font-bold">No active challenges</p>
                                        <button onClick={() => setShowChallengesModal(true)} className="mt-4 text-sage-green font-bold text-sm hover:underline">Browse Challenges</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {view === 'GUIDEBOOK' && (
                        <div className="animate-fade-in">
                            <h3 className="text-2xl font-display font-bold text-forest-green mb-6 flex items-center gap-2"><BookOpen /> Hiking Guidebook</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {MOCK_GUIDEBOOK_ARTICLES.map(article => (
                                    <div key={article.id} onClick={() => setSelectedArticle(article)} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col overflow-hidden h-full">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={article.imageUrl || `https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-forest-green shadow-sm">
                                                {article.category || 'Guide'}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <h4 className="font-bold text-xl text-gray-900 mb-2 leading-tight group-hover:text-forest-green transition-colors">{article.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-medium">
                                                <span>{article.author}</span>
                                                <span>•</span>
                                                <span>{article.date}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">{article.content.replace(/#/g, '').substring(0, 150)}...</p>
                                            <div className="flex items-center gap-2 text-sage-green text-sm font-bold mt-auto">
                                                Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'LEADERBOARD' && (
                        <div>
                            <h3 className="text-2xl font-display font-bold text-forest-green flex items-center gap-2 mb-6"><Trophy /> Leaderboard</h3>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Mock Leaderboard */}
                                <div className="p-4 border-b bg-gray-50 flex font-bold text-gray-500 text-sm uppercase">
                                    <div className="w-12 text-center">Rank</div>
                                    <div className="flex-1">User</div>
                                    <div className="w-24 text-center">Score</div>
                                </div>
                                {[1, 2, 3, 4, 5].map((rank) => (
                                    <div key={rank} className="p-4 border-b flex items-center hover:bg-gray-50">
                                        <div className="w-12 text-center font-black text-xl text-sage-green">#{rank}</div>
                                        <div className="flex-1 flex items-center gap-3">
                                            <img src={`https://i.pravatar.cc/150?u=${rank}`} className="w-10 h-10 rounded-full" />
                                            <span className="font-bold text-gray-900">User {rank}</span>
                                        </div>
                                        <div className="w-24 text-center font-bold text-gray-600">{1000 - rank * 50} pts</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6 xl:sticky xl:top-24 h-fit">
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-forest-green/5 border border-gray-100/50 overflow-hidden">
                        <div className="p-8 border-b border-gray-50/50 relative overflow-hidden group/header">
                            <h3 className="text-[11px] font-black text-forest-green/40 uppercase tracking-[0.25em] mb-1">Explorer Central</h3>
                            <p className="text-lg font-display font-bold text-forest-green">Community Hub</p>
                            <div className="h-1 w-8 bg-sage-green mt-3 rounded-full group-hover:w-16 transition-all"></div>
                        </div>
                        <div className="p-4 space-y-2">
                            {[
                                { id: 'FEED', label: 'Activity Feed', icon: Activity, color: 'text-sage-green', bg: 'bg-sage-green/10', count: 'New' },
                                { id: 'MARKET', label: 'Gear Market', icon: ShoppingBag, color: 'text-earth-brown', bg: 'bg-earth-brown/10', count: 'Hot' },
                                { id: 'GROUPS', label: 'Groups', icon: Users, color: 'text-forest-green', bg: 'bg-forest-green/10', count: groups.length },
                                { id: 'CHALLENGES', label: '2026 Quests', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-50', count: 'Active' },
                                { id: 'GUIDEBOOK', label: 'Guidebook', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50', count: 'New' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setView(tab.id as any); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all w-full ${view === tab.id ? 'bg-forest-green text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-forest-green'}`}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`p-2.5 rounded-xl transition-all ${view === tab.id ? 'bg-white/20' : tab.bg}`}>
                                            <tab.icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="tracking-tight">{tab.label}</span>
                                            {view !== tab.id && <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{tab.id === 'CHALLENGES' ? 'Join Quest' : 'Explore'}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 relative z-10">
                                        {tab.count && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${view === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                {tab.count}
                                            </span>
                                        )}
                                        {view === tab.id ? <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div> : <ChevronRight className="opacity-0 group-hover:opacity-100 transition-all w-4 h-4" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showSellModal && (
                <Modal onClose={() => setShowSellModal(false)}>
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-forest-green">List Item for Sale</h3>
                        <form onSubmit={handleSellSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Item Title</label>
                                <input value={sellForm.name} onChange={e => setSellForm(s => ({ ...s, name: e.target.value }))} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold text-gray-700 mb-1">Price (VND)</label><input value={sellForm.price} type="number" onChange={e => setSellForm(s => ({ ...s, price: e.target.value }))} className="w-full p-3 bg-gray-50 border rounded-xl" required /></div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Condition</label>
                                    <select value={sellForm.condition} onChange={e => setSellForm(s => ({ ...s, condition: e.target.value }))} className="w-full p-3 bg-gray-50 border rounded-xl">
                                        <option value="NEW">New</option><option value="LIKE_NEW">Like New</option><option value="GOOD">Good</option><option value="FAIR">Fair</option><option value="POOR">Poor</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Photo</label>
                                <div className="border-2 border-dashed rounded-xl p-4 text-center hover:border-sage-green transition-colors cursor-pointer relative bg-gray-50">
                                    <input type="file" accept="image/*" onChange={handleSellImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {sellForm.imagePreview ? <img src={sellForm.imagePreview} className="mx-auto h-32 object-contain rounded" /> : <div className="text-gray-400"><ImageIcon className="mx-auto mb-2" /><span className="text-sm">Upload Photo</span></div>}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowSellModal(false)} className="px-5 py-2.5 text-gray-600">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 bg-sage-green text-white font-bold rounded-xl shadow-lg">List Item</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}

            {showChallengesModal && (
                <Modal onClose={() => setShowChallengesModal(false)}>
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="p-8 border-b"><h3 className="text-3xl font-bold text-forest-green flex items-center gap-3"><Trophy className="text-yellow-500" /> All Challenges</h3></div>
                        <div className="p-8 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 gap-4">
                                {challenges.map(challenge => (
                                    <div key={challenge.challenge_id} className="border rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group bg-gray-50/50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div><h4 className="font-bold text-lg group-hover:text-forest-green">{challenge.name}</h4><p className="text-sm text-gray-500 line-clamp-1">{challenge.description}</p></div>
                                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{challenge.challenge_type}</div>
                                        </div>
                                        <div className="mb-2">
                                            {challenge.is_joined ? (
                                                <>
                                                    <div className="flex justify-between text-sm font-medium text-gray-600 mb-1"><span>Progress</span><span>{Number(challenge.progress || 0)} / {challenge.target_value} {challenge.unit}</span></div>
                                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-forest-green rounded-full" style={{ width: `${Math.min(100, ((Number(challenge.progress || 0) / Number(challenge.target_value)) * 100))}%` }}></div></div>
                                                </>
                                            ) : (
                                                <div className="py-2 text-sm text-gray-400 italic bg-gray-50 rounded-lg text-center border border-dashed">Join this challenge to track your progress</div>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-gray-400 mt-3 pt-3 border-t">
                                            <div className="flex gap-4 font-bold uppercase"><span>Start: {formatDate(challenge.start_date)}</span><span>End: {formatDate(challenge.end_date)}</span></div>
                                            {challenge.is_joined ? (
                                                <button className="text-gray-400 font-bold cursor-default flex items-center gap-1"><Check className="w-4 h-4" /> Joined</button>
                                            ) : (
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        try {
                                                            await joinChallenge(challenge.challenge_id);
                                                            // Refresh challenges
                                                            const res = await getChallenges();
                                                            setChallenges(Array.isArray(res) ? res : res.data || []);
                                                        } catch (err: any) {
                                                            alert("Failed to join: " + (err.response?.data?.message || err.message));
                                                        }
                                                    }}
                                                    className="text-forest-green font-black hover:underline"
                                                >
                                                    Join now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t flex justify-end"><button onClick={() => setShowChallengesModal(false)} className="px-8 py-3 bg-white border font-bold rounded-2xl hover:bg-gray-100 transition-all">Close</button></div>
                    </div>
                </Modal >
            )}

            {/* Guidebook Modal */}
            {
                selectedArticle && (
                    <Modal onClose={() => setSelectedArticle(null)}>
                        <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="relative h-64 shrink-0">
                                <img src={selectedArticle.imageUrl || `https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80`} className="w-full h-full object-cover" />
                                <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur hover:bg-black/40 rounded-full text-white transition-colors"><X size={24} /></button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                                    <div className="flex items-center gap-2 text-white/80 text-sm font-bold mb-2">
                                        <span className="bg-sage-green px-2 py-0.5 rounded text-white">{selectedArticle.category || 'Guide'}</span>
                                        <span>•</span>
                                        <span>{selectedArticle.date}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white leading-tight">{selectedArticle.title}</h3>
                                    <p className="text-white/80 mt-1 font-medium">By {selectedArticle.author}</p>
                                </div>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                <div className="prose prose-lg prose-sage max-w-none text-gray-600">
                                    <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                                </div>
                                <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h5 className="font-bold text-gray-900 mb-1">Was this guide helpful?</h5>
                                        <p className="text-sm text-gray-500">Your feedback helps us improve.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => alert("Thanks for your feedback!")} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-forest-green hover:text-white hover:border-forest-green transition-colors flex items-center gap-2">
                                            <CheckCircle size={16} /> Yes, thanks!
                                        </button>
                                        <button onClick={() => alert("Thanks, we'll try to improve.")} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">Not really</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )
            }

            {
                showChatModal && currentChatGroup && (
                    <Modal onClose={() => setShowChatModal(false)}>
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[600px]">
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <img src={currentChatGroup.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{currentChatGroup.name}</h3>
                                        <p className="text-xs text-green-600 font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowChatModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                                {chatMessages.map((msg, idx) => (
                                    <div key={msg.id || idx} className={`flex gap-3 ${msg.sender === (user?.name || 'You') ? 'flex-row-reverse' : ''}`}>
                                        <img src={msg.sender_avatar || `https://ui-avatars.com/api/?name=${msg.sender}`} className="w-8 h-8 rounded-full self-end" />
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === (user?.name || 'You') ? 'bg-forest-green text-white rounded-br-none' : 'bg-white border border-gray-100 rounded-bl-none'}`}>
                                            <p className="font-bold text-[10px] mb-1 opacity-70">{msg.sender}</p>
                                            <p>{msg.content}</p>
                                            <p className="text-[10px] mt-1 opacity-50 text-right">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
                                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sage-green" />
                                <button type="submit" disabled={!chatInput.trim()} className="p-3 bg-forest-green text-white rounded-xl hover:bg-green-800 disabled:opacity-50"><Send size={20} /></button>
                            </form>
                        </div>
                    </Modal>
                )
            }

            {/* Post Detail Modal */}
            {selectedPost && (
                <Modal onClose={() => setSelectedPost(null)}>
                    <div className="bg-white rounded-2xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]">
                        {/* Left: Image/Content */}
                        <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative">
                            {selectedPost.media_urls && selectedPost.media_urls.length > 0 ? (
                                <img src={selectedPost.media_urls[0]} className="max-w-full max-h-full object-contain" />
                            ) : (
                                <div className="p-8 text-white text-center">
                                    <p className="text-lg font-medium">{selectedPost.content || "No content"}</p>
                                </div>
                            )}
                            <button onClick={() => setSelectedPost(null)} className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white md:hidden"><X /></button>
                        </div>

                        {/* Right: Comments */}
                        <div className="w-full md:w-1/3 flex flex-col bg-white border-l h-full">
                            {/* Header */}
                            <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const simUser = getSimulatedUser(selectedPost.post_id);
                                        const username = selectedPost.user?.username || (selectedPost as any).User?.username || simUser.username;
                                        const avatar = selectedPost.user?.avatar_url || (selectedPost as any).User?.avatar_url || simUser.avatar;
                                        return (
                                            <>
                                                <img src={avatar} className="w-10 h-10 rounded-full" alt={username} />
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{username}</h3>
                                                    <p className="text-xs text-gray-500">{formatDate(selectedPost.created_at)}</p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Post Content (if text only or caption) */}
                            <div className="p-4 border-b overflow-y-auto max-h-32 flex-shrink-0">
                                <div className="prose prose-sm"><ReactMarkdown>{selectedPost.content}</ReactMarkdown></div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Comments List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <h4 className="font-bold text-gray-900 mb-2">Comments ({isLoadingComments ? (selectedPost.comment_count || 0) : comments.length})</h4>
                                {isLoadingComments ? (
                                    <div className="flex justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-green"></div></div>
                                ) : !Array.isArray(comments) || comments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first!</p>
                                ) : (
                                    comments.map((comment: any, idx: number) => (
                                        <div key={comment.comment_id || idx} className="flex gap-3">
                                            <img src={comment.User?.avatar_url || "https://ui-avatars.com/api/?name=User"} className="w-8 h-8 rounded-full flex-shrink-0" alt="Avatar" />
                                            <div className="bg-gray-50 p-3 rounded-lg flex-1">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-semibold text-sm">{comment.User?.username}</span>
                                                    <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer: Actions & Input */}
                            <div className="p-4 border-t bg-white flex-shrink-0">
                                <div className="flex items-center gap-6 mb-4">
                                    <button
                                        onClick={() => {
                                            handleLike(selectedPost.post_id);
                                            // Optimistic update for modal
                                            setSelectedPost(prev => prev ? { ...prev, is_liked: !prev.is_liked, like_count: (prev.like_count || 0) + (prev.is_liked ? -1 : 1) } : null);
                                        }}
                                        className={`flex items-center gap-2 ${selectedPost.is_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                                    >
                                        <Heart size={24} className={selectedPost.is_liked ? 'fill-current' : ''} />
                                        <span className="font-bold">{selectedPost.like_count} likes</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-500">
                                        <MessageCircle size={24} />
                                        <span>Reply</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-500 hover:text-green-500">
                                        <Share2 size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-forest-green/20"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="p-3 bg-forest-green text-white rounded-full hover:bg-forest-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 flex items-center justify-center"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}      </div >
    );
};



export default Community;
