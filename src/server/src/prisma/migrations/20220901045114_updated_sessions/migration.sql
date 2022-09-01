/*
  Warnings:

  - You are about to drop the column `ip` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUEST';

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_sessionId_fkey";

-- DropIndex
DROP INDEX "User_sessionId_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "ip",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sessionId";

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
