import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@/app/generated/prisma/client';
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;
const PASS = "StrongPass123!";

async function main() {
    console.log('--- Начинаем генерацию "Штормового" сида ---');

    // 1. Очистка
    await prisma.userSubscaleScore.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.surveyResult.deleteMany();
    await prisma.teamSurvey.deleteMany();
    await prisma.choice.deleteMany();
    await prisma.questionSubscale.deleteMany();
    await prisma.question.deleteMany();
    await prisma.subscale.deleteMany();
    await prisma.sampleSurvey.deleteMany();
    await prisma.notificationSettings.deleteMany();
    await prisma.userTeam.deleteMany();
    await prisma.team.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash(PASS, SALT_ROUNDS);

    // 2. Создание менеджера и команд
    const manager = await prisma.user.create({
        data: {
            username: 'chief_admin',
            email: 'ceo@wellness.io',
            first_name: 'Алексей',
            last_name: 'Менеджеров',
            password_hash: hashedPassword,
        }
    });

    const frontendTeam = await prisma.team.create({ data: { title: 'Frontend Team' } });
    const backendTeam = await prisma.team.create({ data: { title: 'Backend Team' } });

    await prisma.userTeam.createMany({
        data: [
            { user_id: manager.id, team_id: frontendTeam.id, role: Role.manager },
            { user_id: manager.id, team_id: backendTeam.id, role: Role.manager },
        ]
    });

    // Создаем по 10 сотрудников в каждую команду для масштаба
    const allEmployees = [];
    for (let i = 1; i <= 20; i++) {
        const teamId = i <= 10 ? frontendTeam.id : backendTeam.id;
        const user = await prisma.user.create({
            data: {
                username: `worker_${i}`,
                email: `worker_${i}@wellness.io`,
                password_hash: hashedPassword,
            }
        });
        await prisma.userTeam.create({ data: { user_id: user.id, team_id: teamId, role: Role.member } });
        allEmployees.push({ id: user.id, teamId });
    }

    // 3. Шаблоны тестов
    const pssSurvey = await prisma.sampleSurvey.create({ data: { title: 'Шкала воспринимаемого стресса (PSS-14)' } });
    const gallupSurvey = await prisma.sampleSurvey.create({ data: { title: 'Опрос Gallup Q12' } });

    // 4. Генерация данных за 12 недель с ВОЛАТИЛЬНОСТЬЮ
    console.log('Генерируем волатильные данные и низкое участие...');
    const now = new Date();

    for (let week = 0; week < 12; week++) {
        const reportDate = new Date();
        reportDate.setDate(now.getDate() - (week * 7));

        // Создаем запуски опросов
        const fvPss = await prisma.teamSurvey.create({ data: { team_id: frontendTeam.id, sample_survey_id: pssSurvey.id, created_at: reportDate } });
        const fvGal = await prisma.teamSurvey.create({ data: { team_id: frontendTeam.id, sample_survey_id: gallupSurvey.id, created_at: reportDate } });
        const bvPss = await prisma.teamSurvey.create({ data: { team_id: backendTeam.id, sample_survey_id: pssSurvey.id, created_at: reportDate } });
        const bvGal = await prisma.teamSurvey.create({ data: { team_id: backendTeam.id, sample_survey_id: gallupSurvey.id, created_at: reportDate } });

        const weeklySurveys = [fvPss, fvGal, bvPss, bvGal];

        for (const emp of allEmployees) {
            // --- ПЛОХОЕ УЧАСТИЕ ---
            // 65% сотрудников ИГНОРИРУЮТ опрос каждую неделю
            if (Math.random() < 0.65) continue;

            const isFrontend = emp.teamId === frontendTeam.id;

            // --- ГЕНЕРАЦИЯ ИЗМЕНЧИВОГО СТРЕССА ---
            let stressScore: number;
            if (isFrontend) {
                // Frontend: Стресс растет к текущему моменту (эффект приближающегося дедлайна)
                // Используем синус для волнообразности + тренд
                const trend = (12 - week) * 3;
                const wave = Math.sin(week) * 10;
                stressScore = Math.max(10, Math.min(50, 20 + trend + wave + (Math.random() * 5)));
            } else {
                // Backend: Резкие скачки (то густо, то пусто)
                stressScore = week % 3 === 0 ? 45 : 15 + (Math.random() * 10);
            }

            // --- ГЕНЕРАЦИЯ ИЗМЕНЧИВОЙ ВОВЛЕЧЕННОСТИ ---
            // Обычно она обратно пропорциональна стрессу, но добавим "всплески"
            let engageScore = 60 - stressScore + (Math.sin(week * 1.5) * 15);
            engageScore = Math.max(12, Math.min(60, engageScore));

            // Записываем PSS-14
            await prisma.surveyResult.create({
                data: {
                    user_id: emp.id,
                    team_survey_id: isFrontend ? fvPss.id : bvPss.id,
                    sample_survey_id: pssSurvey.id,
                    sent_at: reportDate,
                    total_score: Math.floor(stressScore),
                    is_anon: true,
                }
            });

            // Записываем Gallup
            await prisma.surveyResult.create({
                data: {
                    user_id: emp.id,
                    team_survey_id: isFrontend ? fvGal.id : bvGal.id,
                    sample_survey_id: gallupSurvey.id,
                    sent_at: reportDate,
                    total_score: Math.floor(engageScore),
                    is_anon: false,
                }
            });
        }
    }

    console.log(`
Сид успешно залит!
- Участие: ~35% (будет видно в карточках)
- Графики: 
    * Frontend: Стресс плавно растет с волнами.
    * Backend: Резкие "пики" стресса каждую третью неделю.
- Логин: chief_admin / StrongPass123!
    `);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });