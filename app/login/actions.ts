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
    const username = String(formData.get('username')).trim();
    const password = String(formData.get('password')).trim()

    if (!username || !password) {
        return {error: 'Все поля должны быть заполнены', fields: { username: username }}
    }

    try {
        console.log('username- ', username, password)
        await signIn('credentials', {
            username: username,
            password,
            redirectTo: "/"
        })

        redirect('/');
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') {
                return {error: 'Неверный username или пароль', fields: { username: username }}
            }

            return {error: 'Ошибка авторизации', fields: { username: username}}
        }

        throw error
    }
}