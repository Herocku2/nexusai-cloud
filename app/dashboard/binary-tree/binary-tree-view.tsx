'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'
import TreeNode from '@/components/binary-tree/tree-node'
import NodeDetailsModal from '@/components/binary-tree/node-details-modal'
import type { BinaryTreeNode } from '@/app/actions/binary-tree'

interface BinaryTreeViewProps {
  treeData: BinaryTreeNode
  translations: any
}

export default function BinaryTreeView({ treeData, translations }: BinaryTreeViewProps) {
  const [selectedNode, setSelectedNode] = useState<BinaryTreeNode | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentNode, setCurrentNode] = useState<BinaryTreeNode>(treeData)
  const [navigationHistory, setNavigationHistory] = useState<BinaryTreeNode[]>([treeData])

  const handleNodeClick = (node: BinaryTreeNode) => {
    setSelectedNode(node)
    setIsModalOpen(true)
  }

  const handleNavigate = (userId: string) => {
    // Buscar el nodo en el árbol actual
    const findNode = (node: BinaryTreeNode | null, targetUserId: string): BinaryTreeNode | null => {
      if (!node) return null
      if (node.userId === targetUserId) return node
      
      const leftResult = findNode(node.leftChild, targetUserId)
      if (leftResult) return leftResult
      
      return findNode(node.rightChild, targetUserId)
    }

    const targetNode = findNode(treeData, userId)
    if (targetNode) {
      setCurrentNode(targetNode)
      setNavigationHistory([...navigationHistory, targetNode])
    }
  }

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory]
      newHistory.pop()
      setNavigationHistory(newHistory)
      setCurrentNode(newHistory[newHistory.length - 1])
    }
  }

  const canGoBack = navigationHistory.length > 1

  return (
    <div className="relative">
      {/* Botón para volver atrás */}
      {canGoBack && (
        <div className="mb-4 flex items-center gap-2">
          <Button
            onClick={handleGoBack}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ChevronUp className="h-4 w-4" />
            Volver al nivel superior
          </Button>
          <span className="text-sm text-muted-foreground">
            Nivel {navigationHistory.length} de profundidad
          </span>
        </div>
      )}

      {/* Contenedor del árbol con scroll horizontal */}
      <div className="overflow-x-auto pb-8">
        <div className="min-w-max flex justify-center p-8">
          <TreeNode 
            node={currentNode} 
            isRoot={currentNode.userId === treeData.userId}
            translations={translations}
            onNodeClick={handleNodeClick}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {/* Modal de detalles */}
      <NodeDetailsModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        translations={translations}
      />
    </div>
  )
}
