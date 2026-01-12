/**
 * Admin Service - Fetch data for admin dashboard
 * Retrieves statistics and real data from the backend
 */

const API_URL = '/api';

export interface DashboardStats {
    activeTrekkers: number;
    totalTrails: number;
    activeGroups: number;
    safetyReports: number;
}

export interface AdminStats {
    stats: DashboardStats;
    userGrowth: Array<{
        day: string;
        users: number;
        groups: number;
    }>;
    recentActivities: Array<{
        id: number;
        user: string;
        action: string;
        trail?: string;
        time: string;
    }>;
}

/**
 * Fetch admin dashboard statistics
 */
export const getAdminStats = async (): Promise<AdminStats | null> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_URL}/admin/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('[AdminService] Failed to fetch admin stats:', response.status);
            return null;
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error('[AdminService] Error fetching admin stats:', error);
        return null;
    }
};

/**
 * Fetch admin user profile data
 */
export const getAdminProfileData = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('[AdminService] Failed to fetch admin profile:', response.status);
            return null;
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error('[AdminService] Error fetching admin profile:', error);
        return null;
    }
};

/**
 * Fetch admin activity logs
 */
export const getAdminActivityLogs = async (limit: number = 20) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];

        const response = await fetch(`${API_URL}/admin/activities?limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('[AdminService] Failed to fetch activity logs:', response.status);
            return [];
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('[AdminService] Error fetching activity logs:', error);
        return [];
    }
};

/**
 * Fetch user growth data for the dashboard
 */
export const getUserGrowthData = async (days: number = 7) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];

        const response = await fetch(`${API_URL}/admin/growth?days=${days}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('[AdminService] Failed to fetch growth data:', response.status);
            return [];
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('[AdminService] Error fetching growth data:', error);
        return [];
    }
};
