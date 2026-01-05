export interface AuthSession {
  user: {
    accessToken: string;
    authCenter: {
      accessToken: string;
      expiresIn: string;
      refreshExpiresIn: number;
      refreshToken: string;
    };
  };
}

export interface AuthContextType {
  user: AuthSession["user"] | null;
  loading: boolean;
  login: (phoneNumber: string, otp: string, otpToken: string) => Promise<void>;
  logout: () => Promise<void>;
  getSession: () => Promise<void>;
}
