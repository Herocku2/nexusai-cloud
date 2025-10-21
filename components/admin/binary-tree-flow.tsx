'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  ConnectionMode,
  MarkerType,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { AdminBinaryNode } from '@/app/actions/admin-binary-tree'
import BinaryNodeCard from './binary-node-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BinaryTreeFlowProps {
  nodes: AdminBinaryNode[]
  onNodeClick?: (node: AdminBinaryNode) => void
  onRefresh?: () => void
}

// Tipos de nodo personalizados
const nodeTypes = {
  binaryNode: BinaryNodeCard,
}

export default function BinaryTreeFlow({ 
  nodes: binaryNodes, 
  onNodeClick,
  onRefresh 
}: BinaryTreeFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')

  // Calcular posiciones del árbol usando algoritmo de layout
  const calculateTreeLayout = useCallback((nodes: AdminBinaryNode[]) => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    const flowNodes: Node[] = []
    const flowEdges: Edge[] = []
    
    // Configuración de espaciado
    const HORIZONTAL_SPACING = 350
    const VERTICAL_SPACING = 200
    const levelWidths = new Map<number, number>()
    
    // Calcular ancho de cada nivel
    nodes.forEach(node => {
      const count = levelWidths.get(node.level) || 0
      levelWidths.set(node.level, count + 1)
    })

    // Posicionar nodos por nivel
    const levelPositions = new Map<number, number>()
    
    nodes.forEach(node => {
      const levelWidth = levelWidths.get(node.level) || 1
      const currentIndex = levelPositions.get(node.level) || 0
      levelPositions.set(node.level, currentIndex + 1)
      
      // Calcular posición X centrada
      const totalWidth = levelWidth * HORIZONTAL_SPACING
      const startX = -(totalWidth / 2)
      const x = startX + (currentIndex * HORIZONTAL_SPACING) + (HORIZONTAL_SPACING / 2)
      const y = node.level * VERTICAL_SPACING
      
      // Crear nodo de ReactFlow
      flowNodes.push({
        id: node.id,
        type: 'binaryNode',
        position: { x, y },
        data: {
          node,
          onClick: () => onNodeClick?.(node),
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      })

      // Crear edges hacia los hijos
      if (node.leftChildId && nodeMap.has(node.leftChildId)) {
        flowEdges.push({
          id: `${node.id}-left-${node.leftChildId}`,
          source: node.id,
          target: node.leftChildId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#10b981',
          },
          label: 'L',
          labelStyle: { fill: '#10b981', fontWeight: 700 },
        })
      }

      if (node.rightChildId && nodeMap.has(node.rightChildId)) {
        flowEdges.push({
          id: `${node.id}-right-${node.rightChildId}`,
          source: node.id,
          target: node.rightChildId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
          },
          label: 'R',
          labelStyle: { fill: '#3b82f6', fontWeight: 700 },
        })
      }
    })

    return { flowNodes, flowEdges }
  }, [onNodeClick])

  // Filtrar nodos
  const filteredNodes = useMemo(() => {
    let filtered = [...binaryNodes]

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(node => 
        node.firstName?.toLowerCase().includes(term) ||
        node.lastName?.toLowerCase().includes(term) ||
        node.email.toLowerCase().includes(term)
      )
    }

    // Filtrar por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(node => 
        filterStatus === 'active' ? node.isActive : !node.isActive
      )
    }

    // Filtrar por nivel
    if (filterLevel !== 'all') {
      const level = parseInt(filterLevel)
      filtered = filtered.filter(node => node.level === level)
    }

    return filtered
  }, [binaryNodes, searchTerm, filterStatus, filterLevel])

  // Actualizar layout cuando cambien los nodos filtrados
  useEffect(() => {
    const { flowNodes, flowEdges } = calculateTreeLayout(filteredNodes)
    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [filteredNodes, calculateTreeLayout, setNodes, setEdges])

  // Obtener niveles únicos para el filtro
  const uniqueLevels = useMemo(() => {
    const levels = new Set(binaryNodes.map(n => n.level))
    return Array.from(levels).sort((a, b) => a - b)
  }, [binaryNodes])

  // Exportar árbol como imagen
  const handleExport = useCallback(() => {
    // Implementar exportación
    console.log('Exportar árbol')
  }, [])

  return (
    <div className="h-[800px] w-full relative bg-background border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const binaryNode = binaryNodes.find(n => n.id === node.id)
            return binaryNode?.isActive ? '#10b981' : '#6b7280'
          }}
          maskColor="rgb(0, 0, 0, 0.1)"
        />
        
        {/* Panel de controles superior */}
        <Panel position="top-left" className="bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {uniqueLevels.map(level => (
                  <SelectItem key={level} value={level.toString()}>
                    Nivel {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Button>
            )}
          </div>
        </Panel>

        {/* Panel de estadísticas */}
        <Panel position="top-right" className="bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Total nodos:</span>
              <span className="font-semibold">{filteredNodes.length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Activos:</span>
              <span className="font-semibold text-green-600">
                {filteredNodes.filter(n => n.isActive).length}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Inactivos:</span>
              <span className="font-semibold text-gray-600">
                {filteredNodes.filter(n => !n.isActive).length}
              </span>
            </div>
          </div>
        </Panel>

        {/* Panel de acciones */}
        <Panel position="bottom-right" className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  )
}
