'use client'

import * as React from "react"
import {useActionState} from "react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {forgotAction, ResetState} from "@/app/forgot/actions"
import {ErrorMessage} from "@/components/errorMessage"
import {ArrowLeft, CheckCircle2, Eye, EyeOff} from "lucide-react"

export function ForgotForm({className, ...props}: React.ComponentProps<"form">) {
    const [state, formAction, isPending] = useActionState<ResetState | null, FormData>(forgotAction, null)
    const [showOld, setShowOld] = React.useState(false)
    const [showNew, setShowNew] = React.useState(false)

    if (state?.success) {
        return (
            <div
                className="flex flex-col items-center gap-4 text-center max-w-sm mx-auto p-8 bg-background rounded-xl border shadow-sm">
                <CheckCircle2 className="h-12 w-12 text-green-500"/>
                <h1 className="text-2xl font-bold">Успешно!</h1>
                <p className="text-sm text-muted-foreground">{state.success}</p>
                <Button className="w-full mt-2" asChild><a href="/login">Ко входу</a></Button>
            </div>
        )
    }

    return (
        <form action={formAction} className={cn("flex flex-col gap-6 w-full max-w-sm mx-auto", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center mb-2">
                    <h1 className="text-2xl font-bold">Смена пароля</h1>
                </div>

                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" name="email" placeholder="m@example.com" required
                           className="bg-background"
                           defaultValue={state?.fields?.email}/>
                </Field>

                <Field>
                    <FieldLabel htmlFor="oldPassword">Старый пароль</FieldLabel>
                    <div className="relative">
                        <Input
                            id="oldPassword"
                            type={showOld ? "text" : "password"}
                            name="oldPassword"
                            required
                            className="bg-background pr-10"
                        />
                        <button type="button" onClick={() => setShowOld(!showOld)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showOld ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                    </div>
                </Field>

                <Field>
                    <FieldLabel htmlFor="password">Новый пароль</FieldLabel>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showNew ? "text" : "password"}
                            name="password"
                            required
                            className="bg-background pr-10"
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showNew ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                    </div>
                    <FieldDescription>Пароль должен быть 8 символов, с латинской буквой и одним из
                        !@#$%^&*()</FieldDescription>
                </Field>

                <FieldDescription>
                    {
                        state?.error && <ErrorMessage message={state.error}></ErrorMessage>
                    }
                </FieldDescription>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Обработка..." : "Сменить пароль"}
                </Button>

                <div className="text-center">
                    <a href="/login"
                       className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4"/> Назад
                    </a>
                </div>
            </FieldGroup>
        </form>
    )
}