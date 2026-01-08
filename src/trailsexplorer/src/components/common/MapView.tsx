import React, { useEffect, useRef, useState } from 'react';
import type { Trail } from '../../types';
import { ArrowLeftIcon } from '../../data/constants';

// Declare Leaflet global
declare var L: any;

interface MapViewProps {
    trailId: number;
    onBack: () => void;
    trails: Trail[];
}

const MapView: React.FC<MapViewProps> = ({ trailId, onBack, trails }) => {
    const trail = trails.find(t => t.id === trailId);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const userMarkerRef = useRef<any>(null);
    const [userDistance, setUserDistance] = useState<string | null>(null);

    // Haversine formula to calculate distance between two points in km
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1);
    };

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                if (mapRef.current) {
                    // Remove existing user marker if any
                    if (userMarkerRef.current) {
                        mapRef.current.removeLayer(userMarkerRef.current);
                    }

                    // Add new user marker (Blue icon usually default, but let's make sure it's distinct if possible, 
                    // or just use default marker and rely on popup)
                    // For distinctiveness, we can use a circle marker or custom icon if available. 
                    // Using CircleMarker for simplicity and distinctiveness.
                    const userMarker = L.circleMarker([latitude, longitude], {
                        color: 'blue',
                        fillColor: '#30f',
                        fillOpacity: 0.5,
                        radius: 10
                    }).addTo(mapRef.current);
                    
                    userMarker.bindPopup("<b>You are here</b>").openPopup();
                    userMarkerRef.current = userMarker;

                    // Pan map to show both points if possible, or just user location
                    // mapRef.current.setView([latitude, longitude], 13);
                    
                    // Fit bounds to show both trail and user
                    if (trail) {
                        const hasCoords = typeof trail.lat === 'number' && typeof trail.lng === 'number' && isFinite(trail.lat) && isFinite(trail.lng);
                        if (hasCoords) {
                            const bounds = L.latLngBounds(
                                [trail.lat, trail.lng],
                                [latitude, longitude]
                            );
                            mapRef.current.fitBounds(bounds, { padding: [50, 50] });

                            // Calculate distance (cast coords to number since Trail.lat/lng are optional)
                            const dist = calculateDistance(latitude, longitude, Number(trail.lat), Number(trail.lng));
                            setUserDistance(dist);
                        } else {
                            // No trail coords: just center on user
                            mapRef.current.setView([latitude, longitude], 13);
                            setUserDistance(null);
                        }
                    }
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location.");
            }
        );
    };

    useEffect(() => {
        const hasCoords = trail && typeof trail.lat === 'number' && typeof trail.lng === 'number' && isFinite(trail.lat) && isFinite(trail.lng);

        if (hasCoords && mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current).setView([trail.lat, trail.lng], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([trail.lat, trail.lng]).addTo(map)
                .bindPopup(`<b>${trail.name}</b>`)
                .openPopup();

            mapRef.current = map;
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [trail]);

    if (!trail) return <div className="p-8 text-center">Trail map not found.</div>;

    const hasCoords = typeof trail.lat === 'number' && typeof trail.lng === 'number' && isFinite(trail.lat) && isFinite(trail.lng);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative">
            <button onClick={onBack} className="flex items-center gap-2 text-sage-green mb-4 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" /> Back to Trail Details
            </button>
            
            <div className="bg-white rounded-lg shadow-xl overflow-hidden relative">
                 <div className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-display text-forest-green">Map of {trail.name}</h2>
                        <p className="text-gray-600">{trail.location}</p>
                    </div>
                    {userDistance && (
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                            You are {userDistance}km away from start
                        </div>
                    )}
                </div>
                
                <div className="relative">
                    {hasCoords ? (
                        <div ref={mapContainerRef} style={{ height: '600px', width: '100%' }} />
                    ) : (
                        <div className="flex items-center justify-center h-[600px] w-full">
                            <div className="text-center text-gray-600">
                                <p className="text-lg font-medium">Map not available for this trail</p>
                                <p className="text-sm">No valid GPS coordinates were found for this trail.</p>
                            </div>
                        </div>
                    )}
                    
                    {/* My Location Button */}
                    <button 
                        onClick={handleMyLocation}
                        className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors text-forest-green"
                        title="Show My Location"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapView;
