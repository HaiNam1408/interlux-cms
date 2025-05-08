'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authService, { UserProfile } from '@/api/auth';

// Define the Authentication Context type
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create the Authentication Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the Authentication Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the Authentication Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Get user from token
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call login service which handles token storage and user extraction
      const { user: loggedInUser } = await authService.login({ email, password });

      // Set user in state
      setUser(loggedInUser);

      // Redirect to dashboard
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      // Set error message
      setError(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setIsLoading(true);
    try {
      // Call logout service which handles token removal
      authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear user state
      setUser(null);
      setIsLoading(false);
      // Redirect to login page
      router.push('/auth/login');
    }
  };

  // Determine if the user is authenticated
  const isAuthenticated = !!user;

  // Create the context value
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

// Create a hook to use the Authentication Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
