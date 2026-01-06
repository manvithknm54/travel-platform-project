import {
  createShareLinkService,
  getPublicTripService,
} from "./share.service.js";

export const createShareLink = async (req, res, next) => {
  try {
    const link = await createShareLinkService(
      req.params.tripId,
      req.user.id
    );

    res.status(201).json({
      shareUrl: `${process.env.FRONTEND_URL}/share/${link.token}`,
    });
  } catch (err) {
    next(err);
  }
};

export const getPublicTrip = async (req, res, next) => {
  try {
    const trip = await getPublicTripService(req.params.token);
    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};
