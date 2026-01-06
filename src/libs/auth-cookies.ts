import Cookies from "js-cookie";

const SESSION_COOKIE_NAME = "auth-session";

export interface SessionData {
  accessToken: string;
  authCenter: {
    accessToken: string;
    expiresIn: string;
    refreshExpiresIn: number;
    refreshToken: string;
  };
}

// Client-side cookie operations
export const setSessionCookie = (data: SessionData) => {
  Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(data), {
    expires: 7, // 7 days
    path: "/",
    sameSite: "lax",
  });
};

export const getSessionCookie = (): SessionData | null => {
  const cookie = Cookies.get(SESSION_COOKIE_NAME);
  if (!cookie) return null;

  try {
    return JSON.parse(cookie);
  } catch {
    return null;
  }
};

export const removeSessionCookie = () => {
  Cookies.remove(SESSION_COOKIE_NAME, { path: "/" });
};

// Server-side cookie operations (for API routes and middleware)
export const getSessionFromCookieString = (
  cookieString: string
): SessionData | null => {
  const cookies = cookieString.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const sessionCookie = cookies[SESSION_COOKIE_NAME];
  if (!sessionCookie) return null;

  try {
    return JSON.parse(decodeURIComponent(sessionCookie));
  } catch {
    return null;
  }
};

export const createSessionCookieString = (data: SessionData): string => {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(data)
  )}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`;
};

export const createDeleteCookieString = (): string => {
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0`;
};
