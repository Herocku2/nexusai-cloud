import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Check, X } from "lucide-react";
import { getPendingWithdrawals, approveWithdrawal, rejectWithdrawal } from "@/app/actions/admin-courses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await getPendingWithdrawals();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
          <p className="text-muted-foreground">Review and process pending withdrawals</p>
        </div>
      </div>

      <Card className="card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pending Withdrawals ({withdrawals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
              <TableRow className="border-0">
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
                  User
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Amount
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Network
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Address
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Date
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {withdrawals.map((withdrawal: any, index: number) => {
                const isLastRow = index === withdrawals.length - 1;
                return (
                  <TableRow key={withdrawal.id}>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "rounded-bl-lg" : ""
                      }`}
                    >
                      <div>
                        <h6 className="text-base mb-0 font-medium">
                          {withdrawal.user?.first_name} {withdrawal.user?.last_name}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          {withdrawal.user?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      <span className="font-semibold text-lg">
                        ${withdrawal.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      {withdrawal.network}
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      <code className="text-xs">
                        {withdrawal.destination_address.slice(0, 10)}...{withdrawal.destination_address.slice(-8)}
                      </code>
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "rounded-br-lg" : ""
                      } text-center`}
                    >
                      <div className="flex justify-center gap-2">
                        <form action={async (formData: FormData) => {
                          'use server'
                          const txHash = formData.get('txHash') as string
                          await approveWithdrawal(withdrawal.id, txHash)
                        }}>
                          <Input
                            name="txHash"
                            placeholder="TX Hash"
                            className="w-32 h-8 text-xs"
                            required
                          />
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 mt-1"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </form>
                        <form action={async (formData: FormData) => {
                          'use server'
                          const reason = formData.get('reason') as string || 'Rejected by admin'
                          await rejectWithdrawal(withdrawal.id, reason)
                        }}>
                          <Button
                            type="submit"
                            size="sm"
                            variant="destructive"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {withdrawals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending withdrawals</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
