"use client";

import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, DollarSign, Calendar, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { Input } from "@/components/ui/input";
import type { ITransaction } from "@/lib/types/transaction";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        const token = await getTokenFromClient();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        const res = await fetch(`${apiUrl}/payment/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        toast.error("Failed to load payment transactions");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      tx.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      tx.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      tx.stripeSessionId?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = transactions
    .filter((tx) => tx.status === "paid")
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Payment Transactions & Revenue Audit
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Verified Stripe transaction logs. Payment records are strictly read-only and immutable.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-right">
            <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
              Total Stripe Revenue
            </span>
            <p className="text-xl font-serif font-bold text-emerald-900">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by customer, service or session ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs bg-card"
        />
      </div>

      {loading ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="size-4 animate-spin text-amber-600" />
          Loading verified transactions...
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <CreditCard className="mx-auto size-10 text-muted-foreground/60 mb-3" />
          <p className="text-sm font-semibold text-foreground">No transactions found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Completed Stripe checkout sessions will automatically be recorded here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-muted/40 uppercase tracking-wider text-[11px] text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Treatment / Service</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Stripe Session ID</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredTransactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-foreground text-sm">{tx.customerName}</p>
                    <p className="text-muted-foreground text-[11px]">{tx.customerEmail}</p>
                  </td>

                  <td className="px-4 py-3.5 font-medium text-foreground">
                    {tx.serviceName}
                  </td>

                  <td className="px-4 py-3.5 font-bold text-foreground text-sm">
                    ${tx.amount.toFixed(2)}{" "}
                    <span className="text-[10px] font-normal text-muted-foreground uppercase">
                      {tx.currency}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className="font-mono text-[11px] text-muted-foreground bg-muted px-2 py-1 rounded select-all cursor-pointer"
                      title={tx.stripeSessionId}
                    >
                      {tx.stripeSessionId.length > 20
                        ? `${tx.stripeSessionId.slice(0, 10)}...${tx.stripeSessionId.slice(-8)}`
                        : tx.stripeSessionId}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="size-3" />
                      {tx.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right text-muted-foreground text-[11px] whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
