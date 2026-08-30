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

export const PROTECTED_ROUTES = [
  '/command-center',
  '/food-map',
  '/markets',
  '/risk-analysis',
  '/recovery',
  '/ai-analyst',
  '/city-action'
];

/**
 * Safely validates redirect target string to ensure it is an internal relative path.
 * Prevents open redirect security vulnerabilities (e.g., //evil.com or https://evil.com).
 */
export function sanitizeRedirectUrl(target: string | null): string | null {
  if (!target) return null;
  const decoded = decodeURIComponent(target).trim();
  // Must start with '/' and NOT with '//' or '\' or contain scheme protocol (e.g. 'http:')
  if (decoded.startsWith('/') && !decoded.startsWith('//') && !decoded.startsWith('/\\')) {
    try {
      const parsed = new URL(decoded, 'http://localhost');
      if (parsed.origin === 'http://localhost') {
        return parsed.pathname + parsed.search + parsed.hash;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      try {
        const profile = await fetchAuthUser();
        setUser(profile);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Protected and Auth route redirects
  useEffect(() => {
    if (loading) return;

    const isProtected = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
    const isAuthPage = pathname === '/auth';

    if (isProtected && !user) {
      const currentUrl = pathname;
      const safeTarget = sanitizeRedirectUrl(currentUrl) || '/command-center';
      router.replace(`/auth?redirect=${encodeURIComponent(safeTarget)}`);
    } else if (isAuthPage && user) {
      // If user is already authenticated and visits /auth
      const params = new URLSearchParams(window.location.search);
      const redirectParam = params.get('redirect');
      const safeDestination = sanitizeRedirectUrl(redirectParam) || '/command-center';
      router.replace(safeDestination);
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
