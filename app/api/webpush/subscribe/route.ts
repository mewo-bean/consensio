import { NextResponse } from 'next/server';
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await req.json();
    const { endpoint, keys } = subscription;
    const { p256dh, auth: authKey } = keys;
    const userId = Number.parseInt(session.user.id)

    try {
        await prisma.webPushSubscription.upsert({
            where: { userId: userId },
            update: {
                endpoint,
                p256dhKey: p256dh,
                authKey: authKey,
            },
            create: {
                userId: userId,
                endpoint,
                p256dhKey: p256dh,
                authKey: authKey,
                deviceName: null,
            },
        });

        await prisma.notificationSettings.upsert({
            where: { userId: parseInt(session.user.id) },
            update: {
                notifyViaWeb: true
            },
            create: {
                userId: userId,
                notifyViaWeb: true,
                notifyViaTg: false,
                lastReminded: null
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    try {
        await prisma.webPushSubscription.delete({
            where: { userId },
        });

        await prisma.notificationSettings.update({
            where: { userId: parseInt(session.user.id) },
            data: { notifyViaWeb: false },
        });
    } catch {
        console.log(`Error while deleting web subscription for user: ${userId}`)
    }

    return NextResponse.json({ success: true });
}