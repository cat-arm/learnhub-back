/*
  Warnings:

  - You are about to drop the column `videpUrl` on the `Content` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[videoUrl]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `videoUrl` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Content_videpUrl_key";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "videpUrl",
ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Content_videoUrl_key" ON "Content"("videoUrl");
