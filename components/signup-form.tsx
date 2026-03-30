'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {useActionState} from "react";
import {signupAction, SignupState} from "@/app/signup/actions";
import {ErrorMessage} from "@/components/errorMessage";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction] = useActionState<SignupState | null, FormData>(signupAction,null)

  return (
    <form action={formAction} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Создать новый аккаунт</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Имя пользователя(username)</FieldLabel>
          <Input
            id="name"
            name="username"
            type="text"
            placeholder="Иван Иванов"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Почта</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@example.com"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Пароль</FieldLabel>
          <Input
            id="password"
            type="password"
            name="password"
            required
            className="bg-background"
          />
          <FieldDescription>Пароль должен быть 8 символов, с латинской буквой и одним из !@#$%^&*()</FieldDescription>
          <FieldDescription>
            {
                state?.error && <ErrorMessage message={state.error}></ErrorMessage>
            }
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Создать</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Уже есть аккаунт? <a href="/login">Войти</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
