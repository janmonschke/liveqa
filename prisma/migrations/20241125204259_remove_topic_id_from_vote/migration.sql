/*
  Warnings:

  - You are about to drop the column `topicId` on the `Vote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "QA" DROP CONSTRAINT "QA_hostId_fkey";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "topicId";

-- AddForeignKey
ALTER TABLE "QA" ADD CONSTRAINT "QA_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE CASCADE ON UPDATE CASCADE;
