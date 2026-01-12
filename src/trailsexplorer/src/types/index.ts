
export interface Trail {
  id: number;
  name: string;
  location: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  length_km: number;
  duration_hr: number;
  rating: number;
  scenery: string[];
  description: string;
  imageUrl: string;
  reviews: Review[];
  total_reviews?: number; // Added for list view
  isFavorited?: boolean; // Added for favorite feature
  lat: number;
  lng: number;
  start_point?: {
      type: string;
      coordinates: number[]; // [Longitude, Latitude]
  };
  end_point?: {
      type: string;
      coordinates: number[];
  };
  start_lat?: number; // Trail starting point latitude
  start_lng?: number; // Trail starting point longitude
  end_lat?: number;   // Trail ending point latitude
  end_lng?: number;   // Trail ending point longitude
}

export interface Review {
  full_name: string;
  avatarUrl: string;
  rating: number;
  comment: string;
}

export interface User {
  id?: string; // Added for admin management
  name: string;
  avatarUrl: string;
  totalKm: number;
  avgAltitude: number;
  avgTimeHr: number;
  tripHistory: Trail[];
  preferences: {
    difficulty: ('Easy' | 'Moderate' | 'Hard')[];
    scenery: string[];
  }
  // optional runtime properties
  role?: 'admin' | 'user';
  email?: string;
  status?: 'active' | 'inactive';
  bio?: string;
  phone?: string;
  home_city?: string;
  home_country?: string;
}

export interface GuidebookArticle {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author?: string;
  date?: string;
  category?: string;
}

export interface SmartSuggestion {
  name: string;
  type: 'Food' | 'Sightseeing';
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  route: string;
  distance_km: number;
  highlights: string[];
  camping_suggestion: string;
  smart_suggestions: SmartSuggestion[];
}

export interface ItineraryPlan {
  id?: number;
  location?: string;
  duration?: number;
  createdAt?: string;
  plan: ItineraryDay[];
  checklist?: string[]; // Added for unified AI response
}

export interface ChecklistItem {
  id: number;
  text: string;
  packed: boolean;
}

export interface ChecklistItem {
  id: number;
  text: string;
  packed: boolean;
}

// Export new community types
export * from './marketplace';
export * from './group';
export * from './challenge';
export * from './post';

// Added for Weather Feature
export interface WeatherForecast {
  day: string;
  temp_c: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
}

// Added for Voice Log Feature
export interface VoiceLog {
  id: number;
  timestamp: string;
  location: string;
  transcript_preview: string;
}

// Chat types - keep if not covered by Group
export interface ChatMessage {
  id: number;
  author: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

