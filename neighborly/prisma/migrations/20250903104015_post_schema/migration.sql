/*
  Warnings:

  - You are about to drop the column `category` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Service` table. All the data in the column will be lost.
  - Added the required column `body` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "category",
DROP COLUMN "description",
DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "status",
DROP COLUMN "title",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "description",
DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "price",
DROP COLUMN "title",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
