'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebPushSubscribe from './WebPushSubscribe';
import TelegramSubscribe from './TelegramSubscribe';
import DevicesList from './DevicesList';
import TestNotifications from './TestNotifications';

export default function NotificationSettings() {
    return (
        <Tabs defaultValue="push" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="push">Веб-уведомления</TabsTrigger>
                <TabsTrigger value="telegram">Telegram</TabsTrigger>
                <TabsTrigger value="test">Тестирование</TabsTrigger>
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

            <TabsContent value="telegram">
                <div className="rounded-lg border p-4">
                    <TelegramSubscribe/>
                </div>
            </TabsContent>

            <TabsContent value="test">
                <div className="rounded-lg border p-4">
                    <TestNotifications/>
                </div>
            </TabsContent>
        </Tabs>
    );
}