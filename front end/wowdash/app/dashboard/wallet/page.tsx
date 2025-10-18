import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { getWalletBalance, getWithdrawalHistory, requestWithdrawal } from "@/app/actions/wallet";
import TransactionHistoryTable from "@/components/table/transaction-history-table";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const walletData = await getWalletBalance();
  const withdrawals = await getWithdrawalHistory();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wallet & Balance</h1>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <h3 className="text-2xl font-bold mt-2">
                  ${walletData?.balance?.toFixed(2) || "0.00"}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-2">
                  ${walletData?.totalEarnings?.toFixed(2) || "0.00"}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Balance</p>
                <h3 className="text-2xl font-bold mt-2">
                  ${walletData?.pendingBalance?.toFixed(2) || "0.00"}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                <h3 className="text-2xl font-bold mt-2">
                  ${walletData?.totalWithdrawn?.toFixed(2) || "0.00"}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Form */}
      <Card className="card">
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={requestWithdrawal} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USDT)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="20"
                  placeholder="Minimum $20 USDT"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum withdrawal: $20 USDT
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <select
                  id="network"
                  name="network"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="TRC20">TRC20 (Tron)</option>
                  <option value="ERC20">ERC20 (Ethereum)</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="destinationAddress">Wallet Address</Label>
                <Input
                  id="destinationAddress"
                  name="destinationAddress"
                  type="text"
                  placeholder="Enter your USDT wallet address"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Request Withdrawal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card className="card">
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals && withdrawals.length > 0 ? (
            <div className="space-y-4">
              {withdrawals.map((withdrawal: any) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">${withdrawal.amount.toFixed(2)} USDT</p>
                    <p className="text-sm text-muted-foreground">
                      {withdrawal.network} • {new Date(withdrawal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        withdrawal.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : withdrawal.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No withdrawal history yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
