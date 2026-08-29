'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  UserProfile,
  fetchAuthUser,
  removeStoredToken,
  loginEmail,
  signupEmail,
  googleAuth,
  AuthTokenResponse
} from '@/lib/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  logout: () => {},
});

const PROTECTED_ROUTES = [
  '/command-center',
  '/food-map',
  '/markets',
  '/risk-analysis',
  '/recovery',
  '/ai-analyst',
  '/city-action'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      const profile = await fetchAuthUser();
      setUser(profile);
      setLoading(false);
    }
    loadUser();
  }, []);

  // Protected route redirect check
  useEffect(() => {
    if (!loading) {
      const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
      if (isProtected && !user) {
        router.push(`/auth?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [user, loading, pathname, router]);

  const handleLogin = async (email: string, password: string) => {
    const res = await loginEmail(email, password);
    if (res.data) {
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleSignup = async (email: string, password: string, name?: string) => {
    const res = await signupEmail(email, password, name);
    if (res.data) {
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleGoogleLogin = async (idToken: string) => {
    const res = await googleAuth(idToken);
    if (res.data) {
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const handleLogout = () => {
    removeStoredToken();
    setUser(null);
    router.push('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        signup: handleSignup,
        loginWithGoogle: handleGoogleLogin,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
