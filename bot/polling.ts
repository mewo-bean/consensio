import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { prisma } from '@/lib/prisma';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    process.exit(1);
}

console.log('Токен получен, пытаюсь создать бота...');

async function startBot(token: string) {
    const bot = new TelegramBot(token, { polling: true });
    await clearPendingUpdates(bot);

    bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
        const from = msg.from;
        console.log(`Received message from ${from?.username || "Без имени"}(${from?.id})`);
        console.log(msg.text);
        const chatId = msg.chat.id;
        const token = match?.[1];

        if (!token) {
            await bot.sendMessage(chatId, 'Привет! Используйте кнопку на сайте для привязки');
            return;
        }

        const linkToken = await prisma.telegramLinkToken.findFirst({
            where: {
                token: token,
                expiresAt: { gt: new Date() }
            }
        });

        if (!linkToken) {
            await bot.sendMessage(chatId, '❌ Неверная или просроченная ссылка');
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
}

async function clearPendingUpdates(bot: TelegramBot) {
    try {
        const updates = await bot.getUpdates({ limit: 1, timeout: 0 });
        if (updates.length > 0) {
            const lastUpdateId = updates[0].update_id;
            await bot.getUpdates({ offset: lastUpdateId + 1, timeout: 0 });
            console.log(`Пропущены все обновления до update_id ${lastUpdateId}`);
        } else {
            console.log('Нет ожидающих обновлений');
        }
    } catch (err) {
        console.error('Ошибка при очистке очереди:', err);
    }
}

startBot(token).catch(console.error);
console.log('Telegram бот запущен в режиме polling');