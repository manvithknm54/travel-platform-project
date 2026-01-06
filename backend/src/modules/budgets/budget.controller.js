import { getTripBudgetService } from "./budget.service.js";

export const getTripBudget = async (req, res, next) => {
  try {
    const budget = await getTripBudgetService(req.params.tripId);
    res.status(200).json(budget);
  } catch (err) {
    next(err);
  }
};
