import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") throw err;
    console.error("CustomerLayout auth session error:", err);
  }

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as any).role === "admin") {
    redirect("/dashboard/admin");
  }

  return <>{children}</>;
}
