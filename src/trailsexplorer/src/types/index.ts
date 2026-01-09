
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
}

export interface Review {
  username: string;
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

export interface MarketplaceItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  seller: string;
  condition: 'New' | 'Like New' | 'Used';
}

export interface CommunityChallenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  goal: number;
  unit: string;
}

export interface SocialPost {
  id: number;
  author: string;
  avatarUrl: string;
  content: string;
  imageUrl?: string;
  trailName: string;
}

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

// --- GROUP FEATURE TYPES ---
export interface ChatMessage {
  id: number;
  author: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

export interface GroupMember {
  id: number;
  name: string;
  avatarUrl: string;
  lat: number;
  lng: number;
  status: 'On Track' | 'Lagging Behind' | 'Leader';
}

export interface Group {
  id: number;
  name: string;
  trailName: string;
  members: GroupMember[];
  chatHistory: ChatMessage[];
}

