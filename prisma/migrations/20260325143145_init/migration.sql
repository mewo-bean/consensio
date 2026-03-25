-- CreateEnum
CREATE TYPE "Role" AS ENUM ('manager', 'member');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(20) NOT NULL,
    "last_name" VARCHAR(20) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "salt" VARCHAR(255) NOT NULL,
    "tg_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_surveys" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,

    CONSTRAINT "sample_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscales" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "top_mean" SMALLINT NOT NULL,
    "bottom_mean" SMALLINT NOT NULL,

    CONSTRAINT "subscales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_surveys" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "sample_survey_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team_survey_id" INTEGER NOT NULL,
    "sample_survey_id" INTEGER NOT NULL,
    "sent_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_score" SMALLINT NOT NULL,
    "is_anon" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "survey_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choices" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "order_num" INTEGER NOT NULL,
    "content" VARCHAR(255) NOT NULL,

    CONSTRAINT "choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_subscales" (
    "question_id" INTEGER NOT NULL,
    "subscale_id" INTEGER NOT NULL,

    CONSTRAINT "question_subscales_pkey" PRIMARY KEY ("question_id","subscale_id")
);

-- CreateTable
CREATE TABLE "notification_settings" (
    "user_id" INTEGER NOT NULL,
    "notify_via_tg" BOOLEAN NOT NULL DEFAULT false,
    "notify_via_web" BOOLEAN NOT NULL DEFAULT true,
    "last_reminded" TIMESTAMPTZ(6),

    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "web_push_subscriptions" (
    "user_id" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh_key" TEXT NOT NULL,
    "auth_key" TEXT NOT NULL,
    "device_name" VARCHAR(255),

    CONSTRAINT "web_push_subscriptions_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" SERIAL NOT NULL,
    "from_user_id" INTEGER NOT NULL,
    "to_user_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "is_anon" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscale_scores" (
    "result_id" INTEGER NOT NULL,
    "subscale_id" INTEGER NOT NULL,
    "score" SMALLINT NOT NULL,

    CONSTRAINT "user_subscale_scores_pkey" PRIMARY KEY ("result_id","subscale_id")
);

-- CreateTable
CREATE TABLE "user_teams" (
    "user_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "user_teams_pkey" PRIMARY KEY ("user_id","team_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "team_surveys" ADD CONSTRAINT "team_surveys_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_surveys" ADD CONSTRAINT "team_surveys_sample_survey_id_fkey" FOREIGN KEY ("sample_survey_id") REFERENCES "sample_surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_results" ADD CONSTRAINT "survey_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_results" ADD CONSTRAINT "survey_results_team_survey_id_fkey" FOREIGN KEY ("team_survey_id") REFERENCES "team_surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_results" ADD CONSTRAINT "survey_results_sample_survey_id_fkey" FOREIGN KEY ("sample_survey_id") REFERENCES "sample_surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "sample_surveys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choices" ADD CONSTRAINT "choices_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_subscales" ADD CONSTRAINT "question_subscales_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_subscales" ADD CONSTRAINT "question_subscales_subscale_id_fkey" FOREIGN KEY ("subscale_id") REFERENCES "subscales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_push_subscriptions" ADD CONSTRAINT "web_push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscale_scores" ADD CONSTRAINT "user_subscale_scores_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "survey_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscale_scores" ADD CONSTRAINT "user_subscale_scores_subscale_id_fkey" FOREIGN KEY ("subscale_id") REFERENCES "subscales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_teams" ADD CONSTRAINT "user_teams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_teams" ADD CONSTRAINT "user_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
