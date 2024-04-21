import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import { status } from "@/constants/http";
import { UserRoles } from "@/constants/user-roles";
import { respondError } from "@/helpers/response";
import * as authService from "@/services/auth";

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization?.split(" ")?.[1];

  if (!token) {
    return respondError(
      res,
      status.HTTP_401_UNAUTHORIZED,
      "No auth token provided.",
    );
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authService.getUserProfile(decoded.sub);

    if (user) {
      req.user = user;
      return next();
    }

    return respondError(
      res,
      status.HTTP_403_FORBIDDEN,
      "You do not have permission to perform this action.",
    );
  } catch (error) {
    return respondError(res, status.HTTP_401_UNAUTHORIZED, "Invalid token.");
  }
};

export const isUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization?.split(" ")?.[1];

  if (!token) {
    return respondError(
      res,
      status.HTTP_401_UNAUTHORIZED,
      "No auth token provided.",
    );
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authService.getUserProfile(decoded.sub);

    if (user && user?.role === UserRoles.USER) {
      req.user = user;
      return next();
    }

    return respondError(
      res,
      status.HTTP_403_FORBIDDEN,
      "You do not have permission to perform this action.",
    );
  } catch (error) {
    return respondError(res, status.HTTP_401_UNAUTHORIZED, "Invalid token.");
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization?.split(" ")?.[1];

  if (!token) {
    return respondError(
      res,
      status.HTTP_401_UNAUTHORIZED,
      "No auth token provided.",
    );
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authService.getUserProfile(decoded.sub);

    if (
      user &&
      (user?.role === UserRoles.ADMIN || user?.role === UserRoles.SUPER_ADMIN)
    ) {
      req.user = user;
      return next();
    }

    return respondError(
      res,
      status.HTTP_403_FORBIDDEN,
      "You do not have permission to perform this action.",
    );
  } catch (error) {
    return respondError(res, status.HTTP_401_UNAUTHORIZED, "Invalid token.");
  }
};

export const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization?.split(" ")?.[1];

  if (!token) {
    return respondError(
      res,
      status.HTTP_401_UNAUTHORIZED,
      "No auth token provided.",
    );
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authService.getUserProfile(decoded.sub);

    if (user && user?.role === UserRoles.SUPER_ADMIN) {
      req.user = user;
      return next();
    }

    return respondError(
      res,
      status.HTTP_403_FORBIDDEN,
      "You do not have permission to perform this action.",
    );
  } catch (error) {
    return respondError(res, status.HTTP_401_UNAUTHORIZED, "Invalid token.");
  }
};
