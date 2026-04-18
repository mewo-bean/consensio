"use client";

import * as React from "react";
import { toast } from "sonner";
import { submitTeamFeedback } from "@/app/actions/feedback";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function FeedbackInput({ teamId }: { teamId: string }) {
    const router = useRouter();
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [value, setValue] = React.useState("");
    const [isPending, startTransition] = React.useTransition();

    const resizeTextarea = React.useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "0px";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, []);

    React.useEffect(() => {
        resizeTextarea();
    }, [resizeTextarea, value]);

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
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <p className="mb-3 text-sm text-muted-foreground">
                    Сообщение будет отправлено анонимно.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (!isPending) submit();
                            }
                        }}
                        placeholder="Обратная связь…"
                        disabled={isPending}
                        rows={1}
                        className="max-h-80 min-h-28 w-full resize-none rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button
                        type="button"
                        onClick={submit}
                        disabled={isPending || !value.trim()}
                        className="h-11 sm:w-auto"
                    >
                        Отправить
                    </Button>
                </div>
            </div>
        </div>
    );
}
