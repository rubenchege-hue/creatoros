import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.YOUTUBE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      // Refresh token if expired (with 60s buffer)
      if (token.expiresAt && Date.now() > (token.expiresAt as number) * 1000 - 60000) {
        try {
          const refreshed = await refreshAccessToken(token.refreshToken as string);
          token.accessToken = refreshed.access_token;
          token.expiresAt = Math.floor(Date.now() / 1000) + refreshed.expires_in;
        } catch (error) {
          console.error("Token refresh failed");
          delete token.accessToken;
          delete token.refreshToken;
          delete token.expiresAt;
          token.error = "RefreshAccessTokenError";
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Keep access token in token (server-side), don't expose to client
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/dashboard/connect",
  },
});

// Helper to get access token from session (server-side only)
export async function getAccessToken() {
  const session = await auth();
  return (session as any)?.token?.accessToken as string | undefined;
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.YOUTUBE_CLIENT_ID!,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error_description || data.error || "Token refresh failed");
  }

  return data;
}
