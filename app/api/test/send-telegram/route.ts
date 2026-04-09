import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sendTelegramMessage } from '@/lib/tgUtils';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tgId: true },
    });

    if (!user?.tgId) {
        return NextResponse.json({ error: 'Telegram не привязан' }, { status: 400 });
    }

    try {
        await sendTelegramMessage(user.tgId, '🔔 Тестовое уведомление из приложения!\n\nЕсли вы это видите, всё работает.');
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Ошибка отправки' }, { status: 500 });
    }
}