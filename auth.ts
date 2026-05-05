import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        identifier: {
            label: 'Логин или пароль',
            type: 'text'
        },
        password: {
          label: "Пароль",
          type: "password",
        },
      },
      async authorize(credentials) {
          const identifier = credentials?.identifier as string;
          const password = credentials?.password as string;

          if (!identifier || !password) return null;

          const user = await prisma.user.findFirst({
              where: {
                  OR: [
                      { username: identifier },
                      { email: identifier }
                  ]
              }
          });

          if (!user || !user.passwordHash) return null;

          const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
          if (!isValid) return null;

          return {
              id: user.id.toString(),
              name: user.username,
          };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userRole = await prisma.userTeam.findFirst({
          where: { userId: parseInt(user.id) },
        });
        token.role = userRole?.role || "member";
        token.id = user.id;
        //token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        //session.user.email = token.email as string;
        session.user.username = token.name;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});
