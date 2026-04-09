-- DropForeignKey
ALTER TABLE "user_teams" DROP CONSTRAINT "user_teams_team_id_fkey";

-- AddForeignKey
ALTER TABLE "user_teams" ADD CONSTRAINT "user_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
