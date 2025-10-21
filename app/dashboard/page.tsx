import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { getTranslations } from '@/lib/translations'
import { 
  getDashboardStats, 
  getRecentCommissions, 
  getRecentTransactions 
} from '@/app/actions/dashboard-stats'
import DashboardContent from './dashboard-content'

export default async function DashboardPage() {
  const user = await getUser()
  const t = await getTranslations('dashboard_page')

  if (!user) {
    redirect('/auth/login')
  }

  // Obtener estadísticas completas del usuario
  const stats = await getDashboardStats()
  const recentCommissions = await getRecentCommissions(5)
  const recentTransactions = await getRecentTransactions(5)

  // Si no hay stats, mostrar mensaje
  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Error al cargar las estadísticas. Por favor, intenta nuevamente.
          </p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    'use server'
    await signOut()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {t('welcome')}, {user.profile?.first_name || 'User'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.email}
          </p>
        </div>
        <form action={handleSignOut}>
          <Button variant="outline" type="submit">
            {t('signOut')}
          </Button>
        </form>
      </div>

      {/* Dashboard content con datos reales */}
      <DashboardContent 
        stats={stats}
        recentCommissions={recentCommissions}
        recentTransactions={recentTransactions}
      />
    </div>
  )
}
