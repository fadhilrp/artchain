-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artwork" (
    "id" SERIAL NOT NULL,
    "imageHash" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "isDuplicate" BOOLEAN NOT NULL,
    "consensus" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Artwork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingArtwork" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "dateSubmitted" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "images" TEXT[],
    "description" TEXT NOT NULL,
    "additionalInfo" TEXT NOT NULL,

    CONSTRAINT "PendingArtwork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");
