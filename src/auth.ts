import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        portalType: { label: "Portal", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;
        const portalType = credentials.portalType as string || 'student';

        try {
          let user;
          if (portalType === 'admin') {
            user = await (prisma as any).adminUser.findUnique({ where: { email } });
          } else if (portalType === 'company') {
            user = await (prisma as any).companyUser.findUnique({ where: { email } });
          } else {
            user = await (prisma as any).user.findUnique({ 
              where: { email },
              include: { studentProfile: true }
            });
          }

          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            portalType,
            profileImage: (user as any).studentProfile?.profileImage || null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.name = user.name;
        token.email = user.email;
        token.portalType = (user as any).portalType;
        token.profileImage = (user as any).profileImage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).portalType = token.portalType;
        (session.user as any).profileImage = token.profileImage;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
