import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken: string;
    authCenter: {
      accessToken: string;
      expiresIn: string;
      refreshExpiresIn: number;
      refreshToken: string;
    };
  }

  interface Session {
    user: {
      accessToken: string;
      authCenter: {
        accessToken: string;
        expiresIn: string;
        refreshExpiresIn: number;
        refreshToken: string;
      };
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    authCenter?: {
      accessToken: string;
      expiresIn: string;
      refreshExpiresIn: number;
      refreshToken: string;
    };
  }
}
