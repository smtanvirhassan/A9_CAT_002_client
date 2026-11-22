import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_CLIENT_URL || "https://client-one-psi.vercel.app",
  plugins: [jwtClient()],
});
