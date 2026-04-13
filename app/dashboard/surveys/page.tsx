import { getActiveSurveys, getCompletedSurveys } from "@/app/dashboard/surveys/actions";
import { SurveysTab } from "@/components/surveys/surveys-tab";

export default async function SurveysPage() {
  const [activeSurveys, completedSurveys] = await Promise.all([
    getActiveSurveys(),
    getCompletedSurveys(),
  ]);

  return (
    <SurveysTab
      initialActiveSurveys={activeSurveys}
      initialCompletedSurveys={completedSurveys}
    />
  );
}
