import { redirect } from 'next/navigation'
import { getUser } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { getTranslations } from '@/lib/translations'

export default async function DashboardPage() {
  const user = await getUser()
  const t = await getTranslations('dashboard_page')
  const tCommon = await getTranslations('dashboard')

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
            {t('welcome')}, {user.profile?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user.email}
          </p>
        </div>
        <form action={handleSignOut}>
          <Button variant="outline" type="submit">
            {t('signOut')}
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{tCommon('balance')}</CardDescription>
            <CardTitle className="text-2xl">
              ${user.profile?.balance?.toFixed(2) || '0.00'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">{t('usdtAvailable')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{tCommon('totalEarnings')}</CardDescription>
            <CardTitle className="text-2xl">
              ${user.profile?.total_earnings?.toFixed(2) || '0.00'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">{t('lifetimeCommissions')}</p>
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
            <p className="text-xs text-gray-500">{t('pointValue')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t('status')}</CardDescription>
            <CardTitle className="text-2xl capitalize">
              {user.profile?.status || t('pending')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">{t('accountStatus')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('welcomeTitle')}</CardTitle>
          <CardDescription>
            {t('welcomeSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
            <h3 className="font-semibold mb-2">{t('gettingStarted')}</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>{t('step1')}</li>
              <li>{t('step2')}</li>
              <li>{t('step3')}</li>
              <li>{t('step4')}</li>
              <li>{t('step5')}</li>
            </ul>
          </div>

          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4">
            <h3 className="font-semibold mb-2">{t('commissionTypes')}</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• <strong>{t('fastStart')}:</strong> $40 (Level 1) + $8 (Level 2)</li>
              <li>• <strong>{t('binary')}:</strong> {t('weakerLegVolume')}</li>
              <li>• <strong>{t('matchingBonus')}:</strong> {t('matchingBonusDesc')}</li>
            </ul>
          </div>

          {user.profile?.sponsor_id && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
              <h3 className="font-semibold mb-2">{t('yourSponsor')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('sponsorId')}: {user.profile.sponsor_id}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
