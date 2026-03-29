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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Создать новый аккаунт</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Имя пользователя</FieldLabel>
          <Input
            id="name"
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
            required
            className="bg-background"
          />
          <FieldDescription>
            Должен быть минимум из 8 символов алфавита + цифра
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
