import type { Trail } from '../types/index';
// MOCK_TRAILS imported for fallback/types but not used for main fetch if API works
import { MOCK_TRAILS } from '../data/constants';

const API_URL = '/api';

/**
 * Service layer for trail-related operations
 * Connects to Backend API
 */

// Helper to map backend trail to frontend Trail type
const mapBackendTrailToFrontend = (backendTrail: any): Trail => {
    // Helper to capitalize difficulty (EASY -> Easy)
    const formatDifficulty = (diff: string): 'Easy' | 'Moderate' | 'Hard' => {
        if (!diff) return 'Moderate';
        const lower = diff.toLowerCase();
        return (lower.charAt(0).toUpperCase() + lower.slice(1)) as 'Easy' | 'Moderate' | 'Hard';
    };

    // Extract lat/lng if available (PostGIS format often comes as GeoJSON or needs parsing)
    // For now defaulting to some coords if missing, or parsing if simple
    let lat = 0; // Default
    let lng = 0; // Default
    if (backendTrail.location_coordinates && backendTrail.location_coordinates.coordinates) {
        // GeoJSON Point: [lng, lat]
        lng = backendTrail.location_coordinates.coordinates[0];
        lat = backendTrail.location_coordinates.coordinates[1];
    } else if (backendTrail.start_point && backendTrail.start_point.coordinates) {
        lng = backendTrail.start_point.coordinates[0];
        lat = backendTrail.start_point.coordinates[1];
    }

    return {
        id: backendTrail.trail_id,
        name: backendTrail.name,
        location: `${backendTrail.location_district || ''}, ${backendTrail.location_province || backendTrail.location_region || ''}`.replace(/^, /, ''),
        difficulty: formatDifficulty(backendTrail.difficulty),
        length_km: parseFloat(backendTrail.length_km) || 0,
        duration_hr: parseInt(backendTrail.estimated_duration_hours) || 0,
        rating: parseFloat(backendTrail.avg_rating) || 0,
        scenery: backendTrail.tags || [], // Assuming tags JSONB maps simply
        description: backendTrail.description || '',
        imageUrl: backendTrail.image_url || 'https://picsum.photos/800/600', // Fallback
        reviews: backendTrail.Reviews ? backendTrail.Reviews.map((r: any) => ({
            full_name: r.User ? (r.User.full_name || r.User.username || 'Anonymous') : 'Anonymous',
            avatarUrl: r.User ? r.User.avatar_url : 'https://i.pravatar.cc/150',
            rating: r.overall_rating,
            comment: r.content
        })) : [],
        total_reviews: backendTrail.num_reviews || 0,
        isFavorited: false, // User specific
        lat: lat,
        lng: lng,
    };
};

/**
 * Fetches all trails from the backend
 * @returns Promise that resolves to an array of trails
 */
export const getTrails = async (): Promise<Trail[]> => {
    try {
        const response = await fetch(`${API_URL}/trails?limit=100`);
        if (!response.ok) {
            throw new Error(`Error fetching trails: ${response.statusText}`);
        }
        const backendData = await response.json();
        // Backend returns array of trails directly or { data: [...] }?
        // Usually returns array based on standard Express practices, but let's handle array.
        const trailsArray = Array.isArray(backendData) ? backendData : (backendData.data || []);

        return trailsArray.map(mapBackendTrailToFrontend);
    } catch (error) {
        console.error("API getTrails failed, falling back to MOCK_TRAILS", error);
        return MOCK_TRAILS;
    }
};

/**
 * Fetches a single trail by ID
 * @param id - The trail ID
 * @returns Promise that resolves to a trail or null if not found
 */
export const getTrailById = async (id: number): Promise<Trail | null> => {
    try {
        const response = await fetch(`${API_URL}/trails/${id}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Error fetching trail ${id}`);
        }
        const backendTrail = await response.json();
        return mapBackendTrailToFrontend(backendTrail);
    } catch (error) {
        console.error(`API getTrailById(${id}) failed`, error);
        return MOCK_TRAILS.find(t => t.id === id) || null;
    }
};

/**
 * Searches trails by name
 * @param searchTerm - The search term
 * @returns Promise that resolves to an array of matching trails
 */
export const searchTrails = async (searchTerm: string): Promise<Trail[]> => {
    // Ideally backend handles search: /api/trails?q=...
    // For now, fetching all and filtering client side OR strictly implementing search
    // Using client side filtering on getTrails for simplicity if backend doesn't have search endpoint yet
    const allTrails = await getTrails();
    return allTrails.filter(trail =>
        trail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trail.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

/**
 * Filters trails by difficulty
 * @param difficulty - The difficulty level
 * @returns Promise that resolves to an array of filtered trails
 */
export const filterTrailsByDifficulty = async (difficulty: 'Easy' | 'Moderate' | 'Hard'): Promise<Trail[]> => {
    const allTrails = await getTrails();
    return allTrails.filter(trail => trail.difficulty === difficulty);
};


