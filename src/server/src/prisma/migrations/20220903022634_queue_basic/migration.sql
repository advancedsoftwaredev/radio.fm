/*
  Warnings:

  - You are about to drop the column `playing` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `timePlayStarted` on the `Queue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "playing",
DROP COLUMN "timePlayStarted",
ALTER COLUMN "timeAdded" SET DEFAULT CURRENT_TIMESTAMP;
