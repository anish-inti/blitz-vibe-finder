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
    console.log('AuthProvider: Initializing auth state');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('AuthProvider: Error getting session:', error);
      } else {
        console.log('AuthProvider: Initial session:', session ? 'Found' : 'None');
      }
      
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
      console.log('AuthProvider: Auth state changed:', event, session ? 'Session exists' : 'No session');
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUserId: string) => {
    console.log('AuthProvider: Fetching user profile for:', authUserId);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log('AuthProvider: Profile not found, creating new profile');
        await createUserProfile(authUserId);
      } else if (error) {
        console.error('AuthProvider: Error fetching profile:', error);
        setLoading(false);
      } else {
        console.log('AuthProvider: Profile fetched successfully');
        setProfile(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('AuthProvider: Exception in fetchUserProfile:', error);
      setLoading(false);
    }
  };

  const createUserProfile = async (authUserId: string) => {
    console.log('AuthProvider: Creating user profile for:', authUserId);
    
    try {
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
        console.error('AuthProvider: Error creating profile:', error);
      } else {
        console.log('AuthProvider: Profile created successfully');
        setProfile(data);
      }
    } catch (error) {
      console.error('AuthProvider: Exception in createUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('AuthProvider: Signing up user:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (!error && data.user) {
      console.log('AuthProvider: Sign up successful');
      toast({
        title: 'Welcome to Blitz!',
        description: 'Your account has been created successfully.',
      });
    } else if (error) {
      console.error('AuthProvider: Sign up error:', error);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Signing in user:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      console.log('AuthProvider: Sign in successful');
      toast({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.',
      });
    } else {
      console.error('AuthProvider: Sign in error:', error);
    }

    return { error };
  };

  const signOut = async () => {
    console.log('AuthProvider: Signing out user');
    
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
      setSession(null);
      console.log('AuthProvider: Sign out successful');
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    } else {
      console.error('AuthProvider: Sign out error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) {
      console.error('AuthProvider: No profile found for update');
      return { error: new Error('No profile found') };
    }

    console.log('AuthProvider: Updating profile:', updates);

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single();

    if (!error && data) {
      console.log('AuthProvider: Profile updated successfully');
      setProfile(data);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } else if (error) {
      console.error('AuthProvider: Profile update error:', error);
    }

    return { error };
  };

  const refreshProfile = async () => {
    if (user) {
      console.log('AuthProvider: Refreshing profile');
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