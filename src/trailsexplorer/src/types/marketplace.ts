export interface MarketplaceItem {
    item_id: number;
    title: string;
    description: string;
    price: number | string;
    condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
    images: string[];
    status: 'AVAILABLE' | 'SOLD' | 'PENDING' | 'DRAFT' | 'HIDDEN';
    category: string;
    seller?: {
        username: string;
        avatar_url: string;
    };
    created_at?: string;
}
