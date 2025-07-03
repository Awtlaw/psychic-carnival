/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `Doctor` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_appointmentId_fkey";

-- DropIndex
DROP INDEX "Report_doctorId_key";

-- DropIndex
DROP INDEX "Report_patientId_key";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "appointmentId";
