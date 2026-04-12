"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WebPushSubscribe from "./WebPushSubscribe";
import TelegramSubscribe from "./TelegramSubscribe";
import DevicesList from "@/components/settings/DevicesList";

export default function NotificationSettings() {
    async function sendInstantPush() {
        try {
            const res = await fetch("/api/test/send-notification");
            if (res.ok) {
                toast.success("Мгновенное уведомление отправлено");
            } else {
                const data = await res.json();
                toast.error(`Ошибка: ${data.error || "неизвестная"}`);
            }
        } catch (err) {
            toast.error("Не удалось отправить уведомление");
        }
    }

    async function sendDelayedPush() {
        try {
            const res = await fetch("/api/test/send-delayed");
            if (res.ok) {
                toast.info(
                    "Уведомление будет отправлено через 5 секунд. Закройте вкладку и ждите.",
                );
            } else {
                const data = await res.json();
                toast.error(`Ошибка: ${data.error || "неизвестная"}`);
            }
        } catch (err) {
            toast.error("Не удалось запланировать уведомление");
        }
    }

    return (
        <div className="space-y-3">
            <Card className="shadow-sm border-muted/60">
                <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-1.5">
                    <CardTitle className="text-base">Веб-уведомления</CardTitle>
                    <CardDescription className="text-xs leading-tight mt-0.5">
                        Получать уведомления в браузере, даже когда сайт закрыт
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                    <WebPushSubscribe/>
                </CardContent>

                <CardHeader>
                    <CardTitle>Управление устройствами</CardTitle>
                    <CardDescription>
                        Устройства, на которых вы подписаны на уведомления
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DevicesList/>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-muted/60">
                <CardHeader className="p-3 sm:p-4 pb-1.5 sm:pb-1.5">
                    <CardTitle className="text-base">Telegram</CardTitle>
                    <CardDescription className="text-xs leading-tight mt-0.5">
                        Привязать аккаунт Telegram для получения уведомлений
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                    <TelegramSubscribe/>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-muted/60 bg-muted/20">
                <CardHeader className="p-3 sm:p-4 pb-2">
                    <CardTitle className="text-base">Тестирование</CardTitle>
                    <CardDescription className="text-xs leading-tight mt-0.5">
                        Проверка работы уведомлений
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
                    <Button
                        onClick={sendInstantPush}
                        className="w-full h-auto py-2 px-3 whitespace-normal text-left flex gap-2.5 justify-start"
                    >
                        <span className="text-base leading-none shrink-0">📨</span>
                        <span className="text-sm leading-snug">Мгновенное уведомление</span>
                    </Button>

                    <Button
                        onClick={sendDelayedPush}
                        variant="outline"
                        className="w-full h-auto py-2 px-3 whitespace-normal text-left flex gap-2.5 justify-start"
                    >
                        <span className="text-base leading-none shrink-0">⏰</span>
                        <span className="text-sm leading-snug">
              Через 5 сек (закройте вкладку)
            </span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
