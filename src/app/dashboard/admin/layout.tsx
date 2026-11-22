import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
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
    console.error("AdminLayout auth session error:", err);
  }

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as any).role !== "admin") {
    redirect("/dashboard/customer");
  }

  return <>{children}</>;
}
