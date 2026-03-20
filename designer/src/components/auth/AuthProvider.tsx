'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getApiClient } from '../../lib/axiosInstance';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, setUser, setLoading, isLoading } = useAuthStore();
    const [authFailed, setAuthFailed] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // First aggressively try to load from localStorage since it has the richest user object
                let loadedUser = null;
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        loadedUser = JSON.parse(storedUser);
                    } catch (e) { }
                }

                const api = getApiClient();
                const response = await api.get('/api/auth/me');
                const payload = response?.data?.data?.user || response?.data?.user || response?.data?.data || response?.data;

                if (payload) {
                    setUser({ ...loadedUser, ...payload });
                } else if (loadedUser) {
                    setUser(loadedUser);
                } else {
                    throw new Error("No data in response and no local storage fallback");
                }
            } catch (error) {
                console.error('Authentication failed:', error);
                setAuthFailed(true);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [setUser, setLoading]);

    // Automatically redirect on auth failure
    useEffect(() => {
        if (!isLoading && (authFailed || !user)) {
             // Redirect to main app login
             const loginUrl = (process.env.NEXT_PUBLIC_LOGIN_URL || 'http://localhost:3000/view/signup').trim();
             const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
             window.location.href = `${loginUrl}?next=${encodeURIComponent(currentUrl)}&toast=AUTH_REQUIRED`;
        }
    }, [isLoading, authFailed, user]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#07070B]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm font-medium text-gray-400">Loading wild mind editor...</p>
                </div>
            </div>
        );
    }

    if (authFailed || !user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#07070B]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm font-medium text-gray-400">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
