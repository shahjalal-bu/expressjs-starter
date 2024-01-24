/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export type AuthType = {
  _id?: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  role?: "user" | "admin";
  changePasswordHistory?: PasswordHistoryType[];
  passwordChangedAt?: Date;
};

export type PasswordHistoryType = {
  _id?: Types.ObjectId;
  password: string;
  updatedAt?: Date;
};
export type LoginUserType = {
  username: string;
  password: string;
};

export type ChangePasswordType = {
  currentPassword: string;
  newPassword: string;
};

export interface AuthModel extends Model<AuthType> {
  isUserExists(username: string): Promise<AuthType | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}

export interface AuthModel extends Model<AuthType> {
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
}
