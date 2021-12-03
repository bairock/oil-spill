/*
  Warnings:

  - You are about to drop the column `cornerCoordinates` on the `Target` table. All the data in the column will be lost.
  - Added the required column `cornerCoordinates` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "cornerCoordinates" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Target" DROP COLUMN "cornerCoordinates";
