import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ linked: false });
    }
    const userId = parseInt(session.user.id);
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tgId: true }
    });

    if (user) {
        const settings = await prisma.notificationSettings.findUnique({
            where: { userId: userId },
            select: { notifyViaTg: true }
        });

        return NextResponse.json({ linked: !!settings?.notifyViaTg });
    }

    return NextResponse.json({ linked: false });
}