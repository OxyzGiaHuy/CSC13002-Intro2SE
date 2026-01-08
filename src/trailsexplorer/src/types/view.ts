// View type definitions for navigation
export type View = 'home' | 'discover' | 'planner' | 'community' | 'profile' | 'group'
    | 'admin_dashboard' | 'admin_users'
    | { view: 'trailDetail', id: number, from: 'home' | 'discover' | 'profile' }
    | { view: 'mapView', id: number, fromTrailDetail: { view: 'trailDetail', id: number, from: 'home' | 'discover' | 'profile' } };

export type AuthView = 'login' | 'register';

