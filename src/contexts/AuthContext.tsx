import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  display_name?: string;
  avatar_url?: string;
  location: string;
  stats: {
    places_visited: number;
    places_saved: number;
    reviews_written: number;
  };
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  session: any | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user for demo purposes
const MOCK_USER = {
  id: 'mock-user-id',
  email: 'demo@example.com',
};

// Mock profile for demo purposes
const MOCK_PROFILE: UserProfile = {
  id: 'mock-profile-id',
  display_name: 'Demo User',
  location: 'Chennai',
  stats: {
    places_visited: 12,
    places_saved: 8,
    reviews_written: 4,
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, password: string, metadata?: any) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful signup
    setUser(MOCK_USER);
    setProfile(MOCK_PROFILE);
    setSession({ user: MOCK_USER });
    
    toast({
      title: 'Welcome to Blitz!',
      description: 'Your account has been created successfully.',
    });
    
    setLoading(false);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    setUser(MOCK_USER);
    setProfile(MOCK_PROFILE);
    setSession({ user: MOCK_USER });
    
    toast({
      title: 'Welcome back!',
      description: 'You have been signed in successfully.',
    });
    
    setLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    setProfile(null);
    setSession(null);
    
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
    
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    }
    
    setLoading(false);
    return { error: profile ? null : new Error('No profile found') };
  };

  const refreshProfile = async () => {
    if (user) {
      // In a real app, this would fetch the latest profile data
      // For now, we'll just simulate a delay
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};