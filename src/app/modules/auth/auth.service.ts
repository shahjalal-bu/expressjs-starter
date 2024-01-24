import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { AuthType, ChangePasswordType, LoginUserType } from "./auth.interface";
import { Auth } from "./auth.model";
import { createToken } from "./auth.jwthelper";
import config from "../../config";
import { JwtPayload, Secret } from "jsonwebtoken";

const registerUserIntoDB = async (payload: AuthType) => {
  const payloadWithChangePasswordHistory = {
    ...payload,
    changePasswordHistory: [{ password: payload.password }],
  };
  const result = await Auth.create(payloadWithChangePasswordHistory);
  return result;
};

const loginUser = async (payload: LoginUserType) => {
  const isUserExist = await Auth.isUserExists(payload.username);
  //check user have in db
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  //check password match
  const isPasswordMatched = await Auth.isPasswordMatched(
    payload.password,
    isUserExist.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  const { _id, username, email, role } = isUserExist;

  const token = createToken(
    { _id: isUserExist._id, email, role },
    config.jwt_secret as Secret,
    config.jwt_expire as string
  );

  return {
    data: {
      _id,
      username,
      email,
      role,
    },
    token,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: ChangePasswordType
) => {
  //check user existence
  const currentUser = await Auth.findById(user?._id).select(
    "+password +changePasswordHistory"
  );
  if (!currentUser) {
    throw new AppError(httpStatus.MISDIRECTED_REQUEST, "Login Again!");
  }
  //check current password is match with current user password
  if (
    currentUser.password &&
    !(await Auth.isPasswordMatched(
      payload.currentPassword,
      currentUser.password
    ))
  ) {
    throw new AppError(
      httpStatus.MISDIRECTED_REQUEST,
      "Current Password is incorrect"
    );
  }

  // check new password isn't match with prev three password

  let isMatchedPasswordInCurrentUser = false;
  for (const prevPass of currentUser.changePasswordHistory || []) {
    const isMatched = await Auth.isPasswordMatched(
      payload.newPassword,
      prevPass.password
    );
    if (isMatched) {
      isMatchedPasswordInCurrentUser = true;
      break;
    }
  }

  if (isMatchedPasswordInCurrentUser) {
    throw new AppError(
      httpStatus.MISDIRECTED_REQUEST,
      "You can not change password with your previous password"
    );
  }

  if (
    currentUser.changePasswordHistory &&
    currentUser.changePasswordHistory.length === 3
  ) {
    // Sort the changePasswordHistory array based on the updatedAt property

    currentUser.changePasswordHistory.sort(
      (a, b) => (a.updatedAt?.getTime() || 0) - (b.updatedAt?.getTime() || 0)
    );

    // Remove the first element
    currentUser.changePasswordHistory.shift();
  }

  //change password and push to new password to changePasswordArray
  currentUser.password = payload.newPassword;
  currentUser.changePasswordHistory?.push({
    password: payload.newPassword,
  });
  const currentDate = new Date();
  currentUser.passwordChangedAt = currentDate;

  // Save the changes
  await currentUser.save();

  //fetch updated user
  const updatedUser = await Auth.findById(user?._id);
  return updatedUser;
};

export const AuthServices = {
  registerUserIntoDB,
  loginUser,
  changePassword,
};
