import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import {
  JWT_EXPIRY_ACCESS_IN_SEC,
  JWT_EXPIRY_REFRESH_IN_SEC,
  JWT_SECRET,
} from "@/constants/env";
import { status } from "@/constants/http";
import { User } from "@/entities/user";
import * as responseHelper from "@/helpers/response";
import * as authService from "@/services/auth";

export const getCurrentUserProfile = async (req: Request, res: Response) =>
  responseHelper.respondSuccess(
    res,
    status.HTTP_200_OK,
    "Successfully got profile.",
    req.user,
  );

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const existingUser = await authService.getUserByEmail(
      req.validatedData.email,
    );

    if (existingUser) {
      return responseHelper.respondError(
        res,
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "Sorry, email with this user already exists.",
      );
    }

    const user = await authService.registerUser(req.validatedData);

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Registration successful.",
      user,
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.getUserByEmail(req.validatedData.email);

    if (!user) {
      return responseHelper.respondError(
        res,
        status.HTTP_404_NOT_FOUND,
        "Sorry, user with this email does not exist.",
      );
    }

    const passwordMatched = await User.comparePasswords(
      req.validatedData.password,
      user.password,
    );

    if (!passwordMatched) {
      return responseHelper.respondError(
        res,
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "Invalid password.",
      );
    }

    if (!user.verified) {
      return responseHelper.respondError(
        res,
        status.HTTP_400_BAD_REQUEST,
        "Sorry, your account is not verified. Please check your email to verify your account.",
      );
    }

    // generate token
    const jwtPayload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = jwt.sign(
      {
        ...jwtPayload,
        type: "access",
      },
      process.env[JWT_SECRET],
      {
        expiresIn: +process.env[JWT_EXPIRY_ACCESS_IN_SEC],
      },
    );

    const refreshToken = jwt.sign(
      {
        ...jwtPayload,
        type: "refresh",
      },
      process.env[JWT_SECRET],
      {
        expiresIn: +process.env[JWT_EXPIRY_REFRESH_IN_SEC],
      },
    );

    const { password, ...userKeys } = user;

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Login successful.",
      {
        accessToken,
        refreshToken,
        user: userKeys,
      },
    );
  } catch (error) {
    next(error);
  }
};

export const getNewToken = async (req: Request, res: Response) => {
  try {
    const payload: any = jwt.verify(
      req.validatedData.refreshToken,
      process.env[JWT_SECRET],
    );

    if (payload?.type !== "refresh") {
      throw new Error();
    }

    const accessToken = jwt.sign(
      {
        email: payload.email,
        sub: payload.sub,
        type: "access",
      },
      process.env[JWT_SECRET],
      {
        expiresIn: +process.env[JWT_EXPIRY_ACCESS_IN_SEC],
      },
    );

    responseHelper.respondSuccess(
      res,
      status.HTTP_200_OK,
      "Token refresh successful.",
      {
        accessToken,
      },
    );
  } catch (error) {
    responseHelper.respondError(
      res,
      status.HTTP_422_UNPROCESSABLE_ENTITY,
      "Invalid token.",
    );
  }
};
