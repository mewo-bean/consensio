'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import NotificationSettings from './NotificationSettings';

const excludedPaths = ['/login', '/register'];

export default function SettingsFloatingButton() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    if (excludedPaths.includes(pathname)) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    className="fixed bottom-4 left-4 z-50 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
                    aria-label="Настройки уведомлений"
                >
                    ⚙️
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Настройки уведомлений</DialogTitle>
                </DialogHeader>
                <NotificationSettings />
            </DialogContent>
        </Dialog>
    );
}