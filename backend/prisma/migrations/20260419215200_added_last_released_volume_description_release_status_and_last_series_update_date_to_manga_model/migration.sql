/*
  Warnings:

  - Added the required column `description` to the `Manga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastReleasedVolume` to the `Manga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastSeriesUpdateDate` to the `Manga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseStatus` to the `Manga` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReleaseStatus" AS ENUM ('Completed', 'Ongoing');

-- AlterTable
ALTER TABLE "Manga" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "lastReleasedVolume" INTEGER NOT NULL,
ADD COLUMN     "lastSeriesUpdateDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "releaseStatus" "ReleaseStatus" NOT NULL;
