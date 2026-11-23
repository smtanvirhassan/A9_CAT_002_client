import { authClient } from "./auth-client";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export const getTokenFromClient = async (): Promise<string | null> => {
  const now = Date.now();
  if (cachedToken && tokenExpiry > now + 30000) {
    return cachedToken;
  }

  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("sb_jwt_token");
      const storedExp = Number(sessionStorage.getItem("sb_jwt_exp") || 0);
      if (stored && storedExp > now + 30000) {
        cachedToken = stored;
        tokenExpiry = storedExp;
        return stored;
      }
    } catch (e) {}
  }

  try {
    const { data } = await authClient.token();
    if (data?.token) {
      cachedToken = data.token;
      tokenExpiry = now + 10 * 60 * 1000;
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("sb_jwt_token", data.token);
          sessionStorage.setItem("sb_jwt_exp", String(tokenExpiry));
        } catch (e) {}
      }
      return data.token;
    }
    return cachedToken || null;
  } catch (err) {
    return cachedToken || null;
  }
};

export const clearTokenCache = () => {
  cachedToken = null;
  tokenExpiry = 0;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("sb_jwt_token");
      sessionStorage.removeItem("sb_jwt_exp");
    } catch (e) {}
  }
};
