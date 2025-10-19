import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const handleSignOut = async () => {
    'use server'
    await signOut()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user.profile?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user.email}
          </p>
        </div>
        <form action={handleSignOut}>
          <Button variant="outline" type="submit">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Balance</CardDescription>
            <CardTitle className="text-2xl">
              ${user.profile?.balance?.toFixed(2) || '0.00'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">USDT Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-2xl">
              ${user.profile?.total_earnings?.toFixed(2) || '0.00'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Lifetime Commissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total PV</CardDescription>
            <CardTitle className="text-2xl">
              {user.profile?.total_pv?.toFixed(2) || '0'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Point Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-2xl capitalize">
              {user.profile?.status || 'Pending'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">Account Status</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Nexus AI</CardTitle>
          <CardDescription>
            Your MLM Binary + Academy LMS Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
            <h3 className="font-semibold mb-2">🚀 Getting Started</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Complete your profile information</li>
              <li>• Purchase your initial membership ($89 USDT = 100 PV)</li>
              <li>• Start referring others to build your team</li>
              <li>• Access the academy content to learn</li>
              <li>• Track your commissions and earnings</li>
            </ul>
          </div>

          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4">
            <h3 className="font-semibold mb-2">💰 Commission Types</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• <strong>Fast Start:</strong> $40 (Level 1) + $8 (Level 2)</li>
              <li>• <strong>Binary:</strong> 50% of weaker leg volume</li>
              <li>• <strong>Matching Bonus:</strong> Up to 50% of directs' binary (5 levels)</li>
            </ul>
          </div>

          {user.profile?.sponsor_id && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
              <h3 className="font-semibold mb-2">👤 Your Sponsor</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sponsor ID: {user.profile.sponsor_id}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
