import { NextFunction, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";

const safeSanitizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // শুধু body sanitize করবে, query sanitize করবে না
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body); // body তে Mongo operators ($) remove
  }

  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params); // params sanitize
  }

  next(); // next middleware/callback
};

export default safeSanitizeMiddleware;
