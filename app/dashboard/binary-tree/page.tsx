import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Activity } from "lucide-react"
import { getBinaryTreeData, getBinaryTreeStats } from "@/app/actions/binary-tree"
import { getTranslations } from "@/lib/translations"
import BinaryTreeView from "./binary-tree-view"

export default async function BinaryTreePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const t = await getTranslations('binary_tree_page')
  
  if (!user) {
    redirect("/auth/login")
  }

  // Obtener datos del árbol binario
  const treeData = await getBinaryTreeData()
  const stats = await getBinaryTreeStats()

  if (!treeData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No tienes una posición en el árbol binario aún.
          </p>
        </div>
      </div>
    )
  }

  const translations = {
    title: t('title'),
    myPosition: t('myPosition'),
    leftLeg: t('leftLeg'),
    rightLeg: t('rightLeg'),
    clickToExpand: t('clickToExpand'),
    noMembers: t('noMembers'),
    user: t('user'),
    investment: t('investment'),
    commissions: t('commissions'),
    totalVolume: t('totalVolume'),
    directReferrals: t('directReferrals'),
    level: t('level'),
    position: t('position'),
    memberSince: t('memberSince'),
    status: t('status'),
    active: t('active'),
    inactive: t('inactive'),
    you: t('you'),
    viewProfile: t('viewProfile'),
    leftVolume: t('leftVolume'),
    rightVolume: t('rightVolume'),
    totalTeam: t('totalTeam'),
    loading: t('loading'),
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('leftVolume')}</p>
                <h3 className="text-2xl font-bold text-blue-600 mt-2">
                  {stats?.leftVolume.toFixed(0) || "0"} PV
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('rightVolume')}</p>
                <h3 className="text-2xl font-bold text-green-600 mt-2">
                  {stats?.rightVolume.toFixed(0) || "0"} PV
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalTeam')}</p>
                <h3 className="text-2xl font-bold mt-2">
                  {stats?.totalTeam || "0"}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Árbol binario */}
      <Card>
        <CardHeader>
          <CardTitle>{t('myPosition')}</CardTitle>
        </CardHeader>
        <CardContent>
          <BinaryTreeView treeData={treeData} translations={translations} />
        </CardContent>
      </Card>
    </div>
  )
}
