'use client'

import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { AdminBinaryNode } from '@/app/actions/admin-binary-tree'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  User, 
  TrendingUp, 
  Users, 
  DollarSign,
  Crown,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BinaryNodeCardProps {
  data: {
    node: AdminBinaryNode
    onClick?: () => void
  }
}

function BinaryNodeCard({ data }: BinaryNodeCardProps) {
  const { node, onClick } = data

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

  return (
    <div 
      className={cn(
        "relative bg-card border-2 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer",
        "w-72 p-4",
        node.isActive 
          ? "border-green-500 hover:border-green-600" 
          : "border-gray-300 hover:border-gray-400 opacity-75"
      )}
      onClick={onClick}
    >
      {/* Handle superior (conexión desde el padre) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !w-3 !h-3"
      />

      {/* Header con Avatar y Estado */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className={cn(
              "text-sm font-bold",
              node.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
            )}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">
              {node.firstName && node.lastName 
                ? `${node.firstName} ${node.lastName}`
                : node.email}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {node.email}
            </div>
          </div>
        </div>
        
        {node.isActive ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </div>

      {/* Badges de posición y nivel */}
      <div className="flex gap-2 mb-3">
        <Badge variant={node.position === 'left' ? 'default' : 'secondary'} className="text-xs">
          {node.position === 'left' ? 'Izquierda' : 'Derecha'}
        </Badge>
        <Badge variant="outline" className="text-xs">
          Nivel {node.level}
        </Badge>
        {node.membershipLevel && (
          <Badge className="text-xs bg-yellow-500">
            <Crown className="h-3 w-3 mr-1" />
            {node.membershipLevel}
          </Badge>
        )}
      </div>

      {/* Estadísticas */}
      <div className="space-y-2 text-xs">
        {/* Volumen Binario */}
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span className="text-muted-foreground">Volumen</span>
          </div>
          <div className="flex gap-2 font-semibold">
            <span className="text-green-600">{node.leftVolume.toFixed(0)}</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-blue-600">{node.rightVolume.toFixed(0)}</span>
          </div>
        </div>

        {/* Referidos directos */}
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-purple-500" />
            <span className="text-muted-foreground">Referidos</span>
          </div>
          <span className="font-semibold">{node.directReferrals}</span>
        </div>

        {/* Inversión Total */}
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-green-500" />
            <span className="text-muted-foreground">Inversión</span>
          </div>
          <span className="font-semibold">{formatCurrency(node.totalInvestment)}</span>
        </div>

        {/* Comisiones */}
        {node.totalCommissions > 0 && (
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-yellow-500" />
              <span className="text-muted-foreground">Comisiones</span>
            </div>
            <span className="font-semibold text-green-600">
              {formatCurrency(node.totalCommissions)}
            </span>
          </div>
        )}
      </div>

      {/* Sponsor info */}
      {node.sponsorName && (
        <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>Sponsor: {node.sponsorName}</span>
          </div>
        </div>
      )}

      {/* Handle izquierdo (hijo izquierdo) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="left"
        style={{ left: '30%' }}
        className="!bg-green-500 !w-3 !h-3"
      />

      {/* Handle derecho (hijo derecho) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="right"
        style={{ left: '70%' }}
        className="!bg-blue-500 !w-3 !h-3"
      />
    </div>
  )
}

export default memo(BinaryNodeCard)
