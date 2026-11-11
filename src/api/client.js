import axios from "axios";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/lib/tokens";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const THROUGH_NGROK = /\bngrok[\w-]*\.(dev|io|app)$/i.test(
  (() => {
    try {
      return new URL(API_BASE_URL).hostname;
    } catch {
      return "";
    }
  })()
);

export const client = axios.create({
  baseURL: API_BASE_URL,
  ...(THROUGH_NGROK
    ? { headers: { "ngrok-skip-browser-warning": "true" } }
    : {}),
});

client.interceptors.request.use((config) => {
  if (config.skipAuth) {
    return config;
  }
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

const onSessionLost = () => {
  clearTokens();
  window.dispatchEvent(new CustomEvent("psst:session-expired"));
};

const refreshSession = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const { data } = await axios.post(
    `${API_BASE_URL}/user/rotate-token`,
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } }
  );

  const tokens = data?.data;
  if (!tokens?.access_token) {
    throw new Error("Rotate token returned no credentials");
  }
  saveTokens(tokens);
  return tokens.access_token;
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    const canRetry =
      status === 401 &&
      original &&
      !original._retried &&
      !original.skipAuth &&
      !original.url?.includes("/user/rotate-token") &&
      getRefreshToken();

    if (canRetry) {
      original._retried = true;
      try {
        refreshPromise = refreshPromise ?? refreshSession();
        const accessToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return client(original);
      } catch {
        onSessionLost();
      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(toApiError(error));
  }
);

export const toApiError = (error) => {
  const payload = error.response?.data;

  const apiError = new Error(
    payload?.error_message ||
      payload?.message ||
      error.message ||
      "Something went wrong"
  );

  apiError.status = error.response?.status ?? 0;
  apiError.issues = Array.isArray(payload?.issues) ? payload.issues : [];

  apiError.fieldErrors = apiError.issues.reduce((fields, issue) => {
    const name = issue.path?.[issue.path.length - 1];
    if (name && !fields[name]) {
      fields[name] = issue.message;
    }
    return fields;
  }, {});

  if (!error.response) {
    apiError.message =
      "Cannot reach the Psst server. Is the backend running?";
  }

  return apiError;
};

export const unwrap = (response) => response.data?.data;
