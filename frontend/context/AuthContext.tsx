import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  photos: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: User = {
  id: '1',
  name: 'Dave C. Brown',
  username: '@dave_brown',
  email: 'dave@example.com',
  avatar: 'https://i.pravatar.cc/150?img=49',
  bio: 'Google Certified Ux/Ui Designer',
  followers: 10000,
  following: 64,
  posts: 100,
  photos: 120,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const [userData, onboarded] = await Promise.all([
        AsyncStorage.getItem('sm_user'),
        AsyncStorage.getItem('sm_onboarded'),
      ]);
      if (userData) setUser(JSON.parse(userData));
      if (onboarded === 'true') setIsOnboarded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(_email: string, _password: string) {
    await AsyncStorage.setItem('sm_user', JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  }

  async function signUp(name: string, email: string, _password: string) {
    const newUser: User = { ...MOCK_USER, name, email };
    await AsyncStorage.setItem('sm_user', JSON.stringify(newUser));
    setUser(newUser);
  }

  async function signOut() {
    await AsyncStorage.removeItem('sm_user');
    setUser(null);
  }

  async function completeOnboarding() {
    await AsyncStorage.setItem('sm_onboarded', 'true');
    setIsOnboarded(true);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isOnboarded, signIn, signUp, signOut, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
