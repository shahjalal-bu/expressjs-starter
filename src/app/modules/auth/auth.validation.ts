import { role } from "./auth.constant";
import { z } from "zod";

//validate password
const isStrongPassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasDigit &&
    hasSpecialChar
  );
};

const passwordSchema = z.string().refine((data) => isStrongPassword(data), {
  message:
    "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
});

const registerUserValidationSchema = z.object({
  username: z.string().max(20),
  password: passwordSchema,
  email: z.string().email(),
  role: z.enum([role.admin, role.user]).optional(),
});

const loginUserValidationSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

const changePasswordValidationSchema = z.object({
  currentPassword: z.string({
    required_error: "Current password  is required",
  }),
  newPassword: z.string({
    required_error: "New password  is required",
  }),
});

export const authValidationSchema = {
  registerUserValidationSchema,
  loginUserValidationSchema,
  changePasswordValidationSchema,
};
