// View type definitions for navigation
export type View = 'home' | 'discover' | 'planner' | 'community' | 'profile' | 'group'
    | 'admin_dashboard' | 'admin_users' | 'admin_reviews_moderation' | 'admin_posts_moderation'
    | { view: 'trailDetail', id: number, from: 'home' | 'discover' | 'profile' }
    | { view: 'mapView', id: number, fromTrailDetail: { view: 'trailDetail', id: number, from: 'home' | 'discover' | 'profile' } }
    | { view: 'group', name: string };

export type AuthView = 'login' | 'register';

