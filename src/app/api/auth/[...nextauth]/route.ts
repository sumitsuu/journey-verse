import { loginUserAction } from "@/src/lib/actions/auth/login-user";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    displayName: string;
    path: string;
    image?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    path: string;
    displayName: string;
    email: string;
    image?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const result = await loginUserAction({
            email: credentials.username,
            password: credentials.password,
          });

          if (result.success) {
            return {
              id: String(result.data.id),
              email: result.data.email,
              displayName: result.data.displayName,
              path: `/users/${result.data.id}`,
              image: result.data.avatarPath || undefined,
            };
          }
          return null;
        } catch {
          throw new Error("Error");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const customUser = user;

      if (user) {
        token.id = customUser.id;
        token.path = customUser.path;
        token.displayName = customUser.displayName;
        token.email = customUser.email;
        token.image = customUser.image;
      }
      return token;
    },
    async session({ session, token }) {
      const customToken = token;
      const customSession = session;

      customSession.user = {
        id: customToken.id,
        image: customToken.image,
        displayName: customToken.displayName,
        email: customToken.email,
        path: customToken.path,
      };
      return customSession;
    },
  },
});

export { handler as GET, handler as POST };
