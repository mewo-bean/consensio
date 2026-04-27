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
import React, {useActionState, useState, useMemo} from "react";
import {signupAction, SignupState} from "@/app/signup/actions";
import {ErrorMessage} from "@/components/errorMessage";
import {Check, Circle, Eye, EyeOff } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction, isPending] = useActionState<SignupState | null, FormData>(signupAction,null)
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = useState("")

  const checks = useMemo(() => ({
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }), [password])

  const Requirement = ({ met, text }: { met: boolean, text: string }) => (
      <div className={cn("flex items-center gap-2 text-xs transition-colors", met ? "text-primary" : "text-muted-foreground")}>
        {met ? <Check className="size-3" /> : <Circle className="size-3 opacity-50" />}
        <span>{text}</span>
      </div>
  )

  return (
    <form action={formAction} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Создать новый аккаунт</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="firstName">Имя</FieldLabel>
          <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Иван"
              defaultValue={state?.fields?.firstName}
              required
              className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Фамилия</FieldLabel>
          <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Иванов"
              defaultValue={state?.fields?.lastName}
              required
              className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="name">Username</FieldLabel>
          <Input
            id="name"
            name="username"
            type="text"
            placeholder="ivanchik"
            defaultValue={state?.fields?.username}
            required
            className="bg-background"
          />
        </Field>
        {/*<Field>*/}
        {/*  <FieldLabel htmlFor="email">Почта</FieldLabel>*/}
        {/*  <Input*/}
        {/*    id="email"*/}
        {/*    type="email"*/}
        {/*    name="email"*/}
        {/*    placeholder="m@example.com"*/}
        {/*    defaultValue={state?.fields?.email}*/}
        {/*    required*/}
        {/*    className="bg-background"*/}
        {/*  />*/}
        {/*</Field>*/}
        <Field>
          <FieldLabel htmlFor="password">Пароль</FieldLabel>
          <div className="relative">
            <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="bg-background pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          {/* БЛОК С ГАЛОЧКАМИ */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-lg">
            <Requirement met={checks.length} text="8+ символов" />
            <Requirement met={checks.hasNumber} text="Цифра" />
            <Requirement met={checks.hasUpper} text="Заглавная латинская буква" />
            <Requirement met={checks.hasLower} text="Строчная латинская буква" />
          </div>
          <FieldDescription>
            {
                state?.error && <ErrorMessage message={state.error}></ErrorMessage>
            }
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit"
                  disabled={isPending || !Object.values(checks).every(Boolean)}>Создать</Button>
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
