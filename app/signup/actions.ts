"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {signIn} from "@/auth";

const MIN_PAS_LEN = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_UP_LETTER = /[A-Z]/;
const  HAS_DOWN_LETTER = /[a-z]/;
const HAS_NUMBER = /[0-9]/;

export type SignupState = {
  error?: string;
  fields?: {
    username?: string;
    //email?: string;
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
  //const email = formData.get("email") as string | undefined;
  const password = formData.get("password") as string | undefined;


  console.log("name", firstName, lastName, username, password);
  if (!firstName) {
    return {
      error: "Введите имя",
      fields: { username, firstName, lastName },
    };
  }

  if (!lastName) {
    return {
      error: "Введите фамилию",
      fields: {username, firstName, lastName },
    };
  }

  if (!username) {
    return {
      error: "Введите username",
      fields: { username, firstName, lastName },
    };
  }
  const existingUsername = await prisma.user.findUnique({
    where: { username: username },
  });

  if (existingUsername) {
    return {
      error: "Имя пользователя уже занято",
      fields: { username, firstName, lastName },
    };
  }

  // if (!email) {
  //   return {
  //     error: "Введите email",
  //     fields: { email, username, firstName, lastName },
  //   };
  // }
  //
  // if (!EMAIL_REGEX.test(email)) {
  //   return {
  //     error: "Некорректный формат email",
  //     fields: { email, username, firstName, lastName },
  //   };
  // }
  if (!password) {
    return {
      error: "Введите пароль",
      fields: { username, firstName, lastName },
    }
  }

  if (!HAS_NUMBER.test(password) ) {
    return {
      error: "В пароле должна быть цифра",
      fields: { username, firstName, lastName },
    };
  }

  if (!password || password.length < MIN_PAS_LEN) {
    return {
      error: "Пароль должен быть 8 символов",
      fields: { username, firstName, lastName },
    };
  }

  if (!HAS_UP_LETTER.test(password)) {
    return {
      error: "В пароле должны быть заглавные латинские буквы",
      fields: { username, firstName, lastName },
    };
  }

  if (!HAS_DOWN_LETTER.test(password)) {
    return {
      error: "В пароле должны быть строчные латинские буквы",
      fields: { username, firstName, lastName },
    };
  }


  // const existing = await prisma.user.findUnique({
  //   where: { email },
  // });
  //
  // if (existing) {
  //   return {
  //     error: "Email уже занят",
  //     fields: { email, username, firstName, lastName },
  //   };
  // }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      username: username,
      passwordHash: hashedPassword,
    },
  });

  await signIn("credentials", {
    username,
    password,
    redirectTo: "/dashboard",
  });

  redirect("/dashboard");
}
