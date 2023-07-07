-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videpUrl" TEXT NOT NULL,
    "comment" VARCHAR(280) NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "thumbnailUrl" TEXT NOT NULL,
    "creatorName" TEXT NOT NULL,
    "creatorUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_videpUrl_key" ON "Content"("videpUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Content_thumbnailUrl_key" ON "Content"("thumbnailUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Content_creatorUrl_key" ON "Content"("creatorUrl");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
