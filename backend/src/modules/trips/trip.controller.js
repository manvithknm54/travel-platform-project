import {
  createTripService,
  getTripsService,
  getTripByIdService,
  deleteTripService,
} from "./trip.service.js";


export const createTrip = async (req, res, next) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    const trip = await createTripService(req.body, req.user.id);
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const trips = await getTripsService(req.user.id);
    res.status(200).json(trips);
  } catch (err) {
    next(err);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const trip = await getTripByIdService(
      req.params.id,
      req.user.id
    );
    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const result = await deleteTripService(
      req.params.id,
      req.user.id
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

