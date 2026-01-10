
import axios from 'axios';
import { SocialPost } from '../types/post'; // Assume types exist or I define them
import { MarketplaceItem } from '../types/marketplace'; // define these types if needed
import { Group } from '../types/group';
import { Challenge } from '../types/challenge';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Posts ---
export const getPosts = async (page = 1, limit = 10, type?: string, search?: string) => {
    const params: any = { page, limit };
    if (type && type !== 'ALL') params.type = type;
    if (search) params.search = search;

    const response = await axios.get(`${API_URL}/community/posts`, {
        params,
        headers: getAuthHeader()
    });
    return response.data;
};

export const createPost = async (postData: any) => {
    const response = await axios.post(`${API_URL}/community/posts`, postData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const likePost = async (postId: number) => {
    const response = await axios.post(`${API_URL}/community/posts/${postId}/like`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const sharePost = async (postId: number) => {
    const response = await axios.post(`${API_URL}/community/posts/${postId}/share`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};

// --- Marketplace ---
export const getMarketplaceItems = async (filters?: { category?: string; price_min?: number; price_max?: number; condition?: string; search?: string }) => {
    const params: any = { ...filters };
    // Remove empty keys
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    const response = await axios.get(`${API_URL}/marketplace`, {
        params,
        headers: getAuthHeader()
    });
    return response.data;
};

export const createMarketplaceItem = async (itemData: any) => {
    const response = await axios.post(`${API_URL}/marketplace`, itemData, {
        headers: getAuthHeader()
    });
    return response.data;
};

// --- Groups ---
export const getGroups = async () => {
    const response = await axios.get(`${API_URL}/groups`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createGroup = async (groupData: any) => {
    const response = await axios.post(`${API_URL}/groups`, groupData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const joinGroup = async (groupId: number) => {
    const response = await axios.post(`${API_URL}/groups/${groupId}/join`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};

// --- Challenges ---
export const getChallenges = async () => {
    const response = await axios.get(`${API_URL}/challenges`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const joinChallenge = async (challengeId: number) => {
    const response = await axios.post(`${API_URL}/challenges/${challengeId}/join`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};
// --- Notifications ---
export const getNotifications = async () => {
    const response = await axios.get(`${API_URL}/community/notifications`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const markNotificationAsRead = async (notificationId: number) => {
    const response = await axios.post(`${API_URL}/community/notifications/${notificationId}/read`, {}, {
        headers: getAuthHeader()
    });
    return response.data;
};
