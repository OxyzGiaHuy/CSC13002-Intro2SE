import { apiCall } from './api';
import type { SocialPost } from '../types/index';

export const getPosts = async (page = 1, limit = 20): Promise<{ total:number; page:number; pages:number; data: SocialPost[] } | SocialPost[]> => {
    try {
        const res = await apiCall('GET', `/api/community/posts?page=${page}&limit=${limit}`);
        return res;
    } catch (err) {
        console.error('[communityService] getPosts error', err);
        throw err;
    }
};

export const createPost = async (post: Partial<SocialPost>) => {
    try {
        const res = await apiCall('POST', '/api/community/posts', post);
        return res;
    } catch (err) {
        console.error('[communityService] createPost error', err);
        throw err;
    }
};

export default { getPosts, createPost };
