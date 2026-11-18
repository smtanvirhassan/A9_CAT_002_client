import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
  try {
    const { data } = await authClient.token();
    return data?.token;
  } catch (err) {
    return null;
  }
};
