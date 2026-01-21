import prisma from "../../config/db.js";

export const searchActivitiesService = async ({ q, cityId }) => {
  if (!cityId) {
    return [];
  }

  const results = await prisma.cityActivity.findMany({
    where: {
      cityId,
      activity: {
        title: {
          contains: q || "",
          mode: "insensitive",
        },
      },
    },
    include: {
      activity: true,
    },
    orderBy: {
      activity: {
        title: "asc",
      },
    },
  });

  // Return only activity objects
  return results.map((r) => r.activity);
};
