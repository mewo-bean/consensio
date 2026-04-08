'use server'

import {redirect} from "next/navigation";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";

const MIN_PAS_LEN = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_LETTER = /[a-zA-Z]/;
const HAS_CHAR = /[!@#$%^&*()]/;

export type SignupState = {error?: string}

export async function signupAction(
    _prevState: SignupState | null,
    formData: FormData
): Promise<SignupState> {
    const username = formData.get('username') as string | undefined;
    const email = formData.get('email') as string | undefined;
    const password = formData.get('password') as string | undefined;

    console.log('name', username, email, password)

    if (!username) {
        return {error: 'Введите username'};
    }
    const existingUsername = await prisma.user.findUnique({
        where: { username: username },
    });

    if (existingUsername) {
        return { error: 'Имя пользователя уже занято' };
    }

    if (!email) {
        return { error: "Введите email"}
    }

    if(!EMAIL_REGEX.test(email)) {
        return { error: 'Некорректный формат email' }
    }

    if(!password || password.length < MIN_PAS_LEN) {
        return { error: 'Пароль должен быть 8 символов'}
    }

    if (!HAS_LETTER.test(password)) {
        return { error: 'В пароле должны быть латинские буквы'}
    }

    if (!HAS_CHAR.test(password)) {
        return { error: 'В пароле должен быть один из символов !@#$%^&*()'}
    }

    const existing = await prisma.user.findUnique({
        where: { email}
    })

    if (existing) {
        return { error: 'Email уже занят'}
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            username: username,
            passwordHash: hashedPassword,
        }
    })

    redirect('/login')
}
