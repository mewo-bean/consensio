"use client";

import * as React from "react";
import { toast } from "sonner";
import {
    assignSurveyToTeam,
    ensureDefaultSurveyTemplates,
} from "@/app/actions/team-survey";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

type SurveyTemplate = {
    id: number;
    title: string;
};

export function AssignSurveyCard({
    teamId,
    templates,
}: {
    teamId: string;
    templates: SurveyTemplate[];
}) {
    const router = useRouter();
    const [selectedTemplateId, setSelectedTemplateId] = React.useState<
        string | undefined
    >(templates[0]?.id ? String(templates[0].id) : undefined);
    const [isPending, startTransition] = React.useTransition();

    React.useEffect(() => {
        setSelectedTemplateId(
            templates[0]?.id ? String(templates[0].id) : undefined,
        );
    }, [templates]);

    const handleAssign = () => {
        if (!selectedTemplateId) return;

        const sampleSurveyId = Number(selectedTemplateId);
        if (!Number.isFinite(sampleSurveyId)) return;

        startTransition(async () => {
            const res = await assignSurveyToTeam(teamId, sampleSurveyId);
            if (res?.error) {
                toast.error(res.error);
                return;
            }
            toast.success("Опрос назначен команде");
            router.refresh();
        });
    };

    const handleSeedTemplates = () => {
        startTransition(async () => {
            const res = await ensureDefaultSurveyTemplates(teamId);
            if (res?.error) {
                toast.error(res.error);
                return;
            }
            toast.success(
                typeof res?.created === "number" && res.created > 0
                    ? `Добавлено шаблонов: ${res.created}`
                    : "Шаблоны уже существуют",
            );
            router.refresh();
        });
    };

    return (
        <Card className="shadow-sm overflow-hidden border-muted/60">
            <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-lg">Назначить опрос</CardTitle>
                <CardDescription>
                    Выберите шаблон и отправьте его участникам команды.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
                {templates.length > 0 ? (
                    <Select
                        value={selectedTemplateId}
                        onValueChange={setSelectedTemplateId}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите опрос" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {templates.map((t) => (
                                <SelectItem
                                    key={t.id}
                                    value={String(t.id)}
                                    className="rounded-lg"
                                >
                                    {t.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10 px-3 py-2 text-sm text-muted-foreground">
                        В базе нет шаблонов опросов. Нажмите «Создать шаблоны»,
                        чтобы добавить базовые (PSS-14 и Gallup Q12).
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        onClick={handleAssign}
                        disabled={
                            isPending ||
                            !selectedTemplateId ||
                            templates.length === 0
                        }
                        className="w-full sm:w-auto gap-2"
                    >
                        {isPending ? (
                            <Loader2 className="size-4 animate-spin shrink-0" />
                        ) : (
                            <Send className="size-4 shrink-0" />
                        )}
                        <span className="font-bold text-xs uppercase tracking-wider">
                            Назначить
                        </span>
                    </Button>

                    {templates.length === 0 && (
                        <Button
                            onClick={handleSeedTemplates}
                            disabled={isPending}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            Создать шаблоны
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
