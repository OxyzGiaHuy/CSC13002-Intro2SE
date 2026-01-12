
import React from 'react';
import type { Trail, User, GuidebookArticle, MarketplaceItem, Challenge, SocialPost, WeatherForecast, VoiceLog, Group, GroupMember, ChatMessage } from '../types/index';

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
      { full_name: "An Nguyen", avatarUrl: "https://picsum.photos/seed/an/40/40", rating: 5, comment: "Absolutely breathtaking! A must-do for any serious trekker in Vietnam." },
      { full_name: "Binh Le", avatarUrl: "https://picsum.photos/seed/binh/40/40", rating: 4, comment: "Challenging but rewarding. Make sure you are well-prepared." },
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
      { full_name: "Chi Pham", avatarUrl: "https://picsum.photos/seed/chi/40/40", rating: 5, comment: "The view from the top is surreal. Worth every single step!" },
    ],
    isFavorited: true,
    lat: 22.304,
    lng: 103.775,
  },
  {
    id: 3,
    name: "Langbiang Mountain",
    location: "Đà Lạt, Lâm Đồng",
    difficulty: "Moderate",
    length_km: 8,
    duration_hr: 5,
    rating: 4.6,
    scenery: ["Pine forests", "City view"],
    description: "A popular day-hike near Da Lat, Langbiang offers panoramic views of the city and surrounding highlands. The trail winds through beautiful pine forests.",
    imageUrl: "https://picsum.photos/seed/langbiang/800/600",
    reviews: [
      { full_name: "Dung Tran", avatarUrl: "https://picsum.photos/seed/dung/40/40", rating: 4, comment: "Great for a day trip. Not too hard and the view is lovely." },
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
      { full_name: "Emi Sato", avatarUrl: "https://picsum.photos/seed/emi/40/40", rating: 5, comment: "Beautiful and educational. The primate rescue center is a highlight." },
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
    difficulty: ['Hard', 'Moderate'],
    scenery: ['Mountains', 'Forest', 'Grasslands']
  }
};

export const MOCK_GUIDEBOOK_ARTICLES: GuidebookArticle[] = [
  {
    id: "skills",
    title: "Essential Trekking Skills for Beginners",
    category: "Skills",
    author: "Sarah Trailblazer",
    date: "Jan 10, 2026",
    imageUrl: "https://picsum.photos/seed/skills/800/600",
    content: `
# Mastering the Basics

Trekking is more than just walking; it's about endurance, preparation, and respect for nature. Here are the core skills every beginner needs to master.

## 1. Navigation
Never rely solely on your phone. Batteries die, and GPS fails. Learn to read a topographic map and use a compass. Identify landmarks and understand what contour lines represent.

## 2. Pacing
"Start slow to go fast." This adage holds true. Find a rhythm you can maintain for hours without getting winded. Use the "rest step" on steep ascents—locking your rear knee for a split second to rest your muscles.

## 3. Hydration & Nutrition
Drink before you're thirsty. Eat before you're hungry. On the trail, your body burns calories at an accelerated rate. Pack energy-dense foods like nuts, dried fruit, and energy bars.

## 4. Leave No Trace
The golden rule of the outdoors. Pack out everything you pack in. Do not disturb wildlife. Leave rocks and plants where you find them.

> "The mountains are calling and I must go." - John Muir
    `,
  },
  {
    id: "camping",
    title: "Wild Camping: A Complete Guide",
    category: "Camping",
    author: "Mike Treks",
    date: "Jan 08, 2026",
    imageUrl: "https://picsum.photos/seed/camping/800/600",
    content: `
# Sleeping Under the Stars

Wild camping offers an unparalleled sense of freedom, but it comes with responsibilities.

## Choosing Your Spot
- **Safety**: Avoid potential hazards like falling rocks or dead trees (widowmakers).
- **Water**: Camp at least 200 feet away from lakes and streams to protect riparian areas.
- **Surface**: Choose a durable surface like rock, bare ground, or established campsites.

## Gear Essentials
- **Tent**: Ensure it's rated for the weather. A 3-season tent is standard for most trips.
- **Sleeping Bag**: Rating should be 10°F lower than the lowest expected temperature.
- **Sleeping Pad**: Insulation from the cold ground is just as important as the bag itself.

## Campfire Etiquette
Use a stove for cooking. If you must have a fire, keep it small, use established fire rings, and burn only small text sticks found on the ground.
    `,
  },
  {
    id: "first-aid",
    title: "Wilderness First-Aid Fundamentals",
    category: "Safety",
    author: "Jenny Pines",
    date: "Jan 05, 2026",
    imageUrl: "https://picsum.photos/seed/firstaid/800/600",
    content: `
# Be Prepared for Emergencies

When you're miles from civilization, you are your own first responder. A well-stocked kit and the knowledge to use it are non-negotiable.

## The Essentials Kit
- **Adhesive Bandages**: Various sizes for minor cuts.
- **Blister Treatment**: Moleskin or hydrocolloid bandages. Blisters can end a hike.
- **Antiseptic Wipes**: To clean wounds and prevent infection.
- **Pain Relief**: Ibuprofen or Acetaminophen.
- **Antihistamines**: For allergic reactions to plants or insect stings.

## Common Injuries
1.  **Sprains**: R.I.C.E (Rest, Ice, Compression, Elevation). Use a trekking pole or branch as a splint if needed.
2.  **Dehydration**: Symptoms include headache, dizziness, and dark urine. Prevention is key.
3.  **Hypothermia**: Can happen even in cool (not freezing) weather if wet. Get dry and warm immediately.

**Pro Tip**: Take a WFA (Wilderness First Aid) course. Hands-on practice saves lives.
    `,
  },
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  { item_id: 1, title: "Trekking Poles (Used)", description: "Durable aluminum poles, slightly scratched but fully functional.", price: 450000, images: ["https://picsum.photos/seed/poles/400/300"], seller: { username: "An Nguyen", avatar_url: "https://picsum.photos/seed/an/40/40" }, condition: 'GOOD', status: 'AVAILABLE', category: 'Gear' },
  { item_id: 2, title: "2-Person Tent", description: "Lightweight tent, used only once. Perfect for weekend trips.", price: 1200000, images: ["https://picsum.photos/seed/tent/400/300"], seller: { username: "Binh Le", avatar_url: "https://picsum.photos/seed/binh/40/40" }, condition: 'LIKE_NEW', status: 'AVAILABLE', category: 'Gear' },
  { item_id: 3, title: "Waterproof Hiking Boots", description: "Brand new boots, size 42. Never worn.", price: 1800000, images: ["https://picsum.photos/seed/boots/400/300"], seller: { username: "Chi Pham", avatar_url: "https://picsum.photos/seed/chi/40/40" }, condition: 'NEW', status: 'AVAILABLE', category: 'Gear' },
  { item_id: 4, title: "65L Backpack", description: "Spacious backpack with rain cover. Good condition.", price: 900000, images: ["https://picsum.photos/seed/pack/400/300"], seller: { username: "Dung Tran", avatar_url: "https://picsum.photos/seed/dung/40/40" }, condition: 'GOOD', status: 'AVAILABLE', category: 'Gear' },
];

export const MOCK_CHALLENGES: Challenge[] = [
  { challenge_id: 1, name: "Monthly Altitude Gain", description: "Climb the most elevation this month.", progress: 3400, target_value: 5000, unit: "m", challenge_type: 'ELEVATION', start_date: '2026-01-01', end_date: '2026-01-31' },
  { challenge_id: 2, name: "Trail Conqueror", description: "Complete 5 different trails in 3 months.", progress: 2, target_value: 5, unit: "trails", challenge_type: 'TRAIL_COUNT', start_date: '2026-01-01', end_date: '2026-03-31' },
  { challenge_id: 3, name: "100km Challenge", description: "Trek 100km in a single month.", progress: 78, target_value: 100, unit: "km", challenge_type: 'DISTANCE', start_date: '2026-01-01', end_date: '2026-01-31' },
  { challenge_id: 4, name: "Early Bird Trekker", description: "Start 3 treks before 6 AM.", progress: 1, target_value: 3, unit: "treks", challenge_type: 'TRAIL_COUNT', start_date: '2026-02-01', end_date: '2026-02-28' },
  { challenge_id: 5, name: "Photo Hunter", description: "Take 50 photos on trails.", progress: 32, target_value: 50, unit: "photos", challenge_type: 'OTHER', start_date: '2026-01-15', end_date: '2026-02-15' },
  { challenge_id: 6, name: "Rainforest Survivor", description: "Complete a trek in rainy conditions.", progress: 0, target_value: 1, unit: "trek", challenge_type: 'TRAIL_COUNT', start_date: '2026-03-01', end_date: '2026-03-31' },
];

export const MOCK_SOCIAL_FEED: SocialPost[] = [
  { post_id: 1, user: { username: "An Nguyen", avatar_url: "https://picsum.photos/seed/an/40/40" }, content: "Just got back from Tà Năng - Phan Dũng. The grasslands are even more beautiful in person!", media_urls: ["https://picsum.photos/seed/tanangpost/800/600"], content_type: 'TRIP_REPORT', like_count: 5, comment_count: 1, share_count: 0, created_at: '2026-01-01T10:00:00Z' },
  { post_id: 2, user: { username: "Chi Pham", avatar_url: "https://picsum.photos/seed/chi/40/40" }, content: "Reached the summit of Fansipan! Feeling on top of the world. #RoofOfIndochina", media_urls: ["https://picsum.photos/seed/fansipanpost/800/600"], content_type: 'TRIP_REPORT', like_count: 12, comment_count: 4, share_count: 2, created_at: '2026-01-02T14:30:00Z' },
];

export const MOCK_WEATHER: WeatherForecast[] = [
  { day: 'Today', temp_c: 24, condition: 'Sunny' },
  { day: 'Tomorrow', temp_c: 22, condition: 'Cloudy' },
  { day: 'Fri', temp_c: 19, condition: 'Rainy' },
  { day: 'Sat', temp_c: 18, condition: 'Stormy' },
];

export const MOCK_VOICE_LOGS: VoiceLog[] = [
  { id: 1, timestamp: 'Today, 10:45 AM', location: '10.8231° N, 106.6297° E', transcript_preview: 'Found a beautiful waterfall here, the water is crystal clear...' },
  { id: 2, timestamp: 'Today, 01:20 PM', location: '10.8315° N, 106.6352° E', transcript_preview: 'The path is getting a bit steep, need to be careful. The view is opening up...' },
];

// --- GROUP DATA ---

export const MOCK_GROUP_MEMBERS: GroupMember[] = [
  { user_id: 1, username: "Gia Huy", avatar_url: "https://picsum.photos/seed/alex/100/100", role: 'OWNER' },
  { user_id: 2, username: "An Nguyen", avatar_url: "https://picsum.photos/seed/an/40/40", role: 'MEMBER' },
  { user_id: 3, username: "Binh Le", avatar_url: "https://picsum.photos/seed/binh/40/40", role: 'MEMBER' },
  { user_id: 4, username: "Chi Pham", avatar_url: "https://picsum.photos/seed/chi/40/40", role: 'MEMBER' },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  { id: 1, author: "An Nguyen", avatarUrl: "https://picsum.photos/seed/an/40/40", text: "What a view from this ridge!", timestamp: "10:30 AM", isCurrentUser: false },
  { id: 2, author: "Gia Huy", avatarUrl: "https://picsum.photos/seed/alex/100/100", text: "Incredible! Let's take a short break here. Everyone doing okay?", timestamp: "10:31 AM", isCurrentUser: true },
  { id: 3, author: "Binh Le", avatarUrl: "https://picsum.photos/seed/binh/40/40", text: "A bit tired, but I'm catching up! Don't wait too long for me.", timestamp: "10:32 AM", isCurrentUser: false },
];

export const MOCK_GROUP: Group = {
  group_id: 1,
  name: "Tà Năng Conquerors",
  description: "Group for conquering Tà Năng",
  avatar_url: "https://picsum.photos/seed/tananggroup/100/100",
  group_type: 'PUBLIC',
  members: MOCK_GROUP_MEMBERS,
  member_count: 4,
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

export const HeartIcon = ({ filled, ...rest }: { filled?: boolean } & React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...rest}>
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
