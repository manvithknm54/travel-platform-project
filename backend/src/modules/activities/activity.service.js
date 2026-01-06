import prisma from "../../config/db.js";

export const searchActivitiesService = async (query) => {
  const { q, category, minCost, maxCost, maxDuration } = query;

  return prisma.activity.findMany({
    where: {
      AND: [
        q
          ? {
              title: {
                contains: q,
                mode: "insensitive",
              },
            }
          : {},
        category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},
        minCost ? { cost: { gte: Number(minCost) } } : {},
        maxCost ? { cost: { lte: Number(maxCost) } } : {},
        maxDuration ? { duration: { lte: Number(maxDuration) } } : {},
      ],
    },
    orderBy: { title: "asc" },
  });
};
