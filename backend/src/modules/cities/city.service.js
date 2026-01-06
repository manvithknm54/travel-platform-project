import prisma from "../../config/db.js";

export const searchCitiesService = async (query) => {
  const { q, country, minCost, maxCost } = query;

  return prisma.city.findMany({
    where: {
      AND: [
        q
          ? {
              name: {
                contains: q,
                mode: "insensitive",
              },
            }
          : {},
        country
          ? {
              country: {
                equals: country,
                mode: "insensitive",
              },
            }
          : {},
        minCost ? { costIndex: { gte: Number(minCost) } } : {},
        maxCost ? { costIndex: { lte: Number(maxCost) } } : {},
      ],
    },
    orderBy: { name: "asc" },
  });
};
