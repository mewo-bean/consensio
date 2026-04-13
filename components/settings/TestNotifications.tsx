'use client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TestNotifications() {
    async function sendInstantPush() {
        try {
            const res = await fetch('/api/test/send-notification');
            if (res.ok) toast.success('Мгновенное уведомление отправлено');
            else toast.error('Ошибка');
        } catch {
            toast.error('Не удалось отправить');
        }
    }

    async function sendDelayedPush() {
        try {
            const res = await fetch('/api/test/send-delayed');
            if (res.ok) toast.info('Уведомление придёт через 5 секунд');
            else toast.error('Ошибка');
        } catch {
            toast.error('Не удалось запланировать');
        }
    }

    return (
        <div className="space-y-2">
            <Button onClick={sendInstantPush} className="w-full">
                📨 Мгновенное уведомление
            </Button>
            <Button onClick={sendDelayedPush} variant="outline" className="w-full">
                ⏰ Через 5 секунд (закройте вкладку)
            </Button>
        </div>
    );
}