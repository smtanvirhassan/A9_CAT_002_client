import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenFromServer = async () => {
  try {
    const jwtToken = await auth.api.getToken({
      headers: await headers(),
    });
    return jwtToken?.token;
  } catch (err) {
    return null;
  }
};
