import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendWebPushToUser } from '@/lib/notifications';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    setTimeout(async () => {
        await sendWebPushToUser(
            userId,
            'Отложенное уведомление',
            'Это уведомление пришло через 5 секунд, даже если вкладка закрыта!',
            '/'
        );
    }, 5000);

    return NextResponse.json({ success: true, message: 'Уведомление будет отправлено через 5 секунд' });
}