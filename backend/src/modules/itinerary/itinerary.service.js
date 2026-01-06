import prisma from "../../config/db.js";

// Add a stop (city) to a trip
export const addStopService = async (tripId, data) => {
  const { cityId, startDate, endDate, order } = data;

  // Verify trip exists
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw { status: 404, message: "Trip not found" };

  const stop = await prisma.stop.create({
    data: {
      tripId,
      cityId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      order,
    },
  });

  return stop;
};

// Add activity to a stop (dayNumber optional)
export const addActivityToStopService = async (stopId, data) => {
  const { activityId, dayNumber } = data;

  // Verify stop exists
  const stop = await prisma.stop.findUnique({ where: { id: stopId } });
  if (!stop) throw { status: 404, message: "Stop not found" };

  const stopActivity = await prisma.stopActivity.create({
    data: {
      stopId,
      activityId,
      dayNumber,
    },
  });

  return stopActivity;
};

// Get full itinerary for a trip
export const getItineraryService = async (tripId) => {
  const stops = await prisma.stop.findMany({
    where: { tripId },
    include: {
      city: true,
      activities: {
        include: { activity: true },
        orderBy: { dayNumber: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return stops;
};
