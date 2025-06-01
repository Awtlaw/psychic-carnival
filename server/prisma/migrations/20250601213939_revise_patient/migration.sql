/*
  Warnings:

  - Added the required column `address` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proxy` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('M', 'F');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "proxy" JSONB NOT NULL,
ADD COLUMN     "sex" "Sex" NOT NULL;
