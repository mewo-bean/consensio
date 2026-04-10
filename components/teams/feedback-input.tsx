"use client";

import * as React from "react";
import { toast } from "sonner";
import { submitTeamFeedback } from "@/app/actions/feedback";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FeedbackInput({ teamId }: { teamId: number }) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  const submit = () => {
    if (!value.trim()) return;
    const content = value;
    startTransition(async () => {
      const res = await submitTeamFeedback(teamId, content);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      setValue("");
      toast.success("Отправлено");
      router.refresh();
    });
  };

  return (
    <div className="flex w-full gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (!isPending) submit();
          }
        }}
        placeholder="Обратная связь…"
        disabled={isPending}
        className="h-10"
      />
      <Button
        type="button"
        onClick={submit}
        disabled={isPending || !value.trim()}
        className="h-10"
      >
        Отправить
      </Button>
    </div>
  );
}
