export type TVisionProfile = {
    id: string;
    name: string;
    running: boolean;
    is_received: boolean;
    port?: number;
    profile_name?: string;
}

export type TVisionFolder = {
    id: string;
    name: string;
}