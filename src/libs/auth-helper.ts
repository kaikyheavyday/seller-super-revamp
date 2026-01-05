// Helper to get auth token from NextAuth session for server-side API calls
import { auth } from '@/auth';

export async function getAuthToken(): Promise<string | null> {
  const session = await auth();
  return session?.user?.accessToken || null;
}

// Helper to add auth header to axios config
export async function withAuthHeader(config: any = {}) {
  const token = await getAuthToken();
  
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  
  return config;
}
