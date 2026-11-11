import { LogoutAction } from "@/lib/enums";
import { client, unwrap } from "./client";

export const getProfile = async () => unwrap(await client.get("/user/"));

export const updateProfile = async (payload) =>
  unwrap(await client.patch("/user/", payload));

export const uploadProfileImage = async (file) => {
  const form = new FormData();
  form.append("attachment", file);
  return unwrap(await client.patch("/user/profile-image", form));
};

export const logout = async (action = LogoutAction.THIS_DEVICE) =>
  unwrap(await client.post("/user/logout", { action }));

export const requestTwoFactor = async () =>
  unwrap(await client.patch("/user/request-2fa"));

export const verifyTwoFactor = async ({ otp }) =>
  unwrap(await client.patch("/user/verify-2fa", { otp }));

export const getPublicProfile = async (userId) =>
  unwrap(await client.get(`/user/${userId}/public`, { skipAuth: true }));
