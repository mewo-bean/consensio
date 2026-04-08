'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function TelegramSubscribe() {
    const [isLinked, setIsLinked] = useState(false);
    const [loading, setLoading] = useState(true);

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
            console.error(err);
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Привязать Telegram</span>
            <Switch checked={isLinked} onCheckedChange={(checked) => (checked ? link() : unlink())} />
        </div>
    );
}