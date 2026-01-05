"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data } = useSession();
  const router = useRouter();
  console.log("AuthLayout session data:", data);
  if (!data) {
    router.push("/login");
  }

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Middleware handles redirects, just render children
  return <>{children}</>;
}
