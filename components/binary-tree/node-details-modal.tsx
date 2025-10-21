'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, TrendingUp, DollarSign, Users, Activity } from 'lucide-react'
import type { BinaryTreeNode } from '@/app/actions/binary-tree'

interface NodeDetailsModalProps {
  node: BinaryTreeNode | null
  isOpen: boolean
  onClose: () => void
  translations: any
}

export default function NodeDetailsModal({ node, isOpen, onClose, translations }: NodeDetailsModalProps) {
  if (!node) return null

  const displayName = node.firstName && node.lastName 
    ? `${node.firstName} ${node.lastName}`
    : node.email.split('@')[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {displayName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{translations.user}</p>
                  <p className="text-sm text-muted-foreground">{node.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{translations.memberSince}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(node.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{translations.status}</p>
                  <Badge variant={node.isActive ? 'default' : 'secondary'} className="mt-1">
                    {node.isActive ? translations.active : translations.inactive}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium">{translations.investment}</p>
                </div>
                <p className="text-2xl font-bold">${node.totalInvestment.toFixed(2)}</p>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium">{translations.commissions}</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">${node.totalCommissions.toFixed(2)}</p>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <p className="text-sm font-medium">{translations.directReferrals}</p>
                </div>
                <p className="text-2xl font-bold text-purple-600">{node.directReferrals}</p>
              </div>
            </div>
          </div>

          {/* Volúmenes de piernas */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">{translations.totalVolume}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground mb-1">{translations.leftLeg}</p>
                <p className="text-3xl font-bold text-blue-600">{node.leftVolume.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">PV</p>
              </div>

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <p className="text-sm text-muted-foreground mb-1">{translations.rightLeg}</p>
                <p className="text-3xl font-bold text-green-600">{node.rightVolume.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">PV</p>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{translations.level}</p>
                <p className="font-semibold">Nivel {node.level}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{translations.position}</p>
                <p className="font-semibold capitalize">{node.position}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
