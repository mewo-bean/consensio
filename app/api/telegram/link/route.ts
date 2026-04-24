import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { getBotUsername } from "@/lib/tgUtils";

export async function POST() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = parseInt(session.user.id, 10);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tgId: true },
    });

    if (user?.tgId) {
        await prisma.notificationSettings.upsert({
            where: { userId },
            update: { notifyViaTg: true },
            create: { userId, notifyViaTg: true },
        });
        return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.telegramLinkToken.create({
        data: {
            userId,
            token,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
    });

    const botUsername = await getBotUsername();
    const link = `https://t.me/${botUsername}?start=${token}`;

    return NextResponse.json({ link });
}
