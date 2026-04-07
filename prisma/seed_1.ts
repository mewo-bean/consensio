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
    console.log('Начинаем полную имитацию БД (еженедельные отчеты)...');

    // 1. Чистка базы
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

    // 2. Создание структуры (Менеджер + 2 команды)
    const manager = await prisma.user.create({
        data: {
            username: 'chief_admin',
            email: 'ceo@wellness.io',
            first_name: 'Алексей',
            last_name: 'Менеджеров',
            password_hash: hashedPassword,
            notification_settings: { create: { notify_via_tg: true, notify_via_web: true } }
        }
    });

    const teamsData = [
        { title: 'Frontend Team'},
        { title: 'Backend Team'}
    ];

    const createdTeams = [];
    for (const t of teamsData) {
        const team = await prisma.team.create({ data: { title: t.title } });
        createdTeams.push(team);
        await prisma.userTeam.create({ data: { user_id: manager.id, team_id: team.id, role: Role.manager } });
    }

    const allEmployees = [];
    for (const team of createdTeams) {
        for (let i = 1; i <= 4; i++) {
            const user = await prisma.user.create({
                data: {
                    username: `${team.title.split(' ')[0].toLowerCase()}_user_${i}`,
                    email: `${team.title.split(' ')[0].toLowerCase()}_${i}@wellness.io`,
                    first_name: 'Сотрудник',
                    last_name: `${i}`,
                    password_hash: hashedPassword,
                    notification_settings: { create: { notify_via_web: true } }
                }
            });
            await prisma.userTeam.create({ data: { user_id: user.id, team_id: team.id, role: Role.member } });
            allEmployees.push({ ...user, teamId: team.id });
        }
    }

    // 3. Создание опросников
    console.log('Настройка шаблонов PSS-14 и Gallup Q12...');

    // PSS-14
    const pssSurvey = await prisma.sampleSurvey.create({ data: { title: 'Шкала воспринимаемого стресса (PSS-14)' } });
    const stressScale = await prisma.subscale.create({ data: { title: 'Стресс', top_mean: 45, bottom_mean: 15 } });
    const pssChoices = ['Никогда', 'Почти никогда', 'Иногда', 'Довольно часто', 'Очень часто'].map((c, i) => ({ content: c, order_num: i }));
    const pssQuestions = [
        "Как часто за последний месяц Вы испытывали расстройство из-за того, что произошло неожиданно?",
        "Как часто за последний месяц Вы чувствовали, что не в состоянии контролировать важные вещи в вашей жизни?",
        "Как часто за последний месяц Вы чувствовали себя нервным и напряженным?",
        "Как часто за последний месяц Вы успешно справлялись с повседневными проблемами?",
        "Как часто за последний месяц Вы чувствовали, что эффективно справляетесь с изменениями?",
        "Как часто за последний месяц Вы чувствовали уверенность в способности решать личные проблемы?",
        "Как часто за последний месяц Вы замечали, что дела идут так, как Вы хотели?",
        "Как часто за последний месяц Вы чувствовали, что не в силах справиться со всеми делами?",
        "Как часто за последний месяц Вы могли контролировать раздражение?",
        "Как часто за последний месяц Вы чувствовали, что находитесь на вершине успеха?",
        "Как часто за последний месяц Вы злились из-за того, что происходило нечто вне контроля?",
        "Как часто за последний месяц Вы ловили себя на мыслях о том, что должны сделать?",
        "Как часто за последний месяц Вы могли контролировать, как проводите время?",
        "Как часто за последний месяц Вы чувствовали, что трудности накапливаются?"
    ];
    for (const q of pssQuestions) {
        await prisma.question.create({
            data: { survey_id: pssSurvey.id, choices: { create: pssChoices }, subscales: { create: { subscale_id: stressScale.id } } }
        });
    }

    // Gallup Q12
    const gallupSurvey = await prisma.sampleSurvey.create({ data: { title: 'Опрос Gallup Q12' } });
    const engageScale = await prisma.subscale.create({ data: { title: 'Вовлеченность', top_mean: 55, bottom_mean: 30 } });
    const gallupChoices = ['Полностью не согласен', 'Не согласен', 'Нейтрально', 'Согласен', 'Полностью согласен'].map((c, i) => ({ content: c, order_num: i + 1 }));
    const gallupQuestions = [
        "Я знаю, что от меня требуется в работе.",
        "У меня есть все необходимое для работы.",
        "Каждый день я делаю то, что умею лучше всего.",
        "За неделю я получил похвалу.",
        "Руководитель проявляет интерес ко мне.",
        "Кто-то поощряет мое развитие.",
        "Мое мнение учитывается.",
        "Миссия компании важна для меня.",
        "Коллеги делают работу качественно.",
        "У меня есть лучший друг на работе.",
        "За полгода со мной говорили о прогрессе.",
        "За год была возможность расти."
    ];
    for (const q of gallupQuestions) {
        await prisma.question.create({
            data: { survey_id: gallupSurvey.id, choices: { create: gallupChoices }, subscales: { create: { subscale_id: engageScale.id } } }
        });
    }

    // 4. ГЕНЕРАЦИЯ ЕЖЕНЕДЕЛЬНЫХ ДАННЫХ
    console.log('Генерация истории ответов за 12 недель (PSS и Gallup каждую неделю)...');
    const now = new Date();

    for (let week = 0; week < 12; week++) {
        const date = new Date();
        date.setDate(now.getDate() - (week * 7));

        for (const team of createdTeams) {
            const teamEmployees = allEmployees.filter(e => e.teamId === team.id);

            // Создаем два запуска опроса для каждой команды в эту неделю
            const pssTeamSurvey = await prisma.teamSurvey.create({
                data: { team_id: team.id, sample_survey_id: pssSurvey.id, created_at: date }
            });
            const gallupTeamSurvey = await prisma.teamSurvey.create({
                data: { team_id: team.id, sample_survey_id: gallupSurvey.id, created_at: date }
            });

            for (const emp of teamEmployees) {
                // Вероятность, что сотрудник пропустил опрос в эту неделю (10%)
                if (Math.random() < 0.10) continue;

                // --- Данные PSS-14 ---
                // Имитация: во Frontend стресс растет к текущему моменту (week=0), в Backend стабилен
                let baseStress = team.title.includes('Frontend')
                    ? 38 - (week * 2)
                    : 22 + Math.floor(Math.random() * 5);
                const pssScore = Math.max(5, Math.min(baseStress + Math.floor(Math.random() * 8), 56));

                await prisma.surveyResult.create({
                    data: {
                        user_id: emp.id,
                        team_survey_id: pssTeamSurvey.id,
                        sample_survey_id: pssSurvey.id,
                        sent_at: date,
                        total_score: pssScore,
                        is_anon: true,
                        scores: { create: { subscale_id: stressScale.id, score: pssScore } }
                    }
                });

                // --- Данные Gallup Q12 ---
                // Имитация: вовлеченность падает, если стресс высокий
                let baseEngage = 55 - (pssScore / 3);
                const gallupScore = Math.max(12, Math.min(Math.floor(baseEngage + Math.random() * 10), 60));

                await prisma.surveyResult.create({
                    data: {
                        user_id: emp.id,
                        team_survey_id: gallupTeamSurvey.id,
                        sample_survey_id: gallupSurvey.id,
                        sent_at: date,
                        total_score: gallupScore,
                        is_anon: false, // Gallup обычно не анонимный
                        scores: { create: { subscale_id: engageScale.id, score: gallupScore } }
                    }
                });
            }
        }
    }

    // 5. Жалобы
    await prisma.complaint.create({
        data: {
            from_user_id: allEmployees[0].id,
            to_user_id: manager.id,
            team_id: createdTeams[0].id,
            content: "На этой неделе было слишком много митингов, не успеваем задачи.",
            is_anon: true
        }
    });

    console.log(`
База полностью готова!
----------------------------------
Логин менеджера: chief_admin / ${PASS}
История: 12 недель (PSS и Gallup заполнены каждую неделю)
Команды: Frontend (высокий стресс), Backend (стабильно)
----------------------------------
    `);
}

main()
    .catch((e) => {
        console.error('❌ Ошибка:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });