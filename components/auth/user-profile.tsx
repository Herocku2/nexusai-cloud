'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signOut } from '@/app/actions/auth'

export default function UserProfile() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          No estás autenticado
        </p>
        <a 
          href="/auth/login"
          className="text-primary hover:underline"
        >
          Iniciar sesión
        </a>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Perfil de Usuario
      </h2>
      
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
          <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
        </div>

        {user?.user_metadata?.username && (
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Username:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.user_metadata.username}
            </p>
          </div>
        )}

        <form action={signOut} className="pt-4">
          <Button type="submit" variant="outline" className="w-full">
            Cerrar Sesión
          </Button>
        </form>
      </div>
    </div>
  )
}
