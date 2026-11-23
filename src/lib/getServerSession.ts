import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "./auth";

export const getServerSession = cache(async () => {
  try {
    const headerList = await headers();
    return await auth.api.getSession({
      headers: headerList,
    });
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("getServerSession error:", err);
    return null;
  }
});
