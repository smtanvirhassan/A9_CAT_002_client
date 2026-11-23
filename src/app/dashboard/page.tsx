import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/getServerSession";

export default async function DashboardIndexPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  if (role === "admin") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/customer");
  }
}
