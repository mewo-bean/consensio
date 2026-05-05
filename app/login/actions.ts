'use server'

import {redirect} from "next/navigation"
import {signIn} from "@/auth"
import {AuthError} from "next-auth"

export type LoginState = {
    error?: string
    fields?: {
        username?: string;
        email?: string;
    }
}

export async function loginAction(
    _prevState: LoginState | null,
    formData: FormData
): Promise<LoginState> {
    const identifier = String(formData.get('identifier')).trim();
    const password = String(formData.get('password')).trim()

    if (!identifier || !password) {
        return {error: 'Все поля должны быть заполнены', fields: { username: identifier }}
    }

    try {
        console.log('username- ', identifier, password)
        await signIn('credentials', {
            identifier,
            password,
            redirectTo: "/"
        })

        redirect('/');
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') {
                return {error: 'Неверный username/почта или пароль', fields: { username: identifier }}
            }

            return {error: 'Ошибка авторизации', fields: { username: identifier}}
        }

        throw error
    }
}