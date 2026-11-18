"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users, Mail, Phone, ShieldCheck, ShieldAlert, Ban, CheckCircle2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IUser } from "@/lib/types/user";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (user: IUser) => {
    const newStatus = !user.isBlocked;
    const confirmMsg = newStatus
      ? `Are you sure you want to block ${user.name}? They will lose access to all protected features.`
      : `Unblock ${user.name}?`;

    if (!confirm(confirmMsg)) return;

    const id = user._id || user.id;
    if (!id) return;

    setActionUserId(id);
    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

      const res = await fetch(`${apiUrl}/users/${id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.msg || "Failed to update user block status");
        return;
      }

      toast.success(newStatus ? `User ${user.name} is now blocked.` : `User ${user.name} has been unblocked.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle block status");
    } finally {
      setActionUserId(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Registered Customers & Users
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            View user profiles and securely control platform access permissions.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs bg-card"
          />
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-amber-600" />
          Loading user records...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Users className="mx-auto size-10 text-muted-foreground/60 mb-3" />
          <p className="text-sm font-semibold text-foreground">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 uppercase tracking-wider text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Customer Name & Avatar</th>
                <th className="px-4 py-3.5">Email Address</th>
                <th className="px-4 py-3.5">Contact Phone</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Access Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((u) => {
                const id = u._id || u.id;
                const isAdmin = u.role === "admin";
                const isBlocked = !!u.isBlocked;
                const isProcessing = actionUserId === id;

                return (
                  <tr key={id} className="hover:bg-muted/20 transition-colors">
                    {/* User Info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted border border-border">
                          {u.image ? (
                            <Image
                              src={u.image}
                              alt={u.name || "User"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-amber-100 text-amber-800 font-bold text-xs">
                              {(u.name || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{u.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 font-medium text-foreground">
                      {u.email}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {u.phone || "Not provided"}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          isAdmin
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-stone-100 text-stone-700 border border-stone-200"
                        }`}
                      >
                        {u.role || "customer"}
                      </span>
                    </td>

                    {/* Access Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                          isBlocked
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isBlocked ? <Ban className="size-3" /> : <ShieldCheck className="size-3" />}
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      {isAdmin ? (
                        <span className="text-[11px] text-muted-foreground italic">Admin Account</span>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isProcessing}
                          onClick={() => handleToggleBlock(u)}
                          className={`text-xs h-7 px-3 ${
                            isBlocked
                              ? "text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                              : "text-rose-700 border-rose-300 hover:bg-rose-50"
                          }`}
                        >
                          {isProcessing ? (
                            <Loader2 className="size-3 animate-spin mr-1" />
                          ) : isBlocked ? (
                            <CheckCircle2 className="size-3 mr-1" />
                          ) : (
                            <Ban className="size-3 mr-1" />
                          )}
                          {isBlocked ? "Unblock User" : "Block User"}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
