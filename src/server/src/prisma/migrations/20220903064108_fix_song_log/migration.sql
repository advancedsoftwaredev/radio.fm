/*
  Warnings:

  - You are about to drop the column `starTime` on the `SongLog` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `SongLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SongLog" DROP COLUMN "starTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
