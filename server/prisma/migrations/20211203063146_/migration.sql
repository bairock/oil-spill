/*
  Warnings:

  - Added the required column `cornerCoordinates` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Target" ADD COLUMN     "cornerCoordinates" JSONB NOT NULL;
