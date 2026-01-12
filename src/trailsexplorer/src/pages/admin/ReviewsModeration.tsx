import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, EyeOff, Trash2, Eye, Star, AlertCircle, Clock, X as XIcon, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Types
interface User {
    user_id: number;
    username: string;
    full_name: string;
    avatar_url: string;
    email: string;
}

interface Trail {
    trail_id: number;
    name: string;
    location_province: string;
}

interface Review {
    review_id: number;
    content: string;
    overall_rating: number;
    created_at: string;
    is_approved: boolean;
    is_published: boolean;
    User: User;
    Trail: Trail;
}

// --- Modals ---

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

interface ViewReviewModalProps {
    isOpen: boolean;
    review: Review | null;
    onClose: () => void;
}

const ViewReviewModal: React.FC<ViewReviewModalProps> = ({ isOpen, review, onClose }) => {
    if (!isOpen || !review) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Review Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* User & Trail Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                            src={review.User?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.User?.username}`}
                            alt={review.User?.username}
                            className="w-16 h-16 rounded-full"
                        />
                        <div>
                            <p className="font-bold text-lg flex items-center gap-2">
                                {review.User?.full_name}
                                <span className="text-gray-500 font-normal text-base">(@{review.User?.username})</span>
                            </p>
                            <p className="text-gray-600">{review.User?.email}</p>
                            <div className="mt-2 text-sm text-gray-500">
                                Reviewed <span className="font-semibold text-forest-green">{review.Trail?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rating & Date */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">Rating:</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${star <= review.overall_rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-5 h-5" />
                            <span>{new Date(review.created_at).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <h4 className="font-semibold mb-2">Content</h4>
                        <div className="p-4 border rounded-lg bg-white text-gray-800 min-h-[100px]">
                            {review.content}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <h4 className="font-semibold mb-2">Status</h4>
                        <div className="flex gap-2">
                            {!review.is_published ? (
                                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">Hidden</span>
                            ) : review.is_approved ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Approved</span>
                            ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Pending Review</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ReviewsModeration: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'hidden'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Modals
    const [viewReviewModal, setViewReviewModal] = useState<{ isOpen: boolean; review: Review | null }>({
        isOpen: false,
        review: null
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

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const loadReviews = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                status: filter,
                search: searchTerm
            });

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/reviews?${queryParams}`, {
                headers: getAuthHeader()
            });

            if (!res.ok) throw new Error('Failed to fetch reviews');

            const data = await res.json();
            setReviews(data.data);
            setTotalPages(data.pages);
        } catch (error) {
            console.error(error);
            showToast('Failed to load reviews', 'error');
            // Fallback empty
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [filter, currentPage]); // Remove searchTerm from dep array to search only on enter/click

    const handleApprove = async (reviewId: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/reviews/${reviewId}/approve`, {
                method: 'PUT',
                headers: getAuthHeader()
            });
            if (!res.ok) throw new Error('Failed to approve');
            showToast('Review approved successfully', 'success');
            loadReviews();
        } catch (error) {
            showToast('Error approving review', 'error');
        }
    };

    const handleHide = async (reviewId: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/reviews/${reviewId}/hide`, {
                method: 'PUT',
                headers: getAuthHeader()
            });
            if (!res.ok) throw new Error('Failed to hide');
            showToast('Review hidden successfully', 'success');
            loadReviews();
        } catch (error) {
            showToast('Error hiding review', 'error');
        }
    };

    const handleUnhide = async (reviewId: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/reviews/${reviewId}/unhide`, {
                method: 'PUT',
                headers: getAuthHeader()
            });
            if (!res.ok) throw new Error('Failed to unhide');
            showToast('Review unhidden successfully', 'success');
            loadReviews();
        } catch (error) {
            showToast('Error unhiding review', 'error');
        }
    };

    const handleDeleteClick = (reviewId: number) => {
        setConfirmDialog({
            isOpen: true,
            reviewId,
            title: 'Delete Review',
            message: 'Are you sure you want to permanently delete this review? This action cannot be undone.'
        });
    };

    const handleDeleteConfirm = async () => {
        if (confirmDialog.reviewId) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/reviews/${confirmDialog.reviewId}`, {
                    method: 'DELETE',
                    headers: getAuthHeader()
                });
                if (!res.ok) throw new Error('Failed to delete');
                showToast('Review deleted successfully', 'success');
                loadReviews();
            } catch (error) {
                showToast('Error deleting review', 'error');
            } finally {
                setConfirmDialog({ isOpen: false, reviewId: null, title: '', message: '' });
            }
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

            {/* View Review Modal */}
            <ViewReviewModal
                isOpen={viewReviewModal.isOpen}
                review={viewReviewModal.review}
                onClose={() => setViewReviewModal({ isOpen: false, review: null })}
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
                        Reviews
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
                            <p className="text-gray-500">No reviews found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-[25%]">Reviewer</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-[20%]">Trail</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-[15%]">Review Preview</th>
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
                                                        src={review.User?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.User?.username}`}
                                                        alt={review.User?.username}
                                                        className="w-10 h-10 rounded-full bg-gray-200"
                                                    />
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {review.User?.full_name}
                                                        </div>
                                                        <p className="text-sm text-gray-500">{review.User?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{review.Trail?.name}</p>
                                                <p className="text-sm text-gray-500">{review.Trail?.location_province}</p>
                                            </td>
                                            <td className="px-6 py-4">
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
                                                    <button
                                                        onClick={() => setViewReviewModal({ isOpen: true, review })}
                                                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
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
