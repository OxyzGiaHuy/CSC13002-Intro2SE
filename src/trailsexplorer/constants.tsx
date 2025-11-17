
import React from 'react';
import type { Trail, User, GuidebookArticle, MarketplaceItem, CommunityChallenge, SocialPost, WeatherForecast, VoiceLog, Group, GroupMember, ChatMessage } from './types';

export const MOCK_TRAILS: Trail[] = [
  {
    id: 1,
    name: "Tà Năng - Phan Dũng",
    location: "Bình Thuận, Lâm Đồng",
    difficulty: "Hard",
    length_km: 55,
    duration_hr: 24,
    rating: 4.9,
    scenery: ["Grasslands", "Forest", "Hills"],
    description: "Known as one of the most beautiful trekking routes in Vietnam, this trail crosses three provinces, offering stunning landscapes of green grasslands and pine forests.",
    imageUrl: "https://picsum.photos/seed/tanang/800/600",
    reviews: [
      { username: "An Nguyen", avatarUrl: "https://picsum.photos/seed/an/40/40", rating: 5, comment: "Absolutely breathtaking! A must-do for any serious trekker in Vietnam." },
      { username: "Binh Le", avatarUrl: "https://picsum.photos/seed/binh/40/40", rating: 4, comment: "Challenging but rewarding. Make sure you are well-prepared." },
    ],
    isFavorited: false,
    lat: 11.53,
    lng: 108.6,
  },
  {
    id: 2,
    name: "Fansipan Peak",
    location: "Sa Pa, Lào Cai",
    difficulty: "Hard",
    length_km: 20,
    duration_hr: 18,
    rating: 4.8,
    scenery: ["Mountains", "Cloud sea", "Forest"],
    description: "Conquer the 'Roof of Indochina' with this challenging trek. The journey takes you through dense forests and bamboo thickets to the summit at 3,143 meters.",
    imageUrl: "https://picsum.photos/seed/fansipan/800/600",
    reviews: [
      { username: "Chi Pham", avatarUrl: "https://picsum.photos/seed/chi/40/40", rating: 5, comment: "The view from the top is surreal. Worth every single step!" },
    ],
    isFavorited: true,
    lat: 22.304,
    lng: 103.775,
  },
  {
    id: 3,
    name: "Langbiang Mountain",
    location: "Đà Lạt, Lâm Đồng",
    difficulty: "Medium",
    length_km: 8,
    duration_hr: 5,
    rating: 4.6,
    scenery: ["Pine forests", "City view"],
    description: "A popular day-hike near Da Lat, Langbiang offers panoramic views of the city and surrounding highlands. The trail winds through beautiful pine forests.",
    imageUrl: "https://picsum.photos/seed/langbiang/800/600",
    reviews: [
        { username: "Dung Tran", avatarUrl: "https://picsum.photos/seed/dung/40/40", rating: 4, comment: "Great for a day trip. Not too hard and the view is lovely." },
    ],
    isFavorited: false,
    lat: 12.055,
    lng: 108.438,
  },
  {
    id: 4,
    name: "Cúc Phương National Park",
    location: "Ninh Bình",
    difficulty: "Easy",
    length_km: 7,
    duration_hr: 3,
    rating: 4.5,
    scenery: ["Jungle", "Ancient trees", "Caves"],
    description: "Explore Vietnam's first national park. This easy trek is perfect for families and beginners, featuring ancient trees, caves, and a rich biodiversity.",
    imageUrl: "https://picsum.photos/seed/cucphuong/800/600",
    reviews: [
        { username: "Emi Sato", avatarUrl: "https://picsum.photos/seed/emi/40/40", rating: 5, comment: "Beautiful and educational. The primate rescue center is a highlight." },
    ],
    isFavorited: false,
    lat: 20.316,
    lng: 105.613,
  },
];

export const MOCK_USER: User = {
  name: "Gia Huy",
  avatarUrl: "https://picsum.photos/seed/alex/100/100",
  totalKm: 256,
  avgAltitude: 1200,
  avgTimeHr: 8.5,
  tripHistory: MOCK_TRAILS.slice(0, 2),
  preferences: {
    difficulty: ['Hard', 'Medium'],
    scenery: ['Mountains', 'Forest', 'Grasslands']
  }
};

export const MOCK_GUIDEBOOK_ARTICLES: GuidebookArticle[] = [
  {
    id: "skills",
    title: "Essential Trekking Skills",
    content: "Mastering navigation with a map and compass, understanding weather patterns, and proper pacing are crucial. Always let someone know your itinerary before you head out.",
  },
  {
    id: "camping",
    title: "Camping Basics",
    content: "Choose a durable tent suitable for the climate. Practice setting it up before your trip. Always follow Leave No Trace principles by packing out everything you pack in.",
  },
  {
    id: "first-aid",
    title: "First-Aid Fundamentals",
    content: "Your kit should include bandages, antiseptic wipes, blister treatment, pain relievers, and any personal medications. Knowing how to treat common injuries like sprains and cuts is vital.",
  },
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
    { id: 1, name: "Trekking Poles (Used)", price: 450000, imageUrl: "https://picsum.photos/seed/poles/400/300", seller: "An Nguyen", condition: 'Used' },
    { id: 2, name: "2-Person Tent", price: 1200000, imageUrl: "https://picsum.photos/seed/tent/400/300", seller: "Binh Le", condition: 'Like New' },
    { id: 3, name: "Waterproof Hiking Boots", price: 1800000, imageUrl: "https://picsum.photos/seed/boots/400/300", seller: "Chi Pham", condition: 'New' },
    { id: 4, name: "65L Backpack", price: 900000, imageUrl: "https://picsum.photos/seed/pack/400/300", seller: "Dung Tran", condition: 'Used' },
];

export const MOCK_CHALLENGES: CommunityChallenge[] = [
    { id: 1, title: "Monthly Altitude Gain", description: "Climb the most elevation this month.", progress: 3400, goal: 5000, unit: "m" },
    { id: 2, title: "Trail Conqueror", description: "Complete 5 different trails in 3 months.", progress: 2, goal: 5, unit: "trails" },
    { id: 3, title: "100km Challenge", description: "Trek 100km in a single month.", progress: 78, goal: 100, unit: "km" },
];

export const MOCK_SOCIAL_FEED: SocialPost[] = [
    { id: 1, author: "An Nguyen", avatarUrl: "https://picsum.photos/seed/an/40/40", content: "Just got back from Tà Năng - Phan Dũng. The grasslands are even more beautiful in person!", imageUrl: "https://picsum.photos/seed/tanangpost/800/600", trailName: "Tà Năng - Phan Dũng" },
    { id: 2, author: "Chi Pham", avatarUrl: "https://picsum.photos/seed/chi/40/40", content: "Reached the summit of Fansipan! Feeling on top of the world. #RoofOfIndochina", imageUrl: "https://picsum.photos/seed/fansipanpost/800/600", trailName: "Fansipan Peak" },
];

export const MOCK_WEATHER: WeatherForecast[] = [
    { day: 'Today', temp_c: 24, condition: 'Sunny' },
    { day: 'Tomorrow', temp_c: 22, condition: 'Cloudy' },
    { day: 'Fri', temp_c: 19, condition: 'Rainy' },
    { day: 'Sat', temp_c: 18, condition: 'Stormy' },
];

export const MOCK_VOICE_LOGS: VoiceLog[] = [
    { id: 1, timestamp: 'Today, 10:45 AM', location: '10.8231° N, 106.6297° E', transcript_preview: 'Found a beautiful waterfall here, the water is crystal clear...'},
    { id: 2, timestamp: 'Today, 01:20 PM', location: '10.8315° N, 106.6352° E', transcript_preview: 'The path is getting a bit steep, need to be careful. The view is opening up...'},
];

// --- GROUP DATA ---

export const MOCK_GROUP_MEMBERS: GroupMember[] = [
    { id: 1, name: "Gia Huy", avatarUrl: "https://picsum.photos/seed/alex/100/100", lat: 11.54, lng: 108.61, status: 'Leader' },
    { id: 2, name: "An Nguyen", avatarUrl: "https://picsum.photos/seed/an/40/40", lat: 11.535, lng: 108.605, status: 'On Track' },
    { id: 3, name: "Binh Le", avatarUrl: "https://picsum.photos/seed/binh/40/40", lat: 11.528, lng: 108.598, status: 'Lagging Behind' },
    { id: 4, name: "Chi Pham", avatarUrl: "https://picsum.photos/seed/chi/40/40", lat: 11.536, lng: 108.606, status: 'On Track' },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
    { id: 1, author: "An Nguyen", avatarUrl: "https://picsum.photos/seed/an/40/40", text: "What a view from this ridge!", timestamp: "10:30 AM", isCurrentUser: false },
    { id: 2, author: "Gia Huy", avatarUrl: "https://picsum.photos/seed/alex/100/100", text: "Incredible! Let's take a short break here. Everyone doing okay?", timestamp: "10:31 AM", isCurrentUser: true },
    { id: 3, author: "Binh Le", avatarUrl: "https://picsum.photos/seed/binh/40/40", text: "A bit tired, but I'm catching up! Don't wait too long for me.", timestamp: "10:32 AM", isCurrentUser: false },
];

export const MOCK_GROUP: Group = {
    id: 1,
    name: "Tà Năng Conquerors",
    trailName: "Tà Năng - Phan Dũng",
    members: MOCK_GROUP_MEMBERS,
    chatHistory: MOCK_CHAT_HISTORY,
};

// --- ICONS ---

export const LeafIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.23 18.05 9 13 17 12V8z" />
    <path d="M17 8a5.55 5.55 0 0 1-1.39 3.85C13.88 14.26 12 16 12 16s3.06-1.13 4.2-2.79A5.5 5.5 0 0 0 17.5 8H17zm-2.5-7.5A5.5 5.5 0 0 0 9 6.04c.26-1.2.9-2.32 1.8-3.04A5.5 5.5 0 0 0 14.5.5z" />
  </svg>
);

export const MountainIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2-4.25-5.7-4.25 5.7-1.6-1.2 2.85-3.8-3.75-5-1.6 1.2 4.25 5.7L1.2 18h21.6l-5.9-7.9 4.25-5.7-1.6-1.2z" />
  </svg>
);

export const CompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 5.42-2.083M12 21a8.949 8.949 0 0 1-5.42-2.083m10.84-13.834L8.58 15.42m5.84-6.84-6.84 5.84" />
    </svg>
);

export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962a3.75 3.75 0 1 0-7.5 0 3.75 3.75 0 0 0 7.5 0ZM10.5 18.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
);

export const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

export const MicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-12 0v1.5m6 6.75a.75.75 0 0 0 .75-.75V3.375a.75.75 0 0 0-1.5 0v10.875a.75.75 0 0 0 .75.75Z" />
    </svg>
);

export const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" />
    </svg>
);

export const CloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-5.354-2.247.75.75 0 0 0-1.06-1.06A4.5 4.5 0 0 0 9 15.75H6.75A4.5 4.5 0 0 0 2.25 15Z" />
    </svg>
);

export const LightningBoltIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

export const HeartIcon = (props: { filled?: boolean } & React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={props.filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
);

export const MapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-6.998 4.217 2.108a2.25 2.25 0 0 1 .98 1.967V18.75a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18.75V9.882c0-.87.483-1.655.98-1.967l4.217-2.108a2.25 2.25 0 0 1 2.526 0Z" />
    </svg>
);

export const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);
