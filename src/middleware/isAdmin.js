import { AppError } from "../utils/AppError.js";

export const isAdmin = (req, res, next) => {
  return req.decoded.role != "admin"
    ? next(new AppError("you must be an admin", 403))
    : next();
};
