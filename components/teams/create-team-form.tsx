"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { ErrorMessage } from "@/components/errorMessage";
import { createTeam, TeamState } from "@/app/actions/team";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

export function CreateTeamForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction, isPending] = useActionState<TeamState, FormData>(
    createTeam,
    null,
  );

  return (
    <Card className="flex flex-col h-full shadow-sm border-muted/60">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="size-5 text-primary" />
          Создать команду
        </CardTitle>
        <CardDescription className="min-h-[80px] text-balance">
          Вы автоматически станете её администратором и сможете приглашать
          коллег.
        </CardDescription>
      </CardHeader>

      <form
        action={formAction}
        className={cn("flex flex-col flex-1", className)}
        {...props}
      >
        <CardContent className="pb-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Название команды</FieldLabel>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Например: Frontend Разработчики"
                required
                className="bg-muted/40 focus-visible:bg-transparent transition-colors"
              />
            </Field>

            <FieldDescription>
              {state?.error && <ErrorMessage message={state.error} />}
              {state?.success && (
                <span className="text-green-600 dark:text-green-500 font-medium text-sm">
                  Команда успешно создана!
                </span>
              )}
            </FieldDescription>
          </FieldGroup>
        </CardContent>

        <CardFooter className="pt-2 mt-auto">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Создание..." : "Создать команду"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
