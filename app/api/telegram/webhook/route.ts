import { NextResponse } from 'next/server';
import { sendTelegramMessage } from "@/lib/tgUtils";
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const body = await req.json();
    const chatId = body.message?.chat?.id;
    const text = body.message?.text;

    if (!text.startsWith('/start')) {
        return NextResponse.json({ ok: true });
    }

    const token = text.split(' ')[1];

    if (!token) {
        await sendTelegramMessage(chatId, 'Привет! Используйте кнопку на сайте для привязки уведомлений.');
        return NextResponse.json({ ok: true });
    }

    const linkToken = await prisma.telegramLinkToken.findFirst({
        where: {
            token,
            expiresAt: { gt: new Date() }
        }
    });

    if (!linkToken) {
        await sendTelegramMessage(chatId, '❌ Неверная или просроченная ссылка. Пожалуйста, запросите новую ссылку на сайте');
        return NextResponse.json({ ok: true });
    }

    await prisma.user.update({
        where: { id: linkToken.userId },
        data: { tgId: chatId },
    });

    await prisma.telegramLinkToken.delete({
        where: { id: linkToken.id }
    });

    await sendTelegramMessage(chatId, '✅ Telegram успешно привязан! Теперь вы будете получать уведомления через этого бота');

    return NextResponse.json({ ok: true });
}