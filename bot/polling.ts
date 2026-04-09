import TelegramBot from 'node-telegram-bot-api';
import { prisma } from '@/lib/prisma';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const token = match?.[1];

    if (!token) {
        await bot.sendMessage(chatId, 'Привет! Используйте кнопку на сайте для привязки.');
        return;
    }

    const linkToken = await prisma.telegramLinkToken.findFirst({
        where: {
            token: token,
            expiresAt: { gt: new Date() }
        }
    });

    if (!linkToken) {
        await bot.sendMessage(chatId, '❌ Неверная или просроченная ссылка.');
        return;
    }

    await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: { id: linkToken.userId },
            data: { tgId: chatId },
        });

        await tx.telegramLinkToken.delete({
            where: { id: linkToken.id }
        });
    });

    await bot.sendMessage(chatId, '✅ Telegram успешно привязан!');
});

console.log('Telegram бот запущен в режиме polling');