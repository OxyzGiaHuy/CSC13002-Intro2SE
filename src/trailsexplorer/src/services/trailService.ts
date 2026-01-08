import type { Trail } from '../types/index';
import { apiCall } from './api';

export const getTrails = async (): Promise<Trail[]> => {
    try {
        const res = await apiCall('GET', '/api/trails');
        // backend returns paginated object { total, page, pages, data }
        if (Array.isArray(res)) return res as Trail[];
        if (res && Array.isArray(res.data)) return res.data as Trail[];
        return [];
    } catch (err) {
        console.error('[trailService] getTrails error', err);
        throw err;
    }
};

export const getTrailById = async (id: number): Promise<Trail | null> => {
    try {
        const data = await apiCall('GET', `/api/trails/${id}`);
        return data as Trail;
    } catch (err: any) {
        if (err?.message?.includes('Not Found') || err?.message?.includes('404')) return null;
        console.error('[trailService] getTrailById error', err);
        throw err;
    }
};

export const searchTrails = async (searchTerm: string): Promise<Trail[]> => {
    try {
        const q = encodeURIComponent(searchTerm || '');
        // backend exposes a dedicated search endpoint
        const data = await apiCall('GET', `/api/trails/search?q=${q}`);
        return Array.isArray(data) ? (data as Trail[]) : [];
    } catch (err) {
        console.error('[trailService] searchTrails error', err);
        throw err;
    }
};

export const filterTrailsByDifficulty = async (difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<Trail[]> => {
    try {
        const res = await apiCall('GET', `/api/trails?difficulty=${encodeURIComponent(difficulty)}`);
        if (Array.isArray(res)) return res as Trail[];
        if (res && Array.isArray(res.data)) return res.data as Trail[];
        return [];
    } catch (err) {
        console.error('[trailService] filterTrailsByDifficulty error', err);
        throw err;
    }
};

