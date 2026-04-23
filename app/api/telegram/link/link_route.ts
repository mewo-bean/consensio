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
    const userId = Number.parseInt(session.user.id);

    const settings = await prisma.notificationSettings.findUnique({
        where: { userId: userId },
    });

    if (settings) {
        await prisma.notificationSettings.update({
            where: { userId: userId },
            data: { notifyViaTg: true },
        });

        return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.telegramLinkToken.create({
        data: {
            userId: userId,
            token: token,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
    });

    const botUsername = await getBotUsername();
    const link = `https://t.me/${botUsername}?start=${token}`;

    return NextResponse.json({ link });
}
