import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/getServerSession";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as any).role === "admin") {
    redirect("/dashboard/admin");
  }

  return <>{children}</>;
}
