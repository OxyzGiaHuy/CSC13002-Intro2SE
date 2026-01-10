export interface GroupMember {
    user_id: number;
    username: string;
    avatar_url: string;
    role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
}

export interface Group {
    group_id: number;
    name: string;
    description: string;
    avatar_url: string;
    group_type: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
    member_count?: number; // derived or explicit
    post_count?: number;
    members?: GroupMember[];
    is_member?: boolean; // helper for UI
}
