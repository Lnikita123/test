import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMidd = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req?.headers?.authorization;
  console.log(authHeader);

  const [bearer, token] = (authHeader?.split(" ") || []) as [string, string];
  if (token) {
    next();
  } else {
    return res.status(401).send({ status: false, msg: "unauthorized" });
  }
};
