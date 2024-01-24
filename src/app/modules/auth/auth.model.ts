import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import config from "../../config";
import { AuthModel, AuthType, PasswordHistoryType } from "./auth.interface";
import { role } from "./auth.constant";
import { modelName } from "../../constants/modelName";

const changePasswordHistorySchema = new Schema<PasswordHistoryType>(
  {
    password: {
      type: String,
      required: [true, "Password History Password is required"],
    },
  },
  { timestamps: true }
);

const authSchema = new Schema<AuthType, AuthModel>(
  {
    username: {
      type: String,
      required: [true, "User Name is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      maxlength: [20, "Password can not be more than 20 characters"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    role: {
      type: String,
      enum: [role.admin, role.user],
      default: role.user,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    changePasswordHistory: {
      type: [changePasswordHistorySchema],
      select: false,
    },
  },
  { timestamps: true }
);

//hashed a password
authSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

//hashed a password
changePasswordHistorySchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

//delete password form response
authSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.changePasswordHistory;
  return user;
};
//check user already exists or not
authSchema.statics.isUserExists = async function (username: string) {
  const existingUser = await Auth.findOne({ username }).select("+password");
  return existingUser;
};

authSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

authSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const Auth = model<AuthType, AuthModel>(modelName.Auth, authSchema);
