import prisma from "../../config/db.js";

export const searchCitiesService = async ({ q }) => {
  if (!q || q.trim() === "") {
    return [];
  }

  return prisma.city.findMany({
    where: {
      OR: [
        {
          name: {
            contains: q,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: q,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      name: "asc",
    },
  });
};
