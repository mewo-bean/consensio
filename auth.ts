import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email'
                },
                password: {
                    label: 'Пароль',
                    type: 'password'
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || typeof credentials.email !== 'string') {
                    return null
                }

                if (!credentials?.password || typeof credentials.password !== 'string') {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user?.passwordHash) {
                    return null
                }

                const valid = await bcrypt.compare(credentials.password, user.passwordHash)

                if (!valid) {
                    return null
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.username
                }
            },
        })
    ],
    session: { strategy: 'jwt'},
    pages: {
        signIn: "/login"
    },
    callbacks: {
        jwt({ token, user}) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.email
            }

            return token
        },
        session({ session, token}) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.username = token.name
            }

            return session;
        }
    }
})