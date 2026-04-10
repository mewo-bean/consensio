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
    const email = String(formData.get('email')).trim();
    const password = String(formData.get('password')).trim()

    if (!email || !password) {
        return {error: 'Все поля должны быть заполнены', fields: { email }}
    }

    try {

        console.log('email, ', email, password)
        await signIn('credentials', {
            email,
            password,
            redirectTo: "/"
        })

        redirect('/');
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') {
                return {error: 'Неверный email или пароль', fields: { email }}
            }

            return {error: 'Ошибка авторизации', fields: { email}}
        }

        throw error
    }
}