"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const MIN_PAS_LEN = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_LETTER = /[a-zA-Z]/;
const HAS_CHAR = /[!@#$%^&*()]/;

export type SignupState = {
  error?: string;
  fields?: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
};

export async function signupAction(
  _prevState: SignupState | null,
  formData: FormData,
): Promise<SignupState> {
  const firstName = formData.get("firstName") as string | undefined;
  const lastName = formData.get("lastName") as string | undefined;
  const username = formData.get("username") as string | undefined;
  const email = formData.get("email") as string | undefined;
  const password = formData.get("password") as string | undefined;

  console.log("name", firstName, lastName, username, email, password);
  if (!firstName) {
    return {
      error: "Введите имя",
      fields: { username, email, firstName, lastName },
    };
  }

  if (!lastName) {
    return {
      error: "Введите фамилию",
      fields: { email, username, firstName, lastName },
    };
  }

  if (!username) {
    return {
      error: "Введите username",
      fields: { email, username, firstName, lastName },
    };
  }
  const existingUsername = await prisma.user.findUnique({
    where: { username: username },
  });

  if (existingUsername) {
    return {
      error: "Имя пользователя уже занято",
      fields: { email, username, firstName, lastName },
    };
  }

  if (!email) {
    return {
      error: "Введите email",
      fields: { email, username, firstName, lastName },
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      error: "Некорректный формат email",
      fields: { email, username, firstName, lastName },
    };
  }

  if (!password || password.length < MIN_PAS_LEN) {
    return {
      error: "Пароль должен быть 8 символов",
      fields: { email, username, firstName, lastName },
    };
  }

  if (!HAS_LETTER.test(password)) {
    return {
      error: "В пароле должны быть латинские буквы",
      fields: { email, username, firstName, lastName },
    };
  }

  if (!HAS_CHAR.test(password)) {
    return {
      error: "В пароле должен быть один из символов !@#$%^&*()",
      fields: { email, username, firstName, lastName },
    };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return {
      error: "Email уже занят",
      fields: { email, username, firstName, lastName },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email,
      username: username,
      passwordHash: hashedPassword,
    },
  });

  redirect("/login");
}
