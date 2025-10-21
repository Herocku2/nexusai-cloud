'use client'

import { DashboardStats, RecentCommission, RecentTransaction } from '@/app/actions/dashboard-stats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface DashboardContentProps {
  stats: DashboardStats
  recentCommissions: RecentCommission[]
  recentTransactions: RecentTransaction[]
}

export default function DashboardContent({ 
  stats, 
  recentCommissions, 
  recentTransactions 
}: DashboardContentProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMM, yyyy", { locale: es })
  }

  const getCommissionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      fast_start: 'Fast Start',
      binary: 'Binario',
      matching: 'Matching',
      direct: 'Directo',
    }
    return types[type] || type
  }

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      deposit: 'Depósito',
      withdrawal: 'Retiro',
      commission: 'Comisión',
      purchase: 'Compra',
      refund: 'Reembolso',
    }
    return types[type] || type
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive',
      cancelled: 'outline',
    }
    
    const labels: Record<string, string> = {
      paid: 'Pagado',
      pending: 'Pendiente',
      failed: 'Fallido',
      cancelled: 'Cancelado',
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Disponible</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.balance)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingCommissions > 0 && (
                <>+{formatCurrency(stats.pendingCommissions)} pendiente</>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.monthlyEarnings)} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipo Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeam}</div>
            <p className="text-xs text-muted-foreground">
              {stats.directReferrals} directos ({stats.activeReferrals} activos)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rango Actual</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentRank}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPV} PV
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progreso al siguiente rango */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso al Siguiente Rango</CardTitle>
          <CardDescription>
            {stats.nextRank === 'Máximo Rango' 
              ? '¡Has alcanzado el rango máximo!'
              : `Próximo: ${stats.nextRank}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={stats.progressToNextRank} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {stats.progressToNextRank}% completado
          </p>
        </CardContent>
      </Card>

      {/* Volumen Binario */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pierna Izquierda</CardTitle>
            <CardDescription>Volumen total acumulado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.leftVolume.toFixed(2)} PV
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pierna Derecha</CardTitle>
            <CardDescription>Volumen total acumulado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.rightVolume.toFixed(2)} PV
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de membresía */}
      {stats.hasActiveMembership && stats.membershipExpiryDate && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Membresía Activa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Tu membresía está activa hasta:{' '}
              <strong>{formatDate(stats.membershipExpiryDate)}</strong>
            </p>
          </CardContent>
        </Card>
      )}

      {!stats.hasActiveMembership && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Membresía Inactiva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Tu membresía ha expirado. Renueva para seguir ganando comisiones.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Comisiones recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Comisiones Recientes</CardTitle>
            <CardDescription>Últimas 5 comisiones recibidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCommissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay comisiones aún
                </p>
              ) : (
                recentCommissions.map((commission) => (
                  <div
                    key={commission.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getCommissionTypeLabel(commission.type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {commission.fromUser || formatDate(commission.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(commission.status)}
                      <div className="flex items-center text-green-600 font-semibold">
                        <ArrowUpRight className="h-4 w-4" />
                        {formatCurrency(commission.amount)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transacciones recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Transacciones Recientes</CardTitle>
            <CardDescription>Últimas 5 transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay transacciones aún
                </p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {getTransactionTypeLabel(transaction.type)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(transaction.status)}
                      <div className={`flex items-center font-semibold ${
                        transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'withdrawal' ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
