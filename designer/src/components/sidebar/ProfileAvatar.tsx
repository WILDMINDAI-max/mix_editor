'use client';

import React, { useRef, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Crown, User as UserIcon } from 'lucide-react';
import Image from 'next/image';

export function ProfileAvatar() {
    const { user, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [avatarFailed, setAvatarFailed] = useState(false);

    if (!user) return null;

    const handleLogout = async () => {
        try {
            // Call WildMind main app logout endpoint to clear HTTP-only session cookie
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (e) {
            console.warn('[Logout] Failed to call logout API, clearing locally anyway', e);
        }
        // Clear editor-side localStorage tokens
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Clear local Zustand auth state
        logout();
        // Redirect to landing page
        window.location.href = 'http://localhost:3000/view/Landingpage?toast=LOGOUT_SUCCESS';
    };

    const getInitials = () => {
        return (user.username || user.email || 'U').charAt(0).toUpperCase();
    };

    return (
        <div className="relative mt-auto w-full pt-4 pb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="mx-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-transparent bg-gradient-to-br from-blue-500 to-purple-600 transition-all hover:scale-105 hover:border-white/20 hover:shadow-lg"
            >
                {user.photoURL && !avatarFailed ? (
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarFailed(true)}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-sm font-bold text-white uppercase">{getInitials()}</span>
                )}
            </button>

            {/* Profile Popup Menu */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        ref={menuRef}
                        className="absolute bottom-16 left-16 z-50 w-[280px] origin-bottom-left rounded-2xl border border-[#2A2B2C]/50 bg-[#1A1C1E] p-4 py-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4"
                    >
                        <div className="mb-3 flex items-center gap-3 border-b border-[#2A2B2C] pb-3 pt-2">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                                {user.photoURL && !avatarFailed ? (
                                    <img
                                        src={user.photoURL}
                                        alt="Profile"
                                        onError={() => setAvatarFailed(true)}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-lg font-bold text-white uppercase">{getInitials()}</span>
                                )}
                            </div>
                            <div className="flex flex-col min-w-0 pr-2">
                                <span className="truncate text-sm font-semibold text-white">{user.username || 'User'}</span>
                                <span className="truncate text-xs text-gray-400">{user.email || 'user@example.com'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 pb-2">
                            <div className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/5 disabled:opacity-50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <Crown size={14} className="text-yellow-500" />
                                    <span className="text-xs font-medium text-gray-300">Plan</span>
                                </div>
                                <span className="text-xs font-semibold text-white">{user.plan || 'Free'}</span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/5 disabled:opacity-50 transition-colors">
                                <div className="flex items-center gap-2">
                                    <UserIcon size={14} className="text-blue-400" />
                                    <span className="text-xs font-medium text-gray-300">Status</span>
                                </div>
                                <span className="text-xs font-semibold text-green-400">
                                    {user.metadata?.accountStatus || 'Active'}
                                </span>
                            </div>

                            <div className="my-1 border-t border-[#2A2B2C]" />

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                            >
                                <LogOut size={14} />
                                Log Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
