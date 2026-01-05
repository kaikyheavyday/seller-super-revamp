'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Button from '@/components/Button';
import Typography from '@/components/Typography';

interface AuthData {
  accessToken: string;
  authCenter: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load auth data from cookies
    const authCookie = Cookies.get('auth');
    if (authCookie) {
      try {
        const parsedAuth = JSON.parse(authCookie);
        setAuthData(parsedAuth);
      } catch (error) {
        console.error('Failed to parse auth cookie:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    setIsLoading(true);
    
    // Clear all authentication cookies
    Cookies.remove('auth');
    Cookies.remove('accessToken');
    
    // Redirect to login
    router.push('/login');
  };

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
        {authData && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <Typography variant="h3" className="mb-4">
              User Information
            </Typography>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Typography variant="paragraph-medium" className="font-semibold min-w-[180px]">
                  Access Token:
                </Typography>
                <Typography variant="paragraph-small" className="font-mono text-gray-600 break-all">
                  {authData.accessToken.substring(0, 40)}...
                </Typography>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Typography variant="paragraph-medium" className="font-semibold min-w-[180px]">
                  Auth Center Token:
                </Typography>
                <Typography variant="paragraph-small" className="font-mono text-gray-600 break-all">
                  {authData.authCenter.accessToken.substring(0, 40)}...
                </Typography>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Typography variant="paragraph-medium" className="font-semibold min-w-[180px]">
                  Expires In:
                </Typography>
                <Typography variant="paragraph-small" className="text-gray-600">
                  {authData.authCenter.expiresIn} seconds
                </Typography>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Typography variant="paragraph-medium" className="font-semibold min-w-[180px]">
                  Refresh Expires In:
                </Typography>
                <Typography variant="paragraph-small" className="text-gray-600">
                  {authData.authCenter.refreshExpiresIn} seconds
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <Typography variant="h3" className="mb-4">
            Session Management
          </Typography>
          <Button
            variant="solid"
            color="error"
            size="large"
            onClick={handleLogout}
            loading={isLoading}
            disabled={isLoading}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
