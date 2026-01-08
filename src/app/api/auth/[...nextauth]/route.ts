import { loginUserAction } from "@/src/lib/actions/auth/login-user.action";
import NextAuth, { User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: number;
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
    id: number;
    path: string;
    displayName: string;
    email: string;
    image?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const result = await loginUserAction({
            email: credentials.username,
            password: credentials.password,
          });

          return {
            id: result.id,
            email: result.email,
            displayName: result.displayName,
            path: `/users/${result.id}`,
            image: result.avatarPath ?? undefined,
          };
        } catch {
          throw new Error("Error");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const customUser = user;

      if (user) {
        token.id = Number(customUser.id);
        token.path = customUser.path;
        token.displayName = customUser.displayName;
        token.email = customUser.email;
        token.image = customUser.image;
      }

      if (trigger === "update" && session?.user) {
        token.displayName = session.user.displayName;
        token.email = session.user.email;
        token.image = session.user.image;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
