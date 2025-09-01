import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      neighborhoodId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    neighborhoodId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    neighborhoodId?: string | null;
  }
}
