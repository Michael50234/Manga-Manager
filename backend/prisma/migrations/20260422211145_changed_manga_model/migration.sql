/*
  Warnings:

  - You are about to drop the column `author` on the `Manga` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Manga` table. All the data in the column will be lost.
  - You are about to drop the column `lastReleasedChapter` on the `Manga` table. All the data in the column will be lost.
  - You are about to drop the column `lastReleasedVolume` on the `Manga` table. All the data in the column will be lost.
  - You are about to drop the column `lastSeriesUpdateDate` on the `Manga` table. All the data in the column will be lost.
  - You are about to drop the column `releaseStatus` on the `Manga` table. All the data in the column will be lost.
  - Added the required column `mangaDexId` to the `Manga` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReleaseStatus" ADD VALUE 'Hiatus';
ALTER TYPE "ReleaseStatus" ADD VALUE 'Cancelled';

-- AlterTable
ALTER TABLE "Manga" DROP COLUMN "author",
DROP COLUMN "description",
DROP COLUMN "lastReleasedChapter",
DROP COLUMN "lastReleasedVolume",
DROP COLUMN "lastSeriesUpdateDate",
DROP COLUMN "releaseStatus",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mangaDexId" TEXT NOT NULL;
