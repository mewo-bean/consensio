'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ redirectTo: '/' });
    };

    return (
        <Button variant="destructive" onClick={handleLogout} className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
        </Button>
    );
}