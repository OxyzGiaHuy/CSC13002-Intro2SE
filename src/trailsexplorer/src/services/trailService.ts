import type { Trail } from '../types/index';

const API_BASE = '/api/trails';

export const getTrails = async (): Promise<Trail[]> => {
    try {
        const res = await fetch(`${API_BASE}`);
        if (!res.ok) throw new Error(`Failed to fetch trails: ${res.status}`);
        const data = await res.json();
        return data as Trail[];
    } catch (err) {
        console.error('[trailService] getTrails error', err);
        throw err;
    }
};

export const getTrailById = async (id: number): Promise<Trail | null> => {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Failed to fetch trail ${id}: ${res.status}`);
        const data = await res.json();
        return data as Trail;
    } catch (err) {
        console.error('[trailService] getTrailById error', err);
        throw err;
    }
};

export const searchTrails = async (searchTerm: string): Promise<Trail[]> => {
    try {
        const q = encodeURIComponent(searchTerm || '');
        const res = await fetch(`${API_BASE}?search=${q}`);
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        return (await res.json()) as Trail[];
    } catch (err) {
        console.error('[trailService] searchTrails error', err);
        throw err;
    }
};

export const filterTrailsByDifficulty = async (difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<Trail[]> => {
    try {
        const res = await fetch(`${API_BASE}?difficulty=${encodeURIComponent(difficulty)}`);
        if (!res.ok) throw new Error(`Filter failed: ${res.status}`);
        return (await res.json()) as Trail[];
    } catch (err) {
        console.error('[trailService] filterTrailsByDifficulty error', err);
        throw err;
    }
};

