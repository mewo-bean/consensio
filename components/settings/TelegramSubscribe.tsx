"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function TelegramSubscribe() {
    const [isLinked, setIsLinked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchStatus();
        window.addEventListener("focus", fetchStatus);

        return () => {
            window.removeEventListener("focus", fetchStatus);
        };
    }, []);

    async function fetchStatus() {
        try {
            const res = await fetch("/api/telegram/status");
            const data = await res.json();
            setIsLinked(data.linked);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function link() {
        setLoading(true);
        try {
            const res = await fetch("/api/telegram/link", { method: "POST" });
            const data = await res.json();
            if (data.link) {
                window.open(data.link, "_blank");
                toast.info("Ссылка создана. Перейдите в Telegram для привязки");
            } else if (data.success) {
                toast.success("Telegram ID был найден и заново привязан");
                setIsLinked(true);
            } else {
                throw new Error("No link");
            }
        } catch (err) {
            toast.error("Не удалось создать ссылку для привязки");
        } finally {
            setLoading(false);
        }
    }

    async function unlink() {
        setLoading(true);
        try {
            const res = await fetch("/api/telegram/unlink", { method: "DELETE" });
            if (res.ok) {
                setIsLinked(false);
                toast.success("Telegram отвязан");
            } else {
                throw new Error();
            }
        } catch (err) {
            toast.error("Не удалось отвязать Telegram");
        } finally {
            setLoading(false);
        }
    }

    async function sendTestMessage() {
        setSending(true);
        try {
            const res = await fetch("/api/test/send-telegram");
            if (res.ok) {
                toast.success("Тестовое сообщение отправлено в Telegram");
            } else {
                const data = await res.json();
                toast.error(data.error || "Ошибка отправки");
            }
        } catch (err) {
            toast.error("Не удалось отправить тестовое сообщение");
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {!isLinked ? (
                <Button
                    onClick={link}
                    className="w-full h-auto py-2.5 font-bold flex items-center justify-center gap-2 bg-[#2AABEE] hover:bg-[#229ED9] text-white shadow-sm transition-all"
                >
                    <svg
                        className="size-4 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.96 1.25-5.54 3.67-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.36-.48 1-.74 3.93-1.71 6.55-2.84 7.86-3.38 3.74-1.54 4.51-1.81 5.02-1.82.11 0 .36.03.49.13.11.08.14.19.15.28.01.06.01.13 0 .19z"/>
                    </svg>
                    Привязать Telegram
                </Button>
            ) : (
                <div className="space-y-3">
                    <div
                        className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-900/50">
            <span className="text-sm font-semibold text-green-700 dark:text-green-500 flex items-center gap-2">
              <CheckCircle2 className="size-4"/>
              Привязан
            </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={unlink}
                            className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                            Отвязать
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        onClick={sendTestMessage}
                        disabled={sending}
                        className="w-full h-auto py-2 px-3 whitespace-normal text-left flex gap-2.5 justify-start"
                    >
            <span className="text-base leading-none shrink-0">
              {sending ? <Loader2 className="h-4 w-4 animate-spin"/> : "📨"}
            </span>
                        <span className="text-sm leading-snug">Тестовое сообщение</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
