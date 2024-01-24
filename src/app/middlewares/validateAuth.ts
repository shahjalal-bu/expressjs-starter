import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../errors/AppError";
import config from "../config";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Auth } from "../modules/auth/auth.model";

const validateAuth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
      }
      // verify token
      let verifiedUser = null;

      try {
        verifiedUser = jwt.verify(
          token,
          config.jwt_secret as Secret
        ) as JwtPayload;
      } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
      }

      // checking if the user is exist
      const user = await Auth.findOne({ _id: verifiedUser._id }).select(
        "+passwordChangedAt"
      );

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
      }

      if (
        user.passwordChangedAt &&
        Auth.isJWTIssuedBeforePasswordChanged(
          user.passwordChangedAt,
          verifiedUser.iat as number
        )
      ) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
      }

      // Attach user to the request object
      req.user = verifiedUser as JwtPayload;
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateAuth;
