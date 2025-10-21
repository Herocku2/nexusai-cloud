'use client'

import { AdminBinaryNode } from '@/app/actions/admin-binary-tree'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  User,
  Mail,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Crown,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BarChart3,
  Wallet,
  Award,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface AdminBinaryNodeDetailsModalProps {
  node: AdminBinaryNode | null
  isOpen: boolean
  onClose: () => void
  onNavigate?: (userId: string) => void
}

export default function AdminBinaryNodeDetailsModal({
  node,
  isOpen,
  onClose,
  onNavigate,
}: AdminBinaryNodeDetailsModalProps) {
  if (!node) return null

  const getInitials = () => {
    const first = node.firstName?.[0] || ''
    const last = node.lastName?.[0] || ''
    return (first + last).toUpperCase() || node.email[0].toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es })
  }

  const balanceRatio = node.rightVolume > 0 
    ? ((node.leftVolume / node.rightVolume) * 100).toFixed(1)
    : '100.0'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={
                node.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span>
                  {node.firstName && node.lastName 
                    ? `${node.firstName} ${node.lastName}`
                    : node.email}
                </span>
                {node.isActive ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                {node.email}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detalles completos del nodo en el árbol binario
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Badges de estado */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={node.position === 'left' ? 'default' : 'secondary'}>
              Posición: {node.position === 'left' ? 'Izquierda' : 'Derecha'}
            </Badge>
            <Badge variant="outline">Nivel {node.level}</Badge>
            {node.membershipLevel && (
              <Badge className="bg-yellow-500">
                <Crown className="h-3 w-3 mr-1" />
                {node.membershipLevel}
              </Badge>
            )}
            <Badge variant={node.isActive ? 'default' : 'secondary'}>
              {node.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          <Separator />

          {/* Información del perfil */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Usuario
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">ID de Usuario</div>
                <div className="text-sm font-mono">{node.userId.substring(0, 8)}...</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">ID de Posición</div>
                <div className="text-sm font-mono">{node.positionId}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-sm flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {node.email}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Fecha de Registro</div>
                <div className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(node.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información del árbol binario */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estructura del Árbol
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Volumen Izquierdo</div>
                <div className="text-2xl font-bold text-green-600">
                  {node.leftVolume.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Volumen Derecho</div>
                <div className="text-2xl font-bold text-blue-600">
                  {node.rightVolume.toFixed(2)}
                </div>
              </div>
              <div className="col-span-2 p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Balance del Árbol</div>
                <div className="text-xl font-bold">
                  {balanceRatio}% (Izq/Der)
                </div>
                <div className="mt-2 w-full bg-background rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ 
                      width: `${Math.min(parseFloat(balanceRatio), 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información financiera */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Información Financiera
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Inversión Total
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(node.totalInvestment)}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Comisiones Ganadas
                </div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(node.totalCommissions)}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Balance Actual
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(node.balance)}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Referidos Directos
                </div>
                <div className="text-xl font-bold">
                  {node.directReferrals}
                </div>
              </div>
            </div>
          </div>

          {/* Información del sponsor */}
          {node.sponsorName && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Sponsor
                </h3>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Patrocinador</div>
                  <div className="text-lg font-semibold">{node.sponsorName}</div>
                  {node.sponsorId && (
                    <div className="text-sm text-muted-foreground mt-1 font-mono">
                      ID: {node.sponsorId.substring(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Ruta en el árbol */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ruta en el Árbol
            </h3>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-mono">{node.path}</div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            {onNavigate && (
              <Button 
                onClick={() => {
                  onNavigate(node.userId)
                  onClose()
                }}
                className="flex-1 gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Navegar a este nodo
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
