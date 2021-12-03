/*
  Warnings:

  - Added the required column `name` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Target" ADD COLUMN     "name" TEXT NOT NULL;
