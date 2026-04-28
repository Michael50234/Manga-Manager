/*
  Warnings:

  - Made the column `sendNotifications` on table `UserMangaPreference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tierListRank` on table `UserMangaPreference` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserMangaPreference" ALTER COLUMN "sendNotifications" SET NOT NULL,
ALTER COLUMN "tierListRank" SET NOT NULL;
