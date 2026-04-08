import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.notificationSettings.update({
        where: { userId: parseInt(session.user.id) },
        data: { notifyViaTg: false },
    });

    return NextResponse.json({ success: true });
}