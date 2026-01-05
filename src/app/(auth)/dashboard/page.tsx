"use client";

import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button";
import Typography from "@/components/Typography";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <Typography variant="h1" className="mb-4">
            Welcome to Dashboard
          </Typography>
          <Typography variant="paragraph-medium" className="text-gray-600">
            You are now logged in and can access protected content.
          </Typography>
        </div>

        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <Typography variant="h3" className="mb-4">
            User Information
          </Typography>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Typography
                variant="paragraph-medium"
                className="font-semibold min-w-[180px]"
              >
                Access Token:
              </Typography>
              <Typography
                variant="paragraph-small"
                className="font-mono text-gray-600 break-all"
              >
                {user.accessToken.substring(0, 40)}...
              </Typography>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Typography
                variant="paragraph-medium"
                className="font-semibold min-w-[180px]"
              >
                Auth Center Token:
              </Typography>
              <Typography
                variant="paragraph-small"
                className="font-mono text-gray-600 break-all"
              >
                {user.authCenter.accessToken.substring(0, 40)}...
              </Typography>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Typography
                variant="paragraph-medium"
                className="font-semibold min-w-[180px]"
              >
                Expires In:
              </Typography>
              <Typography variant="paragraph-small" className="text-gray-600">
                {user.authCenter.expiresIn} seconds
              </Typography>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Typography
                variant="paragraph-medium"
                className="font-semibold min-w-[180px]"
              >
                Refresh Expires In:
              </Typography>
              <Typography variant="paragraph-small" className="text-gray-600">
                {user.authCenter.refreshExpiresIn} seconds
              </Typography>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <Typography variant="h3" className="mb-4">
            Actions
          </Typography>

          <Button onClick={logout} variant="outlined">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
