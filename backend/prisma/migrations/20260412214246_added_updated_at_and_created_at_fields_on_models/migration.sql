/*
  Warnings:

  - Added the required column `lastUpdatedAt` to the `Manga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastUpdatedAt` to the `UserMangaPreference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "lastUpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastUpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserMangaPreference" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastUpdatedAt" TIMESTAMP(3) NOT NULL;
