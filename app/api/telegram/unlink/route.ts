import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = parseInt(session.user.id, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { tgId: null },
    });

    await prisma.notificationSettings.upsert({
        where: { userId },
        update: { notifyViaTg: false },
        create: { userId, notifyViaTg: false },
    });

    return NextResponse.json({ success: true });
}
