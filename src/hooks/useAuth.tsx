"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getUserProfileByPhone, loginWithPhoneOtp } from "@/api/auth.api";
import { useUserStore } from "@/store/user.store";
import {
  setSessionCookie,
  getSessionCookie,
  removeSessionCookie,
} from "@/libs/auth-cookies";
import type { AuthContextType, AuthSession } from "@/types/auth.types";
import { RouteEnum } from "@/app/constants/enum/route.enum";
import Cookies from "js-cookie";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userSession, setUserSession] = useState<AuthSession["user"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setUser: setStoreUser, setOrganization, clearStore } = useUserStore();

  const getSession = useCallback(async () => {
    try {
      const sessionData = getSessionCookie();
      if (sessionData) {
        setUserSession(sessionData);
      } else {
        setUserSession(null);
      }
    } catch (error) {
      console.error("Failed to get session:", error);
      setUserSession(null);
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
        try {
          const responseProfile = await getUserProfileByPhone({
            phoneNumber,
            countryCode: "66",
          });

          // Set user profile data
          if (responseProfile.data) {
            setStoreUser(responseProfile.data);
          }

          const sessionData = {
            accessToken: response.data.accessToken,
            authCenter: response.data.authCenter,
          };

          Cookies.set("accessToken", response.data.authCenter.accessToken);
          // Cookies.set("refreshToken", response.data.authCenter.refreshToken);
          setUserSession(sessionData);
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sessionData),
          });
          // Cookies.set("auth", JSON.stringify(response.data));
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      removeSessionCookie();
      Cookies.remove("accessToken");
      setUserSession(null);
      clearStore();

      // Call the API route to clear HTTP-only cookie
      await fetch("/api/auth/logout", { method: "POST" });

      router.push(RouteEnum.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ userSession, loading, login, logout, getSession }}
    >
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
