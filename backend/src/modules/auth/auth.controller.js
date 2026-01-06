import { signupService, loginService } from "./auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const token = await signupService(req.body);
    res.status(201).json(token);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await loginService(req.body);
    res.status(200).json(token);
  } catch (err) {
    next(err);
  }
};
