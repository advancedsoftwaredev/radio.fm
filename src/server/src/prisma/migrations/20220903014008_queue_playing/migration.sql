-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "timeAdded" TIMESTAMP(3) NOT NULL,
    "timeStarted" TIMESTAMP(3) NOT NULL,
    "timePlayStarted" TIMESTAMP(3) NOT NULL,
    "playing" BOOLEAN NOT NULL DEFAULT false,
    "songId" TEXT NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
