'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function WebPushSubscribe() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSubscriptionStatus();
    }, []);

    async function checkSubscriptionStatus() {
        try {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                setIsSubscribed(!!subscription);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function subscribe() {
        setLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                toast.error('Разрешите уведомления в браузере');
                return;
            }
            const registration = await navigator.serviceWorker.ready;
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) throw new Error('VAPID key missing');

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            const res = await fetch('/api/webpush/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(subscription),
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }

            setIsSubscribed(true);
            toast.success('Вы подписаны на веб-уведомления');
        } catch (err) {
            toast.error('Не удалось подписаться');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function unsubscribe() {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
            }
            const res = await fetch('/api/webpush/subscribe', { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setIsSubscribed(false);
            toast.success('Вы отписались от веб-уведомлений');
        } catch (err) {
            toast.error('Не удалось отписаться');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function urlBase64ToUint8Array(base64String: string) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    if (loading) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Включить уведомления</span>
            <Switch checked={isSubscribed} onCheckedChange={(checked) => (checked ? subscribe() : unsubscribe())} />
        </div>
    );
}