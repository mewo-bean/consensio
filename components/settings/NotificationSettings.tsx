'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import WebPushSubscribe from './WebPushSubscribe';
import TelegramSubscribe from './TelegramSubscribe';

export default function NotificationSettings() {
    async function sendInstantPush() {
        try {
            const res = await fetch('/api/test/send-notification');
            if (res.ok) {
                toast.success('Мгновенное уведомление отправлено');
            } else {
                const data = await res.json();
                toast.error(`Ошибка: ${data.error || 'неизвестная'}`);
            }
        } catch (err) {
            toast.error('Не удалось отправить уведомление');
        }
    }

    async function sendDelayedPush() {
        try {
            const res = await fetch('/api/test/send-delayed');
            if (res.ok) {
                toast.info('Уведомление будет отправлено через 5 секунд. Закройте вкладку и ждите.');
            } else {
                const data = await res.json();
                toast.error(`Ошибка: ${data.error || 'неизвестная'}`);
            }
        } catch (err) {
            toast.error('Не удалось запланировать уведомление');
        }
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Веб-уведомления</CardTitle>
                    <CardDescription>
                        Получать уведомления в браузере, даже когда сайт закрыт
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <WebPushSubscribe />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Telegram</CardTitle>
                    <CardDescription>
                        Привязать аккаунт Telegram для получения уведомлений
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TelegramSubscribe />
                </CardContent>
            </Card>

            {/* Временная карточка для тестирования */}
            <Card>
                <CardHeader>
                    <CardTitle>Тестирование (временно)</CardTitle>
                    <CardDescription>Проверка работы веб-уведомлений</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button onClick={sendInstantPush} className="w-full">
                        📨 Отправить мгновенное уведомление
                    </Button>
                    <Button onClick={sendDelayedPush} variant="outline" className="w-full">
                        ⏰ Отправить через 5 секунд (закройте вкладку)
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}