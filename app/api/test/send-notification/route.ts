import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendWebPushToUser } from '@/lib/notifications';

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    await sendWebPushToUser(
        userId,
        'Тестовое уведомление',
        'Если вы это видите, всё работает! 🎉',
        '/'
    );

    return NextResponse.json({ success: true });
}