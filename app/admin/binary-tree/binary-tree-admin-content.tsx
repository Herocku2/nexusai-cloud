'use client'

import { useEffect, useState } from 'react'
import { 
  getAllBinaryNodes, 
  getBinaryTreeStatistics,
  searchBinaryTreeUsers,
  AdminBinaryNode,
  BinaryTreeStats 
} from '@/app/actions/admin-binary-tree'
import BinaryTreeFlow from '@/components/admin/binary-tree-flow'
import AdminBinaryNodeDetailsModal from '@/components/admin/admin-binary-node-details-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Layers,
  BarChart3,
  Search,
  RefreshCw,
  Download,
  Home,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function BinaryTreeAdminContent() {
  const [nodes, setNodes] = useState<AdminBinaryNode[]>([])
  const [stats, setStats] = useState<BinaryTreeStats | null>(null)
  const [selectedNode, setSelectedNode] = useState<AdminBinaryNode | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [rootUserId, setRootUserId] = useState<string | undefined>(undefined)
  // Using react-hot-toast

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [nodesData, statsData] = await Promise.all([
        getAllBinaryNodes(rootUserId),
        getBinaryTreeStatistics(rootUserId),
      ])
      
      setNodes(nodesData)
      setStats(statsData)
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar el árbol binario')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [rootUserId])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadData()
      return
    }

    try {
      setIsLoading(true)
      const results = await searchBinaryTreeUsers(searchTerm)
      setNodes(results)
      
      toast.success(`Se encontraron ${results.length} resultados`)
    } catch (error: any) {
      toast.error(error.message || 'Error al buscar usuarios')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNodeClick = (node: AdminBinaryNode) => {
    setSelectedNode(node)
    setIsModalOpen(true)
  }

  const handleNavigate = (userId: string) => {
    setRootUserId(userId)
  }

  const handleResetView = () => {
    setRootUserId(undefined)
    setSearchTerm('')
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(nodes, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `binary-tree-${Date.now()}.json`
    link.click()
    
    toast.success('Los datos del árbol se han descargado')
  }

  if (isLoading && nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Cargando árbol binario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                En toda la red
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.activeMembers}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeMembers / stats.totalMembers) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volumen Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${stats.totalVolume.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Acumulado en la red
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.balanceRatio}%
              </div>
              <p className="text-xs text-muted-foreground">
                Izq: {stats.leftBranchCount} | Der: {stats.rightBranchCount}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profundidad</CardTitle>
              <Layers className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalLevels} niveles
              </div>
              <p className="text-xs text-muted-foreground">
                Máxima profundidad
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <UserX className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats.inactiveMembers}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.inactiveMembers / stats.totalMembers) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Controles del Árbol</CardTitle>
          <CardDescription>
            Buscar, filtrar y navegar por el árbol binario
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              {rootUserId && (
                <Button onClick={handleResetView} variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Vista Completa
                </Button>
              )}
              
              <Button onClick={loadData} variant="outline" disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>

              <Button onClick={handleExportData} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {rootUserId && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
              <p className="text-blue-700 dark:text-blue-300">
                <strong>Vista filtrada:</strong> Mostrando subárbol desde el nodo seleccionado
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualización del árbol */}
      <Card>
        <CardHeader>
          <CardTitle>Visualización del Árbol</CardTitle>
          <CardDescription>
            Árbol binario interactivo - Haz clic en los nodos para ver detalles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BinaryTreeFlow
            nodes={nodes}
            onNodeClick={handleNodeClick}
            onRefresh={loadData}
          />
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <AdminBinaryNodeDetailsModal
        node={selectedNode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  )
}
