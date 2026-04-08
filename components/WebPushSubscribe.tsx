'use client';

import { useEffect, useState } from 'react';

export default function WebPushSubscribe() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription().then(r => r);
        }
    }, []);

    const checkSubscription = async () => {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
    };

    const subscribe = async () => {
        setIsLoading(true);
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Разрешение не получено');
                return;
            }

            const registration = await navigator.serviceWorker.register('/sw.js');

            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey!)
            });

            const res = await fetch('/api/webpush/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });
            if (res.ok) {
                setIsSubscribed(true);
            } else {
                throw new Error('Ошибка сохранения подписки');
            }
        } catch (err) {
            console.error(err);
            alert('Не удалось подписаться');
        } finally {
            setIsLoading(false);
        }
    };

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

    if (!isSupported){
        return <div>Ваш браузер не поддерживает уведомления</div>;
    }
    if (isSubscribed) {
        return <div>✅ Вы подписаны на уведомления</div>;
    }

    return (
        <button onClick={subscribe} disabled={isLoading}>
            {isLoading ? 'Подписка...' : 'Включить веб-уведомления'}
        </button>
    );
}