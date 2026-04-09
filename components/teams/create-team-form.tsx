"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
      <CardHeader className="p-4 sm:p-6 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl leading-tight">
          <Users className="size-5 text-primary shrink-0" />
          Создать команду
        </CardTitle>
        <CardDescription className="text-balance text-sm leading-relaxed mt-1.5">
          Вы автоматически станете её администратором и сможете приглашать
          коллег.
        </CardDescription>
      </CardHeader>

      <form
        action={formAction}
        className={cn("flex flex-col flex-1", className)}
        {...props}
      >
        <CardContent className="p-4 sm:p-6 pt-0 pb-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title" className="text-sm font-medium">
                Название команды
              </FieldLabel>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Например: Frontend Разработчики"
                required
                className="bg-muted/40 focus-visible:bg-transparent transition-colors h-11 sm:h-10"
              />
            </Field>

            <div className="mt-2 min-h-5">
              {state?.error && <ErrorMessage message={state.error} />}
              {state?.success && (
                <div className="text-green-600 dark:text-green-500 font-medium text-sm text-balance">
                  Команда успешно создана!
                </div>
              )}
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="p-4 sm:p-6 pt-2 mt-auto">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full whitespace-normal h-auto py-2.5 sm:py-2 text-center text-balance"
          >
            {isPending ? "Создание..." : "Создать команду"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
