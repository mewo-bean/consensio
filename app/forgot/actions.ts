'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export type ResetState = {
    error?: string;
    success?: string;
}

const MIN_PAS_LEN = 8;
const HAS_LETTER = /[a-zA-Z]/;
const HAS_CHAR = /[!@#$%^&*()]/;

export async function forgotAction(
    prevState: ResetState | null,
    formData: FormData
): Promise<ResetState> {
    const email = formData.get('email') as string;
    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = formData.get('password') as string;

    if (!email || !oldPassword || !newPassword) {
        return { error: "Заполните все поля" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { error: "Пользователь не найден" };
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);

        if (!isOldPasswordValid) {
            return { error: "Старый пароль неправильный" };
        }

        if (oldPassword === newPassword) {
            return { error: "Новый пароль не должен совпадать со старым" };
        }

        if (newPassword.length < MIN_PAS_LEN) {
            return { error: `Новый пароль должен быть не менее ${MIN_PAS_LEN} символов` };
        }

        if (!HAS_LETTER.test(newPassword)) {
            return { error: 'В новом пароле должны быть латинские буквы'}
        }

        if (!HAS_CHAR.test(newPassword)) {
            return { error: 'В новом пароле должен быть один из символов !@#$%^&*()'}
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password_hash: hashedPassword }
        });

        return { success: "Пароль успешно изменен!" };

    } catch (e) {
        return { error: "Ошибка при смене пароля!!!" };
    }
}