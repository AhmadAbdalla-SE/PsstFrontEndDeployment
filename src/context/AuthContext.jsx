import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as userApi from "@/api/user.api";
import { LogoutAction } from "@/lib/enums";
import { clearSeen } from "@/lib/seen";
import { clearTokens, hasSession, saveTokens } from "@/lib/tokens";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(hasSession() ? "loading" : "guest");

  const readUser = (payload) => payload?.user ?? payload ?? null;

  const loadProfile = useCallback(async () => {
    const profile = readUser(await userApi.getProfile());
    setUser(profile);
    setStatus("authenticated");
    return profile;
  }, []);

  useEffect(() => {
    if (!hasSession()) {
      setStatus("guest");
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        const profile = readUser(await userApi.getProfile());
        if (!cancelled) {
          setUser(profile);
          setStatus("authenticated");
        }
      } catch {
        clearTokens();
        if (!cancelled) {
          setUser(null);
          setStatus("guest");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setStatus("guest");
    };
    window.addEventListener("psst:session-expired", onExpired);
    return () => window.removeEventListener("psst:session-expired", onExpired);
  }, []);

  const startSession = useCallback(
    async (tokens) => {
      saveTokens(tokens);
      setStatus("loading");
      try {
        return await loadProfile();
      } catch (error) {
        clearTokens();
        setUser(null);
        setStatus("guest");
        throw error;
      }
    },
    [loadProfile]
  );

  const logout = useCallback(async (action = LogoutAction.THIS_DEVICE) => {
    try {
      await userApi.logout(action);
    } catch {
    }
    clearTokens();
    clearSeen();
    setUser(null);
    setStatus("guest");
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      startSession,
      refreshProfile: loadProfile,
      setUser,
      logout,
    }),
    [user, status, startSession, loadProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
