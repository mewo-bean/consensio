import { getActiveSurveys, getCompletedSurveys } from "@/app/dashboard/surveys/actions";
import { SurveysTab } from "@/components/surveys/surveys-tab";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function SurveysPage() {
  const [activeSurveys, completedSurveys] = await Promise.all([
    getActiveSurveys(),
    getCompletedSurveys(),
  ]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <SurveysTab
          initialActiveSurveys={activeSurveys}
          initialCompletedSurveys={completedSurveys}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
