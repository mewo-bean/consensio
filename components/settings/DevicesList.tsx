'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MonitorSmartphone, Trash2 } from 'lucide-react';

interface Device {
    id: string;
    deviceName: string | null;
    endpoint: string;
    createdAt: string;
}

export default function DevicesList() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchDevices() {
        try {
            const res = await fetch('/api/webpush/devices');
            const data = await res.json();
            setDevices(data.devices || []);
        } catch (err) {
            toast.error('Не удалось загрузить устройства');
        } finally {
            setLoading(false);
        }
    }

    async function deleteDevice(id: string, endpoint: string) {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription && subscription.endpoint === endpoint) {
                await subscription.unsubscribe();
            }

            const res = await fetch('/api/webpush/devices', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                toast.success('Устройство удалено');
                window.dispatchEvent(new Event('subscription-changed'));
            } else {
                toast.error('Ошибка при удалении');
            }
        } catch (err) {
            toast.error('Произошла ошибка');
        }
    }

    useEffect(() => {
        fetchDevices();
        window.addEventListener('subscription-changed', fetchDevices);
        return () => window.removeEventListener('subscription-changed', fetchDevices);
    }, []);

    if (loading) return <div>Загрузка устройств...</div>;
    if (devices.length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground">
                <MonitorSmartphone className="mx-auto h-8 w-8 mb-2 opacity-50"/>
                <p className="text-sm">Нет подключённых устройств</p>
                <p className="text-xs">Подпишитесь на уведомления, чтобы они появились здесь</p>
            </div>
        );
    }

    return (
        <div className="divide-y">
            {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <MonitorSmartphone className="h-4 w-4 shrink-0 text-muted-foreground"/>
                        <div className="overflow-hidden">
                            <div className="text-sm font-medium truncate">
                                {device.deviceName || 'Неизвестное устройство'}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteDevice(device.id, device.endpoint)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            ))}
        </div>
    );
}