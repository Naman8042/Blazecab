import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/userModels";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  avatar?: string;
  name?: string;
}

export const option: NextAuthOptions = {
  providers: [
    // ==========================
    // EMAIL + PASSWORD LOGIN
    // ==========================
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

        const { email, password } = credentials;
        const user = await User.findOne({ email });

        if (!user) return null;

        if (!user.password) {
          throw new Error("You signed up using Google. Please login with Google.");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          isAdmin: user.isAdmin,
          avatar: user.avatar || null,
          name: user.name || null,
        };
      },
    }),

    // ==========================
    // GOOGLE LOGIN
    // ==========================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        }
      }
    }),
  ],

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {

      // ==========================
      // GOOGLE LOGIN
      // ==========================
      if (account?.provider === "google") {

        let dbUser = await User.findOne({ email: token.email });

        if (!dbUser) {
          dbUser = await User.create({
            email: token.email,
            password: null,
            name: token.name || null,
            avatar: token.picture || null,
            authProvider: "google",
            isAdmin: false
          });
        }

        token.id = dbUser._id.toString();
        token.email = dbUser.email;
        token.isAdmin = dbUser.isAdmin;
        token.authProvider = "google";
        token.avatar = dbUser.avatar;
        token.name = dbUser.name;

        return token;  // <<<<< CRITICAL FIX
      }

      // ==========================
      // NORMAL LOGIN (credentials)
      // ==========================
      if (user && !account?.provider) {
        const authUser = user as AuthUser;
        token.id = authUser.id;
        token.email = authUser.email;
        token.isAdmin = authUser.isAdmin;
        token.authProvider = "credentials";
        token.avatar = authUser.avatar;
        token.name = authUser.name;
      }

      return token;
    },

    // ==========================
    // STORE DATA IN SESSION
    // ==========================
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.authProvider = token.authProvider as string;
        session.user.avatar = token.avatar as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};
