import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("the user is", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    message: "Unauthorized",
  });
};
