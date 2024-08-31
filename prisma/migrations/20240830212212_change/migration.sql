/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Measure` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[datetime]` on the table `Measure` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Measure_uuid_key" ON "Measure"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Measure_datetime_key" ON "Measure"("datetime");
