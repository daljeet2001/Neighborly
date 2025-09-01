import NextAuth from 'next-auth';
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, neighborhoodId: user.neighborhoodId };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
     if (user) {
      token.id = user.id;
      token.neighborhoodId = user.neighborhoodId;
    }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      (session as any).user.id = token.id;
      (session.user as any).neighborhoodId = token.neighborhoodId;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };

