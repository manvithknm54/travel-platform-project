import prisma from "../../config/db.js";

export const getTripBudgetService = async (tripId) => {
  // Fetch stops with activities
  const stops = await prisma.stop.findMany({
    where: { tripId },
    include: {
      city: true,
      activities: {
        include: { activity: true },
      },
    },
  });

  if (!stops.length) {
    throw { status: 404, message: "No itinerary found for this trip" };
  }

  let totalCost = 0;
  const costByCity = {};
  const costByDay = {};

  stops.forEach((stop) => {
    const cityName = stop.city.name;
    costByCity[cityName] = costByCity[cityName] || 0;

    stop.activities.forEach((sa) => {
      const cost = sa.activity.cost;
      const day = sa.dayNumber;

      totalCost += cost;
      costByCity[cityName] += cost;

      costByDay[day] = (costByDay[day] || 0) + cost;
    });
  });

  const totalDays = Object.keys(costByDay).length || 1;

  return {
    totalCost,
    averageCostPerDay: Math.round(totalCost / totalDays),
    costByCity,
    costByDay,
  };
};
