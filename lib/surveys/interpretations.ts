export function getSurveyInterpretation(title: string, score: number) {
    const normalizedTitle = title.toLowerCase();

    // Шкала воспринимаемого стресса (PSS-14)
    if (
        normalizedTitle.includes("pss-14") ||
        normalizedTitle.includes("стресс")
    ) {
        if (score <= 13)
            return {
                level: "Низкий уровень стресса",
                description:
                    "Отличный результат! Похоже, вы прекрасно справляетесь с повседневными вызовами и умеете сохранять внутренний баланс. Так держать!",
                colorClass:
                    "text-green-700 bg-green-500/10 border-green-500/20",
            };
        if (score <= 26)
            return {
                level: "Умеренный уровень стресса",
                description:
                    "Вы находитесь в пределах нормы, но иногда напряжение всё же дает о себе знать. Не забывайте выделять время на полноценный отдых и заботу о себе.",
                colorClass:
                    "text-amber-700 bg-amber-500/10 border-amber-500/20",
            };
        return {
            level: "Высокий уровень стресса",
            description:
                "Кажется, сейчас у вас непростой период. Постарайтесь снизить нагрузку, больше отдыхать и, при необходимости, обсудите это с близкими или руководителем. Берегите себя!",
            colorClass: "text-red-700 bg-red-500/10 border-red-500/20",
        };
    }

    // Опрос вовлеченности Gallup Q12
    if (normalizedTitle.includes("gallup") || normalizedTitle.includes("q12")) {
        if (score <= 34)
            return {
                level: "Требует внимания",
                description:
                    "Похоже, на работе вам сейчас не хватает мотивации или поддержки команды. Это нормальная ситуация, и это отличный повод открыто обсудить ваши ожидания с руководителем 1-на-1.",
                colorClass: "text-red-700 bg-red-500/10 border-red-500/20",
            };
        if (score <= 45)
            return {
                level: "Нормальная вовлечённость",
                description:
                    "Хороший показатель! Вы в целом довольны своей ролью и процессами в команде, но всегда есть пространство для улучшений и новых интересных задач.",
                colorClass:
                    "text-amber-700 bg-amber-500/10 border-amber-500/20",
            };
        return {
            level: "Высокая вовлечённость",
            description:
                "Супер! Вы по-настоящему увлечены своим делом, чувствуете свою ценность и отлично синхронизированы с командой. Продолжайте в том же духе!",
            colorClass: "text-green-700 bg-green-500/10 border-green-500/20",
        };
    }

    // Заглушка для любых других будущих опросов
    return {
        level: "Результат сохранен",
        description:
            "Спасибо за ваши искренние ответы! Эта информация помогает делать процессы в команде более комфортными.",
        colorClass: "text-primary bg-primary/10 border-primary/20",
    };
}
