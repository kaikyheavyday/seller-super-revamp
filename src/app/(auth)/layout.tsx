"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { RouteEnum } from "../constants/enum/route.enum";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/auth.api";
import { useUserStore } from "@/store/user.store";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userSession, loading } = useAuth();
  const { user, organization } = useUserStore();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !userSession) {
      router.push(RouteEnum.LOGIN);
    }
  }, [loading, userSession, router]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!userSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <Navbar isCollapsed={isCollapsed} />
      <main
        className="pt-16 transition-[margin-left] duration-200"
        style={{
          marginLeft: isCollapsed ? 80 : 290,
        }}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
