-- CreateEnum
CREATE TYPE "Type" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "Measure" (
    "uuid" UUID NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "type" "Type" NOT NULL,
    "value" INTEGER NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "image_url" TEXT NOT NULL,
    "costumer_code" TEXT NOT NULL,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("uuid")
);
