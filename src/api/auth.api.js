import { client, unwrap } from "./client";

export const signup = async (payload) =>
  unwrap(await client.post("/auth/signup", payload, { skipAuth: true }));

export const confirmEmail = async ({ email, otp }) =>
  unwrap(
    await client.patch("/auth/confirm-email", { email, otp }, { skipAuth: true })
  );

export const resendConfirmEmail = async ({ email }) =>
  unwrap(
    await client.patch("/auth/resend-confirm-email", { email }, { skipAuth: true })
  );

export const login = async ({ email, password }) =>
  unwrap(await client.post("/auth/login", { email, password }, { skipAuth: true }));

export const confirmLogin = async ({ email, otp }) =>
  unwrap(
    await client.patch("/auth/confirm-login", { email, otp }, { skipAuth: true })
  );

export const requestForgotPasswordCode = async ({ email }) =>
  unwrap(
    await client.post(
      "/auth/request-forgot-password-code",
      { email },
      { skipAuth: true }
    )
  );

export const verifyForgotPasswordCode = async ({ email, otp }) =>
  unwrap(
    await client.post(
      "/auth/verify-forgot-password",
      { email, otp },
      { skipAuth: true }
    )
  );

export const resetForgotPassword = async ({ email, otp, password, confirmPassword }) =>
  unwrap(
    await client.patch(
      "/auth/reset-forgot-password",
      { email, otp, password, confirmPassword },
      { skipAuth: true }
    )
  );

export const loginWithGoogle = async ({ idToken }) =>
  unwrap(await client.post("/auth/signup-with-gmail", { idToken }, { skipAuth: true }));
