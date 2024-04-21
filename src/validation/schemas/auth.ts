import { z } from "zod";

export const RegisterUserSchema = z.object({
  fullName: z.string({
    required_error: "Full name is required",
    invalid_type_error: "Full name must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({
      message: "Email must be a valid email",
    }),
  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Password must be a string.",
    })
    .min(6, {
      message: "Password must be at least 6 characters.",
    }),
});

export const LoginUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Email must be a string.",
    })
    .email({
      message: "Email must be a valid email.",
    }),
  password: z.string({
    required_error: "Password is required.",
    invalid_type_error: "Password must be a string.",
  }),
});

export const GetNewTokenSchema = z.object({
  refreshToken: z.string({
    required_error: "Refresh token is required.",
    invalid_type_error: "Refresh token must be a string.",
  }),
});
