import {
  addStopService,
  addActivityToStopService,
  getItineraryService,
} from "./itinerary.service.js";

export const addStop = async (req, res, next) => {
  try {
    const stop = await addStopService(req.params.tripId, req.body);
    res.status(201).json(stop);
  } catch (err) {
    next(err);
  }
};

export const addActivityToStop = async (req, res, next) => {
  try {
    const stopActivity = await addActivityToStopService(
      req.params.stopId,
      req.body
    );
    res.status(201).json(stopActivity);
  } catch (err) {
    next(err);
  }
};

export const getItinerary = async (req, res, next) => {
  try {
    const itinerary = await getItineraryService(req.params.tripId);
    res.status(200).json(itinerary);
  } catch (err) {
    next(err);
  }
};
