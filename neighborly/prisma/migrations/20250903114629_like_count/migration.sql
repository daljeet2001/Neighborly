-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "likesCount" INTEGER DEFAULT 0;
