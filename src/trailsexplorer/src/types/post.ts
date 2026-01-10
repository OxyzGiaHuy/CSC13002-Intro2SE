export interface SocialPost {
    post_id: number;
    user: {
        username: string;
        avatar_url: string;
        bio?: string;
        home_city?: string;
        total_distance_km?: number;
        total_trips_completed?: number;
        total_trails_conquered?: number;
    };
    content_type: 'TEXT' | 'PHOTO' | 'VIDEO' | 'TRIP_REPORT' | 'TRAIL_REVIEW' | 'QUESTION';
    title?: string;
    content: string;
    media_urls: string[];
    like_count: number;
    comment_count: number;
    share_count: number;
    is_liked?: boolean; // Frontend helper
    created_at: string;
}
