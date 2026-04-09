import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, LayoutDashboard, Target, Zap } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import Link from "next/link";
import React from "react";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex-1 bg-white flex flex-col pt-6 pb-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHeader title="Главная">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3" /> Consensio v1.0
          </div>
        </PageHeader>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-6 space-y-16">
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-black tracking-tighter md:text-6xl text-balance leading-[1.1]">
            Понимайте свою команду <br />
            <span className="text-primary">без лишних слов.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Привет, {user.username || user.email}! Consensio помогает
            отслеживать эмоциональный климат в группе и предотвращать выгорание.
          </p>
          <div className="flex items-center justify-center pt-4">
            <Link href="/dashboard/teams/new">
              <Button
                size="lg"
                className="rounded-full px-8 font-bold shadow-lg transition-transform hover:scale-105"
              >
                Начать работу
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<Target className="size-5 text-purple-500" />}
            title="Точные метрики"
            desc="Проверенные опросники PSS-14 и Gallup для оценки состояния."
          />
          <Feature
            icon={<LayoutDashboard className="size-5 text-green-500" />}
            title="Прозрачность"
            desc="Наглядные графики вовлеченности и стресса для всей команды."
          />
          <Feature
            icon={<Zap className="size-5 text-blue-500" />}
            title="Обратная связь"
            desc="Анонимные каналы связи для решения реальных проблем."
          />
        </section>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="space-y-3 p-4">
      <div className="size-10 rounded-xl bg-white shadow-sm border flex items-center justify-center">
        {icon}
      </div>
      <h4 className="font-bold text-lg">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
