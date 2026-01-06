import prisma from "../../config/db.js";
import crypto from "crypto";

export const createShareLinkService = async (tripId, userId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip || trip.userId !== userId) {
    throw { status: 403, message: "Unauthorized or trip not found" };
  }

  const token = crypto.randomBytes(16).toString("hex");

  return prisma.share.create({
    data: {
      tripId,
      token,
    },
  });
};

export const getPublicTripService = async (token) => {
  const share = await prisma.share.findUnique({
    where: { token },
    include: {
      trip: {
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
      },
    },
  });

  if (!share) {
    throw { status: 404, message: "Invalid or expired link" };
  }

  return share.trip;
};
