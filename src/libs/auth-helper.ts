// Helper to get auth token from session cookie for server-side API calls
import { cookies } from "next/headers";
import { getSessionFromCookieString } from "./auth-cookies";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const session = getSessionFromCookieString(cookieHeader);
  return session?.accessToken || null;
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

// Get full session from server-side
export async function getServerSession() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return getSessionFromCookieString(cookieHeader);
}
