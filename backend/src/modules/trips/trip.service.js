import prisma from "../../config/db.js";

/* CREATE TRIP */
export const createTripService = async (data, userId) => {
  const { title, startDate, endDate } = data;

  if (!title || !startDate || !endDate) {
    throw { status: 400, message: "All fields are required" };
  }

  return prisma.trip.create({
    data: {
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId,
    },
  });
};

/* GET ALL TRIPS OF USER */
export const getTripsService = async (userId) => {
  return prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

/* GET SINGLE TRIP BY ID */
export const getTripByIdService = async (tripId, userId) => {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId,
    },
    include: {
      stops: {
        include: {
          city: true,
          activities: {
            include: { activity: true },
          },
        },
      },
    },
  });

  if (!trip) {
    throw { status: 404, message: "Trip not found" };
  }

  return trip;
};

/* DELETE TRIP */
export const deleteTripService = async (tripId, userId) => {
  return prisma.trip.deleteMany({
    where: {
      id: tripId,
      userId,
    },
  });
};
