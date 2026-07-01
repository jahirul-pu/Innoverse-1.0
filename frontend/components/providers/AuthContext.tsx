"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api";

export interface User {
  id: string;
  phone: string;
  name?: string | null;
  email?: string | null;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
  createdAt?: string;
  addresses?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  sendOtp: (phone: string, name?: string, email?: string) => Promise<any>;
  verifyOtp: (phone: string, code: string) => Promise<any>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<any>;
  logout: () => Promise<any>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      setError(null);
      const data = await authApi.getMe();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setUser(null);
      // Don't show error for standard unauthorized check on mount
      if (err.status !== 401) {
        setError(err.message || "Failed to fetch user session");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const sendOtp = async (phone: string, name?: string, email?: string) => {
    try {
      setError(null);
      return await authApi.sendOtp(phone, name, email);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
      throw err;
    }
  };

  const verifyOtp = async (phone: string, code: string) => {
    try {
      setError(null);
      const data = await authApi.verifyOtp(phone, code);
      if (data && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
      throw err;
    }
  };

  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      setError(null);
      const res = await authApi.updateProfile(data);
      if (res && res.user) {
        setUser((prev) => (prev ? { ...prev, ...res.user } : null));
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authApi.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Failed to log out");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        sendOtp,
        verifyOtp,
        updateProfile,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
