import { Suspense } from 'react'
import { Metadata } from 'next'
import BinaryTreeAdminContent from './binary-tree-admin-content'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Árbol Binario - Admin | Nexus AI',
  description: 'Visualización y administración del árbol binario completo',
}

export default function AdminBinaryTreePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Árbol Binario</h1>
          <p className="text-muted-foreground mt-2">
            Visualización completa de la estructura del árbol binario
          </p>
        </div>
      </div>

      <Suspense fallback={<TreeSkeleton />}>
        <BinaryTreeAdminContent />
      </Suspense>
    </div>
  )
}

function TreeSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-[800px] w-full" />
    </div>
  )
}
