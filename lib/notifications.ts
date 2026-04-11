import webpush from 'web-push'
import { prisma } from '@/lib/prisma';

webpush.setVapidDetails(
    'mailto:no-reply@yourdomain.com', // тут должен быть url или контактная почта
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function sendWebPushToAll(title: string, body: string, url: string = '/') {
    const users = await prisma.notificationSettings.findMany({
        where: { notifyViaWeb: true },
        select: { userId: true }
    });

    for (const user of users) {
        await sendWebPushToUser(user.userId, title, body, url);
    }
}

export async function sendWebPushToTeam(title: string, body: string, teamId: number, url: string = '/') {
    const teamMembers = await prisma.userTeam.findMany({
        where: { teamId },
        select: { userId: true }
    });

    const userIds = teamMembers.map(member => member.userId);
    if (userIds.length === 0) return;

    const users = await prisma.notificationSettings.findMany({
        where: {
            userId: { in: userIds },
            notifyViaWeb: true
        },
        select: { userId: true }
    });

    for (const user of users) {
        await sendWebPushToUser(user.userId, title, body, url);
    }
}

export async function sendWebPushToUser(userId: number, title: string, body: string, url: string = '/') {
    const subscription = await prisma.webPushSubscription.findUnique({ where: { userId } });
    if (!subscription) return;

    const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: { p256dh: subscription.p256dhKey, auth: subscription.authKey }
    };
    const payload = JSON.stringify({ title, body, url: url || '/' });
    try {
        await webpush.sendNotification(pushSubscription, payload);
    } catch (err: unknown) {
        console.error(err);
    }
}