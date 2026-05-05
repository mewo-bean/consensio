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
import React, {useActionState} from "react";
import {signupAction, SignupState} from "@/app/signup/actions";
import {loginAction, LoginState} from "@/app/login/actions";
import {ErrorMessage} from "@/components/errorMessage";
import {Eye, EyeOff} from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction] = useActionState<LoginState | null, FormData>(loginAction,null)
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <form action={formAction} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Войти в аккаунт</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Username или почта (если регистрировались с ней)</FieldLabel>
          <Input
            id="username"
            type="username"
            name="identifier"
            placeholder="ivanchik/ivan@mail.ru"
            defaultValue={state?.fields?.email}
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Пароль</FieldLabel>
            {/*<a*/}
            {/*  href="/forgot"*/}
            {/*  className="ml-auto text-sm underline-offset-4 hover:underline"*/}
            {/*>*/}
            {/*  Забыли пароль?*/}
            {/*</a>*/}
          </div>
          <div className="relative">
            <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="bg-background pr-10"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none transition-colors"
                tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>
        <FieldDescription>
          {
              state?.error && <ErrorMessage message={state.error}></ErrorMessage>
          }
        </FieldDescription>
        <Field>
          <Button type="submit">Войти</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Нет аккаунта?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Зарегистрироваться
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
