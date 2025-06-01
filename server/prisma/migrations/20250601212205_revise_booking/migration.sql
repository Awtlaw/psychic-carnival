/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Appointment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropIndex
DROP INDEX "Appointment_doctorId_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "doctorId";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "appointmentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
