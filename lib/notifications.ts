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
    const subscriptions = await prisma.webPushSubscription.findMany({
        where: { userId },
    });
    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url });

    for (const sub of subscriptions) {
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dhKey, auth: sub.authKey },
        };
        try {
            await webpush.sendNotification(pushSubscription, payload);
        } catch (err: any) {
            if (err.statusCode === 410 || err.statusCode === 404) {
                await prisma.webPushSubscription.delete({ where: { id: sub.id } });
                console.log(`Removed expired subscription for user ${userId}, endpoint ${sub.endpoint}`);
            } else {
                console.error(`Failed to send push to user ${userId}, device ${sub.deviceName}:`, err);
            }
        }
    }
}