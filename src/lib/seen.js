const KEYS = {
  messages: "psst.seen.messages",
  requests: "psst.seen.requests",
  conversations: "psst.seen.conversations",
};

const read = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
  }
};

export const getSeenCount = (section) => {
  const raw = read(KEYS[section]);
  const value = Number(raw);
  return raw === null || Number.isNaN(value) ? 0 : value;
};

export const baselineSeenCount = (section, total) => {
  const raw = read(KEYS[section]);
  const value = Number(raw);
  if (raw === null || Number.isNaN(value)) {
    const safe = Math.max(0, Number(total) || 0);
    write(KEYS[section], safe);
    return safe;
  }
  return value;
};

export const setSeenCount = (section, total) => {
  write(KEYS[section], Math.max(0, Number(total) || 0));
};

export const getSeenAt = (section) => {
  const raw = read(KEYS[section]);
  const value = raw ? Date.parse(raw) : NaN;
  if (Number.isNaN(value)) {
    const now = new Date();
    write(KEYS[section], now.toISOString());
    return now.getTime();
  }
  return value;
};

export const setSeenAt = (section, when = new Date()) => {
  write(KEYS[section], new Date(when).toISOString());
};

export const clearSeen = () => {
  Object.values(KEYS).forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
    }
  });
};
