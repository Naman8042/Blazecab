import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/userModels";
import bcrypt from "bcryptjs";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const option: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials as { email: string; password: string };

        const user = await User.findOne({ email });

        if (!user) {
          return null;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = user.isAdmin; // ✅ store isAdmin in JWT
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean; // ✅ expose to session
      }
      return session;
    },
  },
};
