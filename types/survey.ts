export interface SurveyOption {
    id: string;
    text: string;
    votes: number;
}

export interface Survey {
    id: number;
    title: string;
    question: string;
    options: SurveyOption[];
    totalVotes: number;
    userVote: string | null;
    isExpired: boolean;
    expiresAt?: string;
    multipleChoice?: boolean;
    teamId?: number;
    sampleSurveyId: number;
}

// Типы из БД
export interface SampleSurvey {
    id: number;
    title: string;
}

export interface TeamSurvey {
    id: number;
    teamId: number;
    sampleSurveyId: number;
    createdAt: Date;
    surveyResults: SurveyResult[];
}

export interface SurveyResult {
    id: number;
    userId: number;
    teamSurveyId: number;
    totalScore: number;
    isAnon: boolean;
    sentAt: Date;
}