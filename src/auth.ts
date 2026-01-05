import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { loginWithPhoneOtp } from './api/auth.api';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const response = await loginWithPhoneOtp({
            phoneNumber: credentials.phoneNumber as string,
            otp: credentials.otp as string,
            otpToken: credentials.otpToken as string,
            countryCode: "66",
          });

          if (response.data) {
            // Return user object with tokens
            return {
              id: response.data.accessToken.substring(0, 20), // Use part of token as ID
              accessToken: response.data.accessToken,
              authCenter: response.data.authCenter,
            };
          }
          
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.authCenter = user.authCenter;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken as string;
        session.user.authCenter = token.authCenter as any;
      }
      return session;
    },
  },
});
