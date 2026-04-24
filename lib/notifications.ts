import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/tgUtils";

webpush.setVapidDetails(
    "mailto:no-reply@yourdomain.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
);

export async function sendTelegramToTeam(text: string, teamId: string) {
    const teamMembers = await prisma.userTeam.findMany({
        where: { teamId },
        select: { userId: true },
    });

    const userIds = teamMembers.map((member) => member.userId);
    if (userIds.length === 0) return;

    const usersToNotify = await prisma.user.findMany({
        where: {
            id: { in: userIds },
            tgId: { not: null },
            notificationSettings: {
                notifyViaTg: true,
            },
        },
        select: { tgId: true },
    });

    for (const user of usersToNotify) {
        if (user.tgId) {
            await sendTelegramMessage(user.tgId, text).catch(console.error);
        }
    }
}

export async function sendTelegramToUser(text: string, userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            tgId: true,
            notificationSettings: {
                select: { notifyViaTg: true },
            },
        },
    });

    if (user?.tgId && user.notificationSettings?.notifyViaTg) {
        await sendTelegramMessage(user.tgId, text).catch(console.error);
    }
}

export async function sendWebPushToAll(
    title: string,
    body: string,
    url: string = "/",
) {
    const users = await prisma.notificationSettings.findMany({
        where: { notifyViaWeb: true },
        select: { userId: true },
    });

    for (const user of users) {
        await sendWebPushToUser(user.userId, title, body, url);
    }
}

export async function sendWebPushToTeam(
    title: string,
    body: string,
    teamId: string,
    url: string = "/",
) {
    const teamMembers = await prisma.userTeam.findMany({
        where: { teamId },
        select: { userId: true },
    });

    const userIds = teamMembers.map((member) => member.userId);
    if (userIds.length === 0) return;

    const users = await prisma.notificationSettings.findMany({
        where: {
            userId: { in: userIds },
            notifyViaWeb: true,
        },
        select: { userId: true },
    });

    for (const user of users) {
        await sendWebPushToUser(user.userId, title, body, url);
    }
}

export async function sendWebPushToUser(
    userId: number,
    title: string,
    body: string,
    url: string = "/",
) {
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
                await prisma.webPushSubscription.delete({
                    where: { id: sub.id },
                });
            } else {
                console.error(err);
            }
        }
    }
}
