import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Trash2, Eye, AlertTriangle, Clock, MessageSquare, X as XIcon } from 'lucide-react';
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
}

interface Post {
    post_id: number;
    title: string;
    content: string;
    content_type: string;
    created_at: string;
    is_approved: boolean;
    is_published: boolean;
    report_count: number;
    like_count: number;
    comment_count: number; // Added
    share_count: number;   // Added
    User: User;
    Trail?: Trail;
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

interface ViewPostModalProps {
    isOpen: boolean;
    post: Post | null;
    onClose: () => void;
}

const ViewPostModal: React.FC<ViewPostModalProps> = ({ isOpen, post, onClose }) => {
    if (!isOpen || !post) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{post.title || 'Untitled Post'}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b">
                        <img
                            src={post.User?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.User?.username}`}
                            alt={post.User?.username}
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">
                                {post.User?.full_name} <span className="text-gray-500 font-normal">(@{post.User?.username})</span>
                            </p>
                            <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                        </div>
                    </div>

                    <div>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                            {post.content_type}
                        </span>
                        {post.Trail && (
                            <p className="text-sm text-gray-600 mb-2">Related to: <span className="font-medium">{post.Trail.name}</span></p>
                        )}
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    </div>

                    <div className="flex gap-6 pt-4 border-t text-sm text-gray-600">
                        <span>{post.like_count} likes</span>
                        <span>{post.comment_count} comments</span>
                        <span>{post.share_count} shares</span>
                        <span className={post.report_count > 0 ? 'text-red-600 font-medium' : ''}>
                            {post.report_count} reports
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PostsModeration: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'reported'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Modals
    const [viewModal, setViewModal] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null
    });

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        postId: number | null;
        title: string;
        message: string;
    }>({
        isOpen: false,
        postId: null,
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

    const loadPosts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                status: filter,
                search: searchTerm
            });

            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/posts?${queryParams}`, {
                headers: getAuthHeader()
            });

            if (!res.ok) throw new Error('Failed to fetch posts');

            const data = await res.json();
            setPosts(data.data);
            setTotalPages(data.pages);
        } catch (error) {
            console.error(error);
            showToast('Failed to load posts', 'error');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, [filter, currentPage]);

    const handleApprove = async (postId: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/posts/${postId}/approve`, {
                method: 'PUT',
                headers: getAuthHeader()
            });
            if (!res.ok) throw new Error('Failed to approve');
            showToast('Post approved successfully', 'success');
            loadPosts();
        } catch (error) {
            showToast('Error approving post', 'error');
        }
    };

    const handleUnapprove = async (postId: number) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/posts/${postId}/unapprove`, {
                method: 'PUT',
                headers: getAuthHeader()
            });
            if (!res.ok) throw new Error('Failed to unapprove');
            showToast('Post unapproved successfully', 'success');
            loadPosts();
        } catch (error) {
            showToast('Error unapproving post', 'error');
        }
    };

    const handleDeleteClick = (postId: number) => {
        setConfirmDialog({
            isOpen: true,
            postId,
            title: 'Delete Post',
            message: 'Are you sure you want to permanently delete this post? This action cannot be undone.'
        });
    };

    const handleDeleteConfirm = async () => {
        if (confirmDialog.postId) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/posts/${confirmDialog.postId}`, {
                    method: 'DELETE',
                    headers: getAuthHeader()
                });
                if (!res.ok) throw new Error('Failed to delete');
                showToast('Post deleted successfully', 'success');
                loadPosts();
            } catch (error) {
                showToast('Error deleting post', 'error');
            } finally {
                setConfirmDialog({ isOpen: false, postId: null, title: '', message: '' });
            }
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadPosts();
    };

    const handleViewPost = (post: Post) => {
        setViewModal({ isOpen: true, post });
    };

    const getStatusBadge = (post: Post) => {
        if (!post.is_published) {
            return <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">Unpublished</span>;
        }
        if (post.is_approved) {
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Approved</span>;
        }
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
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
                onCancel={() => setConfirmDialog({ isOpen: false, postId: null, title: '', message: '' })}
            />

            {/* View Post Modal */}
            <ViewPostModal
                isOpen={viewModal.isOpen}
                post={viewModal.post}
                onClose={() => setViewModal({ isOpen: false, post: null })}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-forest-green">Community Hub Moderation</h2>
                    <p className="text-gray-600 mt-1">Manage and moderate community posts</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'approved', 'reported'] as const).map((status) => (
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
                                placeholder="Search posts by title or content..."
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

            {/* Posts Table */}
            <Card className="border-none shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-white to-green-50/30">
                    <CardTitle className="text-forest-green">
                        Posts
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading posts...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">No posts found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-[25%]">Author</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-[20%]">Title</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700 w-[15%]">Post Preview</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {posts.map((post) => (
                                        <tr key={post.post_id} className="hover:bg-green-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={post.User?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.User?.username}`}
                                                        alt={post.User?.username}
                                                        className="w-10 h-10 rounded-full bg-gray-200"
                                                    />
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {post.User?.full_name}
                                                        </div>
                                                        <p className="text-sm text-gray-500">{post.User?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{post.title || 'Untitled'}</p>
                                                <p className="text-sm text-gray-500">{post.content_type}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-700 line-clamp-2">{post.content}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(post)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewPost(post)}
                                                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {post.is_approved ? (
                                                        <button
                                                            onClick={() => handleUnapprove(post.post_id)}
                                                            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all"
                                                            title="Unapprove"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApprove(post.post_id)}
                                                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteClick(post.post_id)}
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

export default PostsModeration;
