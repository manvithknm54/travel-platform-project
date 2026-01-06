import { searchCitiesService } from "./city.service.js";

export const searchCities = async (req, res, next) => {
  try {
    const cities = await searchCitiesService(req.query);
    res.status(200).json(cities);
  } catch (err) {
    next(err);
  }
};
