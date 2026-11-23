import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/getServerSession";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const role = ((session.user as any).role || "customer") as "admin" | "customer";

  return (
    <div className="min-h-screen bg-muted/20 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <DashboardSidebar role={role} />
          <main className="flex-1 w-full overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
