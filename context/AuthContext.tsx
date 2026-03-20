"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'rave_head' | 'og_vendor' | 'admin' | 'support';
    image?: string;
    profileImage?: string;
    isPro?: boolean;
    proExpiry?: string;
    username?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check localStorage on mount
        const storedToken = localStorage.getItem('rave_token');
        const storedUser = localStorage.getItem('rave_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('rave_token', newToken);
        localStorage.setItem('rave_user', JSON.stringify(newUser));
        router.refresh();
    };

    const refreshUser = async () => {
        const storedToken = localStorage.getItem('rave_token');
        if (!storedToken) return;
        try {
            const res = await fetch('/api/users/me', {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                const freshUser = data.user || data;
                setUser(freshUser);
                localStorage.setItem('rave_user', JSON.stringify(freshUser));
            }
        } catch (e) {
            console.error('refreshUser error:', e);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('rave_token');
        localStorage.removeItem('rave_user');
        router.push('/');
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
