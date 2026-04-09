import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: { tgId: null },
    }),

    prisma.notificationSettings.upsert({
      where: { userId: parseInt(session.user.id) },
      update: { notifyViaTg: false },
      create: {
        userId: parseInt(session.user.id),
        notifyViaTg: false,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
