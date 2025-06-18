import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  auth_user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  location: string;
  preferences: Record<string, any>;
  stats: {
    places_visited: number;
    places_saved: number;
    reviews_written: number;
  };
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUserId: string) => {
    try {
      console.log('Fetching profile for user:', authUserId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Profile not found, creating new profile');
        await createUserProfile(authUserId);
      } else if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Profile Error',
          description: 'Could not load your profile. Please try again.',
          variant: 'destructive',
        });
      } else {
        console.log('Profile loaded:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (authUserId: string) => {
    try {
      console.log('Creating profile for user:', authUserId);
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            auth_user_id: authUserId,
            location: 'Chennai',
            preferences: {},
            stats: {
              places_visited: 0,
              places_saved: 0,
              reviews_written: 0,
            },
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        toast({
          title: 'Profile Creation Failed',
          description: 'Could not create your profile. Please try again.',
          variant: 'destructive',
        });
      } else {
        console.log('Profile created:', data);
        setProfile(data);
        toast({
          title: 'Welcome to Blitz!',
          description: 'Your profile has been created successfully.',
        });
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('Signing up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data.user) {
        console.log('Sign up successful:', data.user.email);
        toast({
          title: 'Welcome to Blitz!',
          description: 'Your account has been created successfully.',
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: 'Sign In Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Sign in successful');
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in successfully.',
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        setUser(null);
        setProfile(null);
        setSession(null);
        toast({
          title: 'Signed out',
          description: 'You have been signed out successfully.',
        });
      }
    } catch (error) {
      console.error('Sign out exception:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return { error: new Error('No profile found') };

    try {
      console.log('Updating profile:', updates);
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        toast({
          title: 'Update Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data) {
        console.log('Profile updated:', data);
        setProfile(data);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully.',
        });
      }

      return { error };
    } catch (error) {
      console.error('Profile update exception:', error);
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
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