-- CreateTable
CREATE TABLE "CityActivity" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "CityActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CityActivity_cityId_activityId_key" ON "CityActivity"("cityId", "activityId");

-- AddForeignKey
ALTER TABLE "CityActivity" ADD CONSTRAINT "CityActivity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityActivity" ADD CONSTRAINT "CityActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
