/*
  Warnings:

  - A unique constraint covering the columns `[pincode]` on the table `Neighborhood` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_pincode_key" ON "public"."Neighborhood"("pincode");
