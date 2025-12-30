import type { Trail } from '../types/index';
import { MOCK_TRAILS } from '../data/constants';

/**
 * Service layer for trail-related operations
 * Simulates API calls with delays
 */

/**
 * Fetches all trails from the backend
 * @returns Promise that resolves to an array of trails
 */
export const getTrails = async (): Promise<Trail[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...MOCK_TRAILS]);
        }, 500);
    });
};

/**
 * Fetches a single trail by ID
 * @param id - The trail ID
 * @returns Promise that resolves to a trail or null if not found
 */
export const getTrailById = async (id: number): Promise<Trail | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const trail = MOCK_TRAILS.find(t => t.id === id);
            resolve(trail || null);
        }, 300);
    });
};

/**
 * Searches trails by name
 * @param searchTerm - The search term
 * @returns Promise that resolves to an array of matching trails
 */
export const searchTrails = async (searchTerm: string): Promise<Trail[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = MOCK_TRAILS.filter(trail =>
                trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                trail.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
            resolve(filtered);
        }, 300);
    });
};

/**
 * Filters trails by difficulty
 * @param difficulty - The difficulty level
 * @returns Promise that resolves to an array of filtered trails
 */
export const filterTrailsByDifficulty = async (difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<Trail[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const filtered = MOCK_TRAILS.filter(trail => trail.difficulty === difficulty);
            resolve(filtered);
        }, 300);
    });
};

