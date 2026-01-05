"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loginWithPhoneOtp } from "@/api/auth.api";
import { setSessionCookie, getSessionCookie, removeSessionCookie } from "@/libs/auth-cookies";
import type { AuthContextType, AuthSession } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getSession = useCallback(async () => {
    try {
      const sessionData = getSessionCookie();
      if (sessionData) {
        setUser(sessionData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to get session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSession();
  }, [getSession]);

  const login = async (phoneNumber: string, otp: string, otpToken: string) => {
    try {
      const response = await loginWithPhoneOtp({
        phoneNumber,
        otp,
        otpToken,
        countryCode: "66",
      });

      if (response.data) {
        const sessionData = {
          accessToken: response.data.accessToken,
          authCenter: response.data.authCenter,
        };
        
        setSessionCookie(sessionData);
        setUser(sessionData);
        
        // Call the API route to set HTTP-only cookie
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sessionData),
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      removeSessionCookie();
      setUser(null);
      
      // Call the API route to clear HTTP-only cookie
      await fetch("/api/auth/logout", { method: "POST" });
      
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
