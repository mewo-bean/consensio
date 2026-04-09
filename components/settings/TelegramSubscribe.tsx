'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function TelegramSubscribe() {
    const [isLinked, setIsLinked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    async function fetchStatus() {
        try {
            const res = await fetch('/api/telegram/status');
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
            const res = await fetch('/api/telegram/link', { method: 'POST' });
            const data = await res.json();
            if (data.link) {
                window.open(data.link, '_blank');
                toast.info('Ссылка создана. Перейдите в Telegram для привязки.');
            } else {
                throw new Error('No link');
            }
        } catch (err) {
            toast.error('Не удалось создать ссылку для привязки');
        } finally {
            setLoading(false);
        }
    }

    async function unlink() {
        setLoading(true);
        try {
            const res = await fetch('/api/telegram/unlink', { method: 'DELETE' });
            if (res.ok) {
                setIsLinked(false);
                toast.success('Telegram отвязан');
            } else {
                throw new Error();
            }
        } catch (err) {
            toast.error('Не удалось отвязать Telegram');
        } finally {
            setLoading(false);
        }
    }

    async function sendTestMessage() {
        setSending(true);
        try {
            const res = await fetch('/api/test/send-telegram');
            if (res.ok) {
                toast.success('Тестовое сообщение отправлено в Telegram');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Ошибка отправки');
            }
        } catch (err) {
            toast.error('Не удалось отправить тестовое сообщение');
        } finally {
            setSending(false);
        }
    }

    if (loading) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Привязать Telegram</span>
                <Switch checked={isLinked} onCheckedChange={(checked) => (checked ? link() : unlink())} />
            </div>
            {isLinked && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={sendTestMessage}
                    disabled={sending}
                    className="w-full"
                >
                    {sending ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : '📨'}
                    Отправить тестовое сообщение
                </Button>
            )}
        </div>
    );
}