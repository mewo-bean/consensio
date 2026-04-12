import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

function getDeviceName(userAgent: string, endpoint: string): string {
    let browser: string;
    if (/Chrome/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent)) browser = 'Safari';
    else if (/Edg/i.test(userAgent)) browser = 'Edge';
    else browser = 'Unknown';

    let os: string;
    if (/Windows/i.test(userAgent)) os = 'Windows';
    else if (/Mac/i.test(userAgent)) os = 'macOS';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';
    else if (/Linux/i.test(userAgent)) os = 'Linux';
    else os = 'Unknown OS';

    let name = `${browser} on ${os}`;

    const hash = endpoint.slice(-6);
    name += ` (${hash})`;

    return name;
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = parseInt(session.user.id);

    const subscriptions = await prisma.webPushSubscription.findMany({
        where: { userId },
        select: {
            id: true,
            deviceName: true
        }
    });

    return NextResponse.json({ devices: subscriptions });
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscription, userAgent } = await req.json();
    const { endpoint, keys } = subscription;
    const { p256dh, auth: authKey } = keys;
    const userId = Number.parseInt(session.user.id)
    const deviceName = getDeviceName(userAgent, endpoint);

    try {
        await prisma.webPushSubscription.upsert({
            where: { endpoint },
            update: {
                p256dhKey: p256dh,
                authKey,
                deviceName: deviceName || null,
            },
            create: {
                userId,
                endpoint,
                p256dhKey: p256dh,
                authKey,
                deviceName: deviceName || null,
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

export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = parseInt(session.user.id);
    const { id, endpoint } = await req.json();

    if (!id && !endpoint) {
        return NextResponse.json({ error: 'Missing id or endpoint' }, { status: 400 });
    }

    let subscription;
    if (id) {
        subscription = await prisma.webPushSubscription.findFirst({ where: { id, userId } });
    } else if (endpoint) {
        subscription = await prisma.webPushSubscription.findFirst({ where: { endpoint, userId } });
    }

    if (!subscription) {
        return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    await prisma.webPushSubscription.delete({ where: { id: subscription.id } });
    return NextResponse.json({ success: true });
}