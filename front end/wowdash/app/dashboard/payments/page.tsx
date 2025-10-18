import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/label";
import { Label } from "@/components/ui/label";
import { DollarSign, ArrowDownCircle, Clock, CheckCircle2, Copy } from "lucide-react";
import { createDepositRequest, getDepositAddress, getPendingDeposits, getPaymentStats, activateMembership } from "@/app/actions/payments";
import { getProfile } from "@/app/actions/profile";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();
  const addresses = await getDepositAddress();
  const pendingDeposits = await getPendingDeposits();
  const stats = await getPaymentStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pagos & Depósitos</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Depositado</p>
                <h3 className="text-2xl font-bold mt-2">${stats.totalDeposits.toFixed(2)}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <ArrowDownCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Retirado</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalWithdrawals}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transacciones Pendientes</p>
                <h3 className="text-2xl font-bold mt-2">{stats.pendingTransactions}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activar Membresía */}
      {profile?.status !== 'active' && (
        <Card className="card border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Activar Membresía
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Para comenzar a ganar comisiones, debes activar tu membresía con $100 USDT.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Beneficios de la Membresía:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Acceso al sistema de comisiones Binary MLM</li>
                  <li>Gana hasta 50% en comisiones binarias</li>
                  <li>Bono de inicio rápido: 40% L1 + 8% L2</li>
                  <li>Bono de igualación hasta 20 niveles</li>
                  <li>Acceso completo a la Academia</li>
                </ul>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tu Balance</p>
                  <p className="text-2xl font-bold">${Number(profile?.balance || 0).toFixed(2)}</p>
                </div>
                <form action={activateMembership}>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={Number(profile?.balance || 0) < 100}
                  >
                    Activar Membresía ($100)
                  </Button>
                </form>
              </div>
              {Number(profile?.balance || 0) < 100 && (
                <p className="text-sm text-yellow-600">
                  Necesitas depositar al menos $100 USDT para activar tu membresía
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deposit Instructions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card">
          <CardHeader>
            <CardTitle>Depositar USDT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Red TRC20 (Tron) - Recomendada</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    readOnly
                    value={addresses.TRC20}
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(addresses.TRC20)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Comisión baja, confirmación rápida
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold">Red ERC20 (Ethereum)</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    readOnly
                    value={addresses.ERC20}
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(addresses.ERC20)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Comisión más alta, red principal de Ethereum
                </p>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Importante
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Solo envía USDT a estas direcciones</li>
                <li>• Verifica bien la red antes de enviar</li>
                <li>• Depósito mínimo: $100 USDT</li>
                <li>• Confirmación: 1-10 minutos</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Report Deposit Form */}
        <Card className="card">
          <CardHeader>
            <CardTitle>Reportar Depósito</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDepositRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Cantidad (USDT)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="100"
                  placeholder="100.00"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo $100 USDT
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="network">Red Utilizada</Label>
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

              <div className="space-y-2">
                <Label htmlFor="txHash">Transaction Hash (TX ID)</Label>
                <Input
                  id="txHash"
                  name="txHash"
                  type="text"
                  placeholder="0x..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Copia el hash de la transacción desde tu wallet
                </p>
              </div>

              <Button type="submit" className="w-full">
                Reportar Depósito
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Pending Deposits */}
      {pendingDeposits.length > 0 && (
        <Card className="card">
          <CardHeader>
            <CardTitle>Depósitos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDeposits.map((deposit: any) => (
                <div
                  key={deposit.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">${deposit.amount.toFixed(2)} USDT</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(deposit.created_at).toLocaleDateString()}
                    </p>
                    {deposit.metadata?.tx_hash && (
                      <p className="text-xs font-mono text-muted-foreground">
                        TX: {deposit.metadata.tx_hash.slice(0, 10)}...
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                      {deposit.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
