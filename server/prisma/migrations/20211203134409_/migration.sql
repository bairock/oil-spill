/*
  Warnings:

  - You are about to drop the column `status` on the `Target` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "status";
