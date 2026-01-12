// Utility functions for Google Maps integration

interface Coordinates {
    lat: number;
    lng: number;
}

/**
 * Opens Google Maps to show directions from start to end location
 * @param start - Starting coordinates (if null, uses user's current location)
 * @param end - Destination coordinates
 * @param mode - Travel mode (default is 'driving')
 */
export const openGoogleMapsDirections = (
    start: Coordinates | null,
    end: Coordinates,
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
): void => {
    const baseUrl = "https://www.google.com/maps/dir/?api=1";

    // Build destination parameter (required)
    const destinationParam = `&destination=${end.lat},${end.lng}`;

    // Build origin parameter (optional)
    // If start is not provided, Google Maps will use user's current location
    const originParam = start ? `&origin=${start.lat},${start.lng}` : "";

    const modeParam = `&travelmode=${mode}`;

    const fullUrl = `${baseUrl}${originParam}${destinationParam}${modeParam}`;

    // Open in new tab
    window.open(fullUrl, '_blank');
};

/**
 * Opens Google Maps to show the full trail route from start to end
 * This shows the actual hiking trail path, not driving directions
 * @param startPoint - Trail starting coordinates (trailhead)
 * @param endPoint - Trail ending coordinates (summit/destination)
 */
export const openTrailRoute = (
    startPoint: Coordinates,
    endPoint: Coordinates
): void => {
    const baseUrl = "https://www.google.com/maps/dir/?api=1";

    const originParam = `&origin=${startPoint.lat},${startPoint.lng}`;
    const destinationParam = `&destination=${endPoint.lat},${endPoint.lng}`;
    
    // Mode walking
    const modeParam = `&travelmode=walking`; 

    const fullUrl = `${baseUrl}${originParam}${destinationParam}${modeParam}`;
    window.open(fullUrl, '_blank');
};

/**
 * Opens Google Maps to show a specific location
 * @param coordinates - Location coordinates to display
 * @param label - Optional label for the location
 */
export const openGoogleMapsLocation = (
    coordinates: Coordinates,
    label?: string
): void => {
    const baseUrl = "https://www.google.com/maps/search/?api=1";
    const query = label
        ? `&query=${encodeURIComponent(label)}+${coordinates.lat},${coordinates.lng}`
        : `&query=${coordinates.lat},${coordinates.lng}`;

    const fullUrl = `${baseUrl}${query}`;
    window.open(fullUrl, '_blank');
};

/**
 * Gets the Google Maps URL for embedding
 * @param coordinates - Location coordinates
 * @param zoom - Zoom level (default is 15)
 * @returns Embeddable Google Maps URL
 */
export const getGoogleMapsEmbedUrl = (
    coordinates: Coordinates,
    zoom: number = 15
): string => {
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s&zoom=${zoom}`;
};
