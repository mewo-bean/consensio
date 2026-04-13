'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
    const { setTheme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2">
                    <span className="relative inline-flex h-5 w-5 items-center justify-center">
                        <Sun className="absolute h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                    </span>
                    <span className="hidden sm:inline">Тема</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>Светлая</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Тёмная</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>Системная</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}