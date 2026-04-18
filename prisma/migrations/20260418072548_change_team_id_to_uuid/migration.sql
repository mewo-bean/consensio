/*
  Warnings:

  - The primary key for the `teams` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_teams` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_team_id_fkey";

-- DropForeignKey
ALTER TABLE "team_surveys" DROP CONSTRAINT "team_surveys_team_id_fkey";

-- DropForeignKey
ALTER TABLE "user_teams" DROP CONSTRAINT "user_teams_team_id_fkey";

-- AlterTable
ALTER TABLE "complaints" ALTER COLUMN "team_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "team_surveys" ALTER COLUMN "team_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "teams" DROP CONSTRAINT "teams_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "teams_id_seq";

-- AlterTable
ALTER TABLE "user_teams" DROP CONSTRAINT "user_teams_pkey",
ALTER COLUMN "team_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_teams_pkey" PRIMARY KEY ("user_id", "team_id");

-- AddForeignKey
ALTER TABLE "team_surveys" ADD CONSTRAINT "team_surveys_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_teams" ADD CONSTRAINT "user_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
