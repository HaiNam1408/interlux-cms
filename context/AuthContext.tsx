'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService, { UserProfile } from '@/api/auth';

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication Provider props
interface AuthProviderProps {
    children: ReactNode;
}

// Create the Authentication Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { user: loggedInUser } = await authService.login({ email, password });
            if(!loggedInUser) {
                throw new Error('Failed to login');
            }
            setUser(loggedInUser);

            router.push('/');
        } catch (error: any) {
            setError(error.message || 'An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setIsLoading(true);
        authService.logout();
        setUser(null);
        setIsLoading(false);
        router.push('/auth/login');
    };

    const isAuthenticated = !!user;

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        error
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
