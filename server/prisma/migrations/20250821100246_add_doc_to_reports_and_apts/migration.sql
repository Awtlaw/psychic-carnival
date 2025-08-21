-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "doctorId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Report" ADD COLUMN     "doctorId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
