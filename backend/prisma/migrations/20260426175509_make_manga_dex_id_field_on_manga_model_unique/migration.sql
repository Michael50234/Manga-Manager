/*
  Warnings:

  - A unique constraint covering the columns `[mangaDexId]` on the table `Manga` will be added. If there are existing duplicate values, this will fail.

*/
-- DropEnum
DROP TYPE "ReleaseStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Manga_mangaDexId_key" ON "Manga"("mangaDexId");

-- CreateIndex
CREATE INDEX "Manga_mangaDexId_idx" ON "Manga"("mangaDexId");
