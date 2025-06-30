/*
  Warnings:

  - The `message` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Appointment_patientId_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "message",
ADD COLUMN     "message" JSONB;
