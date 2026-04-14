import {
  getActiveSurveys,
  getCompletedSurveys,
  getExpiredSurveys,
} from "@/app/dashboard/surveys/actions";
import { SurveysTab } from "@/components/surveys/surveys-tab";

export default async function SurveysPage() {
  const [activeSurveys, completedSurveys, expiredSurveys] = await Promise.all([
    getActiveSurveys(),
    getCompletedSurveys(),
    getExpiredSurveys(),
  ]);

  return (
    <SurveysTab
      initialActiveSurveys={activeSurveys}
      initialCompletedSurveys={completedSurveys}
      initialExpiredSurveys={expiredSurveys}
    />
  );
}
