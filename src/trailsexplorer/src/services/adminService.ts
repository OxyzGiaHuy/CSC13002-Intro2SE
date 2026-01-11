const API_URL = '/api';

/**
 * Admin service layer for moderation operations
 * All functions require admin authentication
 */

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// ==================== REVIEWS MODERATION ====================

export const fetchReviews = async (filters: {
    status?: 'all' | 'pending' | 'approved' | 'hidden';
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);

        const response = await fetch(`${API_URL}/admin/reviews?${params}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error fetching reviews: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('fetchReviews error:', error);
        throw error;
    }
};

export const approveReview = async (reviewId: number) => {
    try {
        const response = await fetch(`${API_URL}/admin/reviews/${reviewId}/approve`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error approving review: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('approveReview error:', error);
        throw error;
    }
};

export const hideReview = async (reviewId: number) => {
    try {
        const response = await fetch(`${API_URL}/admin/reviews/${reviewId}/hide`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error hiding review: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('hideReview error:', error);
        throw error;
    }
};

export const unhideReview = async (reviewId: number) => {
    try {
        const response = await fetch(`${API_URL}/admin/reviews/${reviewId}/unhide`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error unhiding review: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('unhideReview error:', error);
        throw error;
    }
};

export const deleteReview = async (reviewId: number) => {
    try {
        const response = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error deleting review: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('deleteReview error:', error);
        throw error;
    }
};

// ==================== POSTS MODERATION ====================

export const fetchPosts = async (filters: {
    status?: 'all' | 'pending' | 'approved' | 'reported';
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);

        const response = await fetch(`${API_URL}/admin/posts?${params}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error fetching posts: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('fetchPosts error:', error);
        throw error;
    }
};

export const approvePost = async (postId: number) => {
    try {
        const response = await fetch(`${API_URL}/admin/posts/${postId}/approve`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error approving post: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('approvePost error:', error);
        throw error;
    }
};

export const unapprovePost = async (postId: number) => {
    try {
        const response = await fetch(`${API_URL}/admin/posts/${postId}/unapprove`, {
            method: 'PUT',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error unapproving post: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('unapprovePost error:', error);
        throw error;
    }
};

export const deletePost = async (postId: number) => {
    try {
        const response = await fetch(`${API_URL}/admin/posts/${postId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error deleting post: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('deletePost error:', error);
        throw error;
    }
};

// ==================== STATISTICS ====================

export const fetchAdminStats = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error fetching admin stats: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('fetchAdminStats error:', error);
        throw error;
    }
};
