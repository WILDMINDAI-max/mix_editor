import { create } from 'zustand';

export interface UserData {
    uid: string;
    email: string;
    username: string;
    photoURL?: string;
    plan?: string;
    metadata?: {
        accountStatus: string;
    };
    credits?: number;
}

interface AuthState {
    user: UserData | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: UserData | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
    logout: () => {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            document.cookie = 'app_session=; Max-Age=0; path=/; domain=' + window.location.hostname;
        } catch (e) { }
        set({ user: null, isAuthenticated: false });
    },
}));
