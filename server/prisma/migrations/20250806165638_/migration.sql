/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_doctorId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "doctorId";
