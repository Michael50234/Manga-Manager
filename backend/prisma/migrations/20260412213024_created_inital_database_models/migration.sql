-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "MangaTierListRank" AS ENUM ('GodTier', 'S', 'A', 'B', 'C', 'D', 'F', 'Dropped', 'Unranked');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT 'Anonymous User',
    "bio" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manga" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "lastReleasedChapter" INTEGER NOT NULL,

    CONSTRAINT "Manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMangaPreference" (
    "id" TEXT NOT NULL,
    "mangaAccessLink" TEXT,
    "sendNotifications" BOOLEAN NOT NULL DEFAULT false,
    "mangaReleaseDay" "DayOfWeek",
    "tierListRank" "MangaTierListRank" NOT NULL DEFAULT 'Unranked',
    "userId" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,

    CONSTRAINT "UserMangaPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MangaToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MangaToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserMangaPreference_userId_mangaId_key" ON "UserMangaPreference"("userId", "mangaId");

-- CreateIndex
CREATE INDEX "_MangaToUser_B_index" ON "_MangaToUser"("B");

-- AddForeignKey
ALTER TABLE "UserMangaPreference" ADD CONSTRAINT "UserMangaPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMangaPreference" ADD CONSTRAINT "UserMangaPreference_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MangaToUser" ADD CONSTRAINT "_MangaToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MangaToUser" ADD CONSTRAINT "_MangaToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
