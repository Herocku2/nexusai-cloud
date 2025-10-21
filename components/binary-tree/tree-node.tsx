'use client'

import { Card } from '@/components/ui/card'
import type { BinaryTreeNode } from '@/app/actions/binary-tree'

interface TreeNodeProps {
  node: BinaryTreeNode | null
  isRoot?: boolean
  translations: any
  onNodeClick?: (node: BinaryTreeNode) => void
  onNavigate?: (nodeId: string) => void
}

export default function TreeNode({ node, isRoot = false, translations, onNodeClick, onNavigate }: TreeNodeProps) {
  if (!node) {
    return (
      <div className="flex items-center justify-center w-40 h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
        <span className="text-xs text-muted-foreground">{translations.noMembers}</span>
      </div>
    )
  }

  const hasChildren = node.leftChild || node.rightChild
  const displayName = node.firstName && node.lastName 
    ? `${node.firstName} ${node.lastName}`
    : node.email.split('@')[0]

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Nodo actual - Estilo minimalista */}
      <div className="relative">
        <Card 
          className={`w-48 h-20 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
            isRoot ? 'border-4 border-black dark:border-white' : 'border-2 border-gray-800 dark:border-gray-200'
          } rounded-xl bg-white dark:bg-gray-900`}
          onClick={(e) => {
            // Click izquierdo: Ver detalles
            onNodeClick?.(node)
          }}
        >
          <div className="h-full flex flex-col items-center justify-center p-3">
            {/* Nombre grande y bold */}
            <h3 className="text-xl font-bold text-center truncate w-full">
              {isRoot ? translations.you : displayName}
            </h3>
            {/* Info pequeña debajo */}
            {!isRoot && (
              <p className="text-xs text-muted-foreground mt-1">
                {node.leftVolume.toFixed(0)} PV | {node.rightVolume.toFixed(0)} PV
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Hijos - Siempre visible */}
      {hasChildren && (
        <div className="flex gap-16 relative">
          {/* Línea conectora vertical desde arriba */}
          <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-gray-800 dark:bg-gray-200 -translate-x-1/2" />
          
          {/* Línea conectora horizontal */}
          {node.leftChild && node.rightChild && (
            <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-800 dark:bg-gray-200" />
          )}
          {/* Línea solo a la izquierda */}
          {node.leftChild && !node.rightChild && (
            <div className="absolute top-0 left-1/2 w-1/4 h-0.5 bg-gray-800 dark:bg-gray-200 -translate-x-full" />
          )}
          {/* Línea solo a la derecha */}
          {!node.leftChild && node.rightChild && (
            <div className="absolute top-0 left-1/2 w-1/4 h-0.5 bg-gray-800 dark:bg-gray-200" />
          )}

          {/* Hijo izquierdo */}
          <div className="flex flex-col items-center relative">
            {node.leftChild ? (
              <>
                {/* Línea vertical hacia el hijo */}
                <div className="absolute -top-0 left-1/2 w-0.5 h-6 bg-gray-800 dark:bg-gray-200 -translate-x-1/2" />
                <div className="mt-6">
                  <div className="text-center mb-3">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{translations.leftLeg}</span>
                  </div>
                  {/* Card clickeable para navegar */}
                  <div
                    onClick={() => onNavigate?.(node.leftChild!.userId)}
                    className="cursor-pointer"
                  >
                    <TreeNode 
                      node={node.leftChild} 
                      translations={translations}
                      onNodeClick={onNodeClick}
                      onNavigate={onNavigate}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute -top-0 left-1/2 w-0.5 h-6 bg-gray-800 dark:bg-gray-200 -translate-x-1/2" />
                <div className="mt-6">
                  <div className="text-center mb-3">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{translations.leftLeg}</span>
                  </div>
                  <div className="w-48 h-20 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">{translations.noMembers}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Hijo derecho */}
          <div className="flex flex-col items-center relative">
            {node.rightChild ? (
              <>
                {/* Línea vertical hacia el hijo */}
                <div className="absolute -top-0 left-1/2 w-0.5 h-6 bg-gray-800 dark:bg-gray-200 -translate-x-1/2" />
                <div className="mt-6">
                  <div className="text-center mb-3">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{translations.rightLeg}</span>
                  </div>
                  {/* Card clickeable para navegar */}
                  <div
                    onClick={() => onNavigate?.(node.rightChild!.userId)}
                    className="cursor-pointer"
                  >
                    <TreeNode 
                      node={node.rightChild} 
                      translations={translations}
                      onNodeClick={onNodeClick}
                      onNavigate={onNavigate}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="absolute -top-0 left-1/2 w-0.5 h-6 bg-gray-800 dark:bg-gray-200 -translate-x-1/2" />
                <div className="mt-6">
                  <div className="text-center mb-3">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{translations.rightLeg}</span>
                  </div>
                  <div className="w-48 h-20 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">{translations.noMembers}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
