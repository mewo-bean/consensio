import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getSurveyTemplateForTitle } from "@/lib/surveys/templates";
import { submitTeamSurvey } from "@/app/dashboard/surveys/actions";
import { logProductActivity } from "@/lib/product-metrics";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";

export default async function TakeSurveyPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    // Читаем параметры и пишем метрику, если юзер пришел из уведомления
    const sp = await searchParams;
    if (sp.from_noti === "true") {
        logProductActivity("notification_click").catch(console.error);
    }

    const { id } = await params;
    const teamSurveyId = parseInt(id, 10);
    if (Number.isNaN(teamSurveyId)) redirect("/dashboard/surveys");

    const teamSurvey = await prisma.teamSurvey.findUnique({
        where: { id: teamSurveyId },
        include: {
            team: { select: { id: true, title: true } },
            sampleSurvey: { select: { id: true, title: true } },
        },
    });

    if (!teamSurvey) redirect("/dashboard/surveys");

    const membership = await prisma.userTeam.findUnique({
        where: {
            userId_teamId: { userId: user.id, teamId: teamSurvey.team.id },
        },
        select: { role: true },
    });

    if (!membership) redirect("/dashboard/surveys");

    const existing = await prisma.surveyResult.findFirst({
        where: { userId: user.id, teamSurveyId },
        select: { totalScore: true, sentAt: true },
    });

    const template = getSurveyTemplateForTitle(teamSurvey.sampleSurvey.title);

    // Решаем ошибку React "Cannot call impure function"
    const nowTime = new Date().getTime();
    const surveyExpiresAt = new Date(
        teamSurvey.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000,
    );
    const isExpired = surveyExpiresAt.getTime() <= nowTime;

    if (existing) {
        return (
            <div className="flex flex-1 justify-center px-4 py-6 sm:px-6">
                <div className="w-full max-w-3xl space-y-6 text-left">
                    <div className="text-left w-full flex flex-col items-start">
                        <PageHeader
                            title={teamSurvey.sampleSurvey.title}
                            description={`Опрос команды «${teamSurvey.team.title}». Все ответы анонимные.`}
                        />
                    </div>

                    <Card className="mx-auto w-full max-w-2xl border-muted/60">
                        <CardHeader className="text-left">
                            <CardTitle>
                                {teamSurvey.sampleSurvey.title}
                            </CardTitle>
                            <CardDescription>
                                {teamSurvey.team.title}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                Вы уже прошли этот опрос{" "}
                                <span className="font-medium text-foreground">
                                    {new Date(existing.sentAt).toLocaleString(
                                        "ru-RU",
                                    )}
                                </span>
                                .
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <Badge variant="secondary">
                                    Результат: {existing.totalScore}
                                </Badge>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/surveys">
                                        К опросам
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isExpired) {
        return (
            <div className="flex flex-1 justify-center px-4 py-6 sm:px-6">
                <div className="w-full max-w-3xl space-y-6 text-left">
                    <div className="text-left w-full flex flex-col items-start">
                        <PageHeader
                            title={teamSurvey.sampleSurvey.title}
                            description={`Опрос команды «${teamSurvey.team.title}». Все ответы анонимные.`}
                        />
                    </div>

                    <Card className="mx-auto w-full max-w-2xl border-muted bg-muted/20">
                        <CardHeader className="text-left">
                            <CardTitle>
                                {teamSurvey.sampleSurvey.title}
                            </CardTitle>
                            <CardDescription>
                                {teamSurvey.team.title}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                Срок прохождения этого опроса завершился{" "}
                                <span className="font-medium text-foreground">
                                    {surveyExpiresAt.toLocaleString("ru-RU")}
                                </span>
                                .
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <Badge variant="secondary">Опрос окончен</Badge>
                                <Button asChild variant="outline">
                                    <Link href="/dashboard/surveys">
                                        К опросам
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 justify-center px-4 py-6 sm:px-6">
            <div className="w-full max-w-4xl space-y-6">
                <div className="text-left w-full flex flex-col items-start">
                    <PageHeader
                        title={teamSurvey.sampleSurvey.title}
                        description={`Опрос команды «${teamSurvey.team.title}». Все ответы анонимные.`}
                    />
                </div>

                <form action={submitTeamSurvey} className="space-y-4">
                    <input
                        type="hidden"
                        name="teamSurveyId"
                        value={teamSurveyId}
                    />

                    <div className="rounded-xl border border-muted/60 bg-muted/10 px-4 py-3 text-sm text-muted-foreground text-left">
                        Ответы на этот опрос отправляются анонимно
                        автоматически.
                    </div>

                    <Card className="border-muted/60 bg-muted/10">
                        <CardHeader className="pb-3 text-left">
                            <CardTitle className="text-sm">
                                Шкала ответов
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-2">
                                {template.choices.map((choice) => (
                                    <div
                                        key={choice.value}
                                        className="inline-flex items-center gap-2 rounded-full border border-muted/60 bg-background px-3 py-1.5 text-xs sm:text-sm"
                                    >
                                        <span className="font-semibold text-foreground">
                                            {choice.value}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {choice.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Вывод приветствия */}
                    {template.greeting && (
                        <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-4 text-lg font-medium italic text-foreground/90 text-left">
                            {template.greeting}
                        </div>
                    )}

                    {template.questions.map((question, index) => (
                        <Card key={index} className="border-muted/60">
                            <CardHeader className="pb-3 text-left">
                                <CardTitle className="text-base">
                                    {template.questions.length > 1
                                        ? `Вопрос ${index + 1}`
                                        : "Вопрос"}
                                </CardTitle>
                                <CardDescription className="text-sm text-foreground">
                                    {question}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-2">
                                    {template.choices.map((choice) => {
                                        const inputId = `q_${teamSurveyId}_${index}_${choice.value}`;
                                        return (
                                            <label
                                                key={choice.value}
                                                htmlFor={inputId}
                                                className="flex min-w-0 cursor-pointer items-center gap-2 rounded-full border border-muted/60 bg-background px-3 py-2 text-sm hover:bg-muted/20"
                                            >
                                                <input
                                                    id={inputId}
                                                    type="radio"
                                                    name={`q_${index}`}
                                                    value={choice.value}
                                                    required
                                                    className="size-4 accent-primary"
                                                />
                                                <Badge
                                                    variant="outline"
                                                    className="h-6 shrink-0"
                                                >
                                                    {choice.value}
                                                </Badge>
                                            </label>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex items-center justify-between gap-3 pt-4">
                        <Button asChild variant="outline">
                            <Link href="/dashboard/surveys">Назад</Link>
                        </Button>
                        <Button type="submit">Отправить</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
