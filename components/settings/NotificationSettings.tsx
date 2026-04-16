'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebPushSubscribe from './WebPushSubscribe';
import TelegramSubscribe from './TelegramSubscribe';
import DevicesList from './DevicesList';

export default function NotificationSettings() {
    return (
        <Tabs defaultValue="push" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="push">Веб-уведомления</TabsTrigger>
                <TabsTrigger value="telegram">Telegram</TabsTrigger>
            </TabsList>

            <TabsContent value="push" className="space-y-4">
                <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium mb-2">Подписка</h3>
                    <WebPushSubscribe/>
                </div>
                <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium mb-2">Устройства</h3>
                    <DevicesList/>
                </div>
            </TabsContent>

            <TabsContent value="telegram" className="space-y-4">
                <div className="py-4">
                    <TelegramSubscribe />
                </div>
            </TabsContent>
        </Tabs>
    );
}