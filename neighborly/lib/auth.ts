import { type AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          neighborhoodId: user.neighborhoodId,
        };
      },
    }),
  ],

  session: { strategy: "jwt" }, 

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = user.id;
        (token as any).neighborhoodId = user.neighborhoodId;
      }
      return token;
    },

    async session({ session, token }) {
      (session.user as any).id = (token as any).id;
      (session.user as any).neighborhoodId = (token as any).neighborhoodId;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
