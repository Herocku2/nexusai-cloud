import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPendingDepositsAdmin, approveDeposit } from "@/app/actions/admin-courses";
import { CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminDepositsPage() {
  const deposits = await getPendingDepositsAdmin();

  async function handleApprove(formData: FormData) {
    'use server'
    const transactionId = formData.get('transactionId') as string;
    await approveDeposit(parseInt(transactionId));
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Deposit Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve pending USDT deposits
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {deposits.length} Pending
        </Badge>
      </div>

      {deposits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Pending Deposits</h3>
            <p className="text-muted-foreground">
              All deposits have been processed
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {deposits.map((deposit: any) => (
            <Card key={deposit.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {deposit.user?.first_name} {deposit.user?.last_name}
                      <Badge variant="outline" className="ml-2">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      User ID: {deposit.user_id}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                      <DollarSign className="w-6 h-6" />
                      {Number(deposit.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">USDT</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
                    <p className="text-sm font-mono mt-1 break-all">
                      {deposit.metadata?.tx_hash || deposit.tx_hash || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Network</p>
                    <p className="text-sm mt-1">
                      {deposit.metadata?.network || 'TRC20'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                    <p className="text-sm mt-1">
                      {new Date(deposit.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm mt-1">
                      {deposit.notes || 'No notes'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <form action={handleApprove} className="flex-1">
                    <input type="hidden" name="transactionId" value={deposit.id} />
                    <Button 
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Deposit
                    </Button>
                  </form>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
