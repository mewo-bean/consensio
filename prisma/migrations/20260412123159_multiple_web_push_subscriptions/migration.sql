/*
  Warnings:

  - The primary key for the `web_push_subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[endpoint]` on the table `web_push_subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "web_push_subscriptions" DROP CONSTRAINT "web_push_subscriptions_user_id_fkey";

-- AlterTable
ALTER TABLE "web_push_subscriptions" DROP CONSTRAINT "web_push_subscriptions_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "device_name" SET DATA TYPE TEXT,
ADD CONSTRAINT "web_push_subscriptions_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "web_push_subscriptions_endpoint_key" ON "web_push_subscriptions"("endpoint");

-- AddForeignKey
ALTER TABLE "web_push_subscriptions" ADD CONSTRAINT "web_push_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
