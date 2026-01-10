export interface Challenge {
    challenge_id: number;
    name: string;
    description: string;
    challenge_type: 'DISTANCE' | 'ELEVATION' | 'TRAIL_COUNT' | 'DURATION' | 'STREAK';
    target_value: number;
    unit: string;
    start_date: string;
    end_date: string;
    image_url?: string; // Optional since schema doesn't have it explicitly but UI might assume
    participants_count?: number;
    progress?: number;
}
