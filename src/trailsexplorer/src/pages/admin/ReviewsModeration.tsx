import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, EyeOff, Trash2, Eye, Star, AlertCircle, Clock, X as XIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Mock Data for Reviews
const MOCK_REVIEWS: Review[] = [
    {
        review_id: 1,
        content: 'Amazing trail! The views from the summit were breathtaking. Well-marked paths and moderate difficulty. Highly recommend for experienced hikers.',
        overall_rating: 5,
        created_at: '2024-01-15T08:30:00Z',
        is_approved: true,
        is_published: true,
        User: {
            user_id: 1,
            username: 'sarah_chen',
            full_name: 'Sarah Chen',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            email: 'sarah.chen@example.com'
        },
        Trail: {
            trail_id: 1,
            name: 'Mount Fansipan Summit',
            location_province: 'Lào Cai'
        }
    },
    {
        review_id: 2,
        content: 'Great trail for beginners. Nice scenery but can get crowded on weekends.',
        overall_rating: 4,
        created_at: '2024-01-14T14:20:00Z',
        is_approved: false,
        is_published: true,
        User: {
            user_id: 2,
            username: 'mike_nguyen',
            full_name: 'Mike Nguyen',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            email: 'mike.nguyen@example.com'
        },
        Trail: {
            trail_id: 2,
            name: 'Ba Vi National Park Loop',
            location_province: 'Hanoi'
        }
    },
    {
        review_id: 3,
        content: 'This is spam content that should be moderated. Buy cheap products online!',
        overall_rating: 1,
        created_at: '2024-01-13T10:15:00Z',
        is_approved: false,
        is_published: false,
        User: {
            user_id: 3,
            username: 'spammer123',
            full_name: 'Spam User',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spam',
            email: 'spam@example.com'
        },
        Trail: {
            trail_id: 3,
            name: 'Tam Dao Loop',
            location_province: 'Vĩnh Phúc'
        }
    },
    {
        review_id: 4,
        content: 'Beautiful scenery, challenging terrain. The sunrise view was worth the early start. Would definitely do it again!',
        overall_rating: 5,
        created_at: '2024-01-12T16:45:00Z',
        is_approved: true,
        is_published: true,
        User: {
            user_id: 4,
            username: 'emma_tran',
            full_name: 'Emma Tran',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            email: 'emma.tran@example.com'
        },
        Trail: {
            trail_id: 4,
            name: 'Cat Ba Peak',
            location_province: 'Hải Phòng'
        }
    },
    {
        review_id: 5,
        content: 'Trail conditions were poor. Needs better maintenance and clearer signage.',
        overall_rating: 2,
        created_at: '2024-01-11T09:00:00Z',
        is_approved: false,
        is_published: true,
        User: {
            user_id: 5,
            username: 'david_le',
            full_name: 'David Le',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
            email: 'david.le@example.com'
        },
        Trail: {
            trail_id: 5,
            name: 'Sapa Rice Terraces',
            location_province: 'Lào Cai'
        }
    }
];

interface Review {
    review_id: number;
    content: string;
    overall_rating: number;
    created_at: string;
    is_approved: boolean;
    is_published: boolean;
    User: {
        user_id: number;
        username: string;
        full_name: string;
        avatar_url: string;
        email: string;
    };
    Trail: {
        trail_id: number;
        name: string;
        location_province: string;
    };
}

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ViewTrailModalProps {
    isOpen: boolean;
    trail: {
        trail_id: number;
        name: string;
        location_province: string;
    } | null;
    onClose: () => void;
}

const ViewTrailModal: React.FC<ViewTrailModalProps> = ({ isOpen, trail, onClose }) => {
    if (!isOpen || !trail) return null;

    // Mock additional trail details
    const trailDetails = {
        difficulty: trail.trail_id === 1 ? 'Hard' : trail.trail_id === 2 ? 'Moderate' : 'Easy',
        length_km: trail.trail_id === 1 ? 12.5 : trail.trail_id === 2 ? 8.3 : 5.2,
        duration_hr: trail.trail_id === 1 ? 6 : trail.trail_id === 2 ? 4 : 2,
        elevation_gain: trail.trail_id === 1 ? 1400 : trail.trail_id === 2 ? 800 : 350,
        rating: trail.trail_id === 1 ? 4.8 : trail.trail_id === 2 ? 4.6 : 4.5,
        total_reviews: trail.trail_id === 1 ? 234 : trail.trail_id === 2 ? 156 : 89,
        description: trail.trail_id === 1
            ? 'The highest peak in Indochina, offering spectacular views and challenging terrain.'
            : trail.trail_id === 2
                ? 'Beautiful loop through Ba Vi National Park with diverse flora and fauna.'
                : 'Scenic trail through rice terraces with moderate difficulty.'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{trail.name}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-semibold text-gray-900">{trail.location_province}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Difficulty</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${trailDetails.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                trailDetails.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                {trailDetails.difficulty}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Length</p>
                            <p className="font-semibold text-gray-900">{trailDetails.length_km} km</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold text-gray-900">{trailDetails.duration_hr} hours</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Elevation Gain</p>
                            <p className="font-semibold text-gray-900">{trailDetails.elevation_gain}m</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Rating</p>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-gray-900">{trailDetails.rating}/5</span>
                                <span className="text-sm text-gray-500">({trailDetails.total_reviews} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Description</p>
                        <p className="text-gray-700">{trailDetails.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReviewsModeration: React.FC = () => {
    const [allReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'hidden'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [viewTrailModal, setViewTrailModal] = useState<{ isOpen: boolean; trail: any | null }>({
        isOpen: false,
        trail: null
    });
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        reviewId: number | null;
        title: string;
        message: string;
    }>({
        isOpen: false,
        reviewId: null,
        title: '',
        message: ''
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadReviews = () => {
        setLoading(true);

        // Filter reviews based on filter and search
        let filtered = [...allReviews];

        // Apply status filter
        if (filter === 'pending') {
            filtered = filtered.filter(r => !r.is_approved);
        } else if (filter === 'approved') {
            filtered = filtered.filter(r => r.is_approved && r.is_published);
        } else if (filter === 'hidden') {
            filtered = filtered.filter(r => !r.is_published);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.User?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.Trail?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setReviews(filtered);
        setTotalPages(1); // Single page for mock data
        setLoading(false);
    };

    useEffect(() => {
        loadReviews();
    }, [filter, currentPage]);

    const handleApprove = (reviewId: number) => {
        const updatedReviews = allReviews.map(r =>
            r.review_id === reviewId ? { ...r, is_approved: true, is_published: true } : r
        );
        showToast('Review approved successfully', 'success');
        loadReviews();
    };

    const handleHide = (reviewId: number) => {
        const updatedReviews = allReviews.map(r =>
            r.review_id === reviewId ? { ...r, is_published: false } : r
        );
        showToast('Review hidden successfully', 'success');
        loadReviews();
    };

    const handleUnhide = (reviewId: number) => {
        const updatedReviews = allReviews.map(r =>
            r.review_id === reviewId ? { ...r, is_published: true } : r
        );
        showToast('Review unhidden successfully', 'success');
        loadReviews();
    };

    const handleDeleteClick = (reviewId: number) => {
        setConfirmDialog({
            isOpen: true,
            reviewId,
            title: 'Delete Review',
            message: 'Are you sure you want to permanently delete this review? This action cannot be undone.'
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.reviewId) {
            const index = allReviews.findIndex(r => r.review_id === confirmDialog.reviewId);
            if (index !== -1) {
                allReviews.splice(index, 1);
            }
            showToast('Review deleted successfully', 'success');
            setConfirmDialog({ isOpen: false, reviewId: null, title: '', message: '' });
            loadReviews();
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadReviews();
    };

    const getStatusBadge = (review: Review) => {
        if (!review.is_published) {
            return <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">Hidden</span>;
        }
        if (review.is_approved) {
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Approved</span>;
        }
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-cream to-green-50/30 min-h-screen">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    } text-white`}>
                    {toast.message}
                </div>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmDialog({ isOpen: false, reviewId: null, title: '', message: '' })}
            />

            {/* View Trail Modal */}
            <ViewTrailModal
                isOpen={viewTrailModal.isOpen}
                trail={viewTrailModal.trail}
                onClose={() => setViewTrailModal({ isOpen: false, trail: null })}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-forest-green">Reviews Moderation</h2>
                    <p className="text-gray-600 mt-1">Manage and moderate trail reviews</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'approved', 'hidden'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => {
                            setFilter(status);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === status
                            ? 'bg-forest-green text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {/* Search */}
            <Card className="border-none shadow-lg">
                <CardContent className="p-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search reviews by content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-forest-green text-white rounded-lg hover:bg-opacity-90 transition-all shadow-md"
                        >
                            Search
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Reviews Table */}
            <Card className="border-none shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                    <CardTitle className="text-forest-green">
                        Reviews ({reviews.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">No reviews found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Reviewer</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Trail</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Rating</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Comment</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reviews.map((review) => (
                                        <tr key={review.review_id} className="hover:bg-green-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={review.User?.avatar_url || 'https://i.pravatar.cc/150'}
                                                        alt={review.User?.username}
                                                        className="w-10 h-10 rounded-full bg-gray-200"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{review.User?.full_name || review.User?.username}</p>
                                                        <p className="text-sm text-gray-500">{review.User?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setViewTrailModal({ isOpen: true, trail: review.Trail })}
                                                    className="text-left hover:underline"
                                                >
                                                    <p className="font-medium text-forest-green hover:text-sage-green">{review.Trail?.name}</p>
                                                    <p className="text-sm text-gray-500">{review.Trail?.location_province}</p>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderStars(review.overall_rating)}
                                            </td>
                                            <td className="px-6 py-4 max-w-md">
                                                <p className="text-gray-700 line-clamp-2">{review.content}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(review)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {!review.is_approved && (
                                                        <button
                                                            onClick={() => handleApprove(review.review_id)}
                                                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {review.is_published ? (
                                                        <button
                                                            onClick={() => handleHide(review.review_id)}
                                                            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all"
                                                            title="Hide"
                                                        >
                                                            <EyeOff className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnhide(review.review_id)}
                                                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                                                            title="Unhide"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteClick(review.review_id)}
                                                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 p-4 border-t">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ReviewsModeration;
