-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "experimentId" TEXT NOT NULL,
    "variationId" TEXT NOT NULL,
    "weekday" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "timeRegion" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "browserVersion" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "platformType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "timeSpentOnPage" TEXT,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);
