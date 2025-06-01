/*
  Warnings:

  - A unique constraint covering the columns `[imageHash]` on the table `Artwork` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PendingArtwork` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "consensusCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dimensions" TEXT,
ADD COLUMN     "imageUris" TEXT[],
ADD COLUMN     "isOriginal" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "medium" TEXT,
ADD COLUMN     "metadataUri" TEXT,
ADD COLUMN     "originalAuthor" TEXT,
ADD COLUMN     "requiredValidators" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "year" TEXT,
ALTER COLUMN "isDuplicate" SET DEFAULT false,
ALTER COLUMN "consensus" SET DEFAULT false,
ALTER COLUMN "metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PendingArtwork" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUris" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "metadataUri" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_imageHash_key" ON "Artwork"("imageHash");
