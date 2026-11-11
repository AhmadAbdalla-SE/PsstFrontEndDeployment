const ACCESS_KEY = "psst.access_token";
const REFRESH_KEY = "psst.refresh_token";

const read = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
  }
};

export const getAccessToken = () => read(ACCESS_KEY);
export const getRefreshToken = () => read(REFRESH_KEY);

export const saveTokens = ({ access_token, refresh_token } = {}) => {
  write(ACCESS_KEY, access_token);
  write(REFRESH_KEY, refresh_token);
};

export const clearTokens = () => {
  write(ACCESS_KEY, null);
  write(REFRESH_KEY, null);
};

export const hasSession = () => Boolean(getAccessToken());
