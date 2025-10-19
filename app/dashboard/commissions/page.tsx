import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Zap, Users2, TrendingUp } from "lucide-react";
import { getCommissionsByType, getCommissionHistory } from "@/app/actions/wallet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CommissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const commissionsByType = await getCommissionsByType();
  const commissionHistory = await getCommissionHistory();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Commissions & Earnings</h1>
      </div>

      {/* Commission Type Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fast Start Bonus</p>
                <h3 className="text-2xl font-bold mt-2">
                  ${commissionsByType?.fast_start?.toFixed(2) || "0.00"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  40% L1 + 8% L2
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Binary Bonus</p>
                <h3 className="text-2xl font-bold mt-2">
                  ${commissionsByType?.binary?.toFixed(2) || "0.00"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  50% of weaker leg
                </p>
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
                <p className="text-sm text-muted-foreground">Matching Bonus</p>
                <h3 className="text-2xl font-bold mt-2">
                  ${commissionsByType?.matching?.toFixed(2) || "0.00"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Up to 20% depth
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compensation Plan Info */}
      <Card className="card">
        <CardHeader>
          <CardTitle>Nexus AI Compensation Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Fast Start */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold">Fast Start Bonus</h4>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Level 1: 40% ($40 per sale)</li>
                <li>• Level 2: 8% ($8 per sale)</li>
                <li>• Instant payment on direct referrals</li>
              </ul>
            </div>

            {/* Binary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold">Binary Bonus</h4>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• 50% of weaker leg volume</li>
                <li>• Unlimited depth</li>
                <li>• Weekly payout cycles</li>
              </ul>
            </div>

            {/* Matching */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users2 className="h-5 w-5 text-purple-500" />
                <h4 className="font-semibold">Matching Bonus</h4>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Match binary earnings of your team</li>
                <li>• Rank-based percentage (5-20%)</li>
                <li>• Up to 20 levels deep</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission History Table */}
      <Card className="card">
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
              <TableRow className="border-0">
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
                  Date
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Type
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Description
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Amount
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {commissionHistory && commissionHistory.length > 0 ? (
                commissionHistory.map((commission: any, index: number) => {
                  const isLastRow = index === commissionHistory.length - 1;
                  return (
                    <TableRow key={commission.id}>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "rounded-bl-lg" : ""
                        }`}
                      >
                        {new Date(commission.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "" : ""
                        }`}
                      >
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            commission.commission_type === "fast_start"
                              ? "bg-green-500/10 text-green-500"
                              : commission.commission_type === "binary"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-purple-500/10 text-purple-500"
                          }`}
                        >
                          {commission.commission_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "" : ""
                        }`}
                      >
                        {commission.description || 'Commission earned'}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "" : ""
                        }`}
                      >
                        <span className="font-semibold text-green-600">
                          +${commission.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "rounded-br-lg" : ""
                        } text-center`}
                      >
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            commission.status === "paid"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {commission.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No commission history yet. Start referring to earn!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
