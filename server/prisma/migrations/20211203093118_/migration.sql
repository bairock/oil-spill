/*
  Warnings:

  - You are about to drop the column `date` on the `Target` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Target` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Target" DROP COLUMN "date",
DROP COLUMN "image",
ALTER COLUMN "name" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE SET NULL ON UPDATE CASCADE;
