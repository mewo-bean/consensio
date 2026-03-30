import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string,
            email?: string | null,
            username?: string | null
        } & DefaultSession
    }

    interface User extends DefaultUser {
        id: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
    }
}