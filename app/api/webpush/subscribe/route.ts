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
    const { p256dh, authKey } = keys;
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
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}