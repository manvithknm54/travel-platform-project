import { searchActivitiesService } from "./activity.service.js";

export const searchActivities = async (req, res, next) => {
  try {
    const activities = await searchActivitiesService(req.query);
    res.status(200).json(activities);
  } catch (err) {
    next(err);
  }
};
