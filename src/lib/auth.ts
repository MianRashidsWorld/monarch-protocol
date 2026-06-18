import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const usernameMatch = credentials.username === env.ADMIN_USERNAME;
        const hash = Buffer.from(env.ADMIN_PASSWORD_HASH_B64, "base64").toString("utf8");
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          hash
        );

        if (!usernameMatch || !passwordMatch) return null;

        return { id: "1", name: env.ADMIN_USERNAME };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
});
