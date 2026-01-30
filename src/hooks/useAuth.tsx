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
import { Cookie } from "next/font/google";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setUser: setStoreUser, setMerchant, clearStore } = useUserStore();

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
        try {
          const decodedToken = jwtDecode<{
            userId: number;
            userUuid: string;
            sub: string;
            phoneNumber: string;
            merchantId: number;
            merchantUuid: string;
            merchantSlug: string;
            lastAccessedAt: string;
            iat: number;
          }>(response.data.accessToken);

          const responseProfile = await getUserProfileByPhone({
            phoneNumber,
            countryCode: "66",
          });

          // Set merchant data from decoded token
          setMerchant({
            merchantId: decodedToken.merchantId,
            merchantUuid: decodedToken.merchantUuid,
            merchantSlug: decodedToken.merchantSlug,
          });

          // Set user profile data
          if (responseProfile.data) {
            setStoreUser(responseProfile.data);
          }

          const sessionData = {
            accessToken: response.data.accessToken,
            authCenter: response.data.authCenter,
          };
          // setSessionCookie(sessionData);
          // console.log(response)
          Cookies.set("accessToken", response.data.authCenter.accessToken);
          // Cookies.set("refreshToken", response.data.authCenter.refreshToken);
          setUser(sessionData);
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
      setUser(null);
      clearStore();

      // Call the API route to clear HTTP-only cookie
      await fetch("/api/auth/logout", { method: "POST" });

      router.push(RouteEnum.LOGIN);
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
