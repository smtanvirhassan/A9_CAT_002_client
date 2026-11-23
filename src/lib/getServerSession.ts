import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth";

export const getServerSession = cache(async () => {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const headerList = await headers();
      return await auth.api.getSession({
        headers: headerList,
      });
    } catch (err: any) {
      if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
      console.error(`getServerSession attempt ${attempt + 1} error:`, err?.message || err);
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 150));
        continue;
      }
      return null;
    }
  }
  return null;
});
