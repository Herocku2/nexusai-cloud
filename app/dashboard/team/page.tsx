import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Network, Award } from "lucide-react";
import { getDirectReferrals, getTeamVolume, getBinaryTree, getActiveMembers } from "@/app/actions/team";
import { getPlacementPreference } from "@/app/actions/referral";
import BinaryTreeVisualization from "@/components/mlm/BinaryTreeVisualization";
import ReferralSection from "@/components/shared/referral-section";
import { getTranslations } from "@/lib/translations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations('team_page');
  const tReferral = await getTranslations('referral');
  
  if (!user) {
    redirect("/auth/login");
  }

  const referrals = await getDirectReferrals();
  const teamVolume = await getTeamVolume();
  const activeMembers = await getActiveMembers();
  const binaryTree = await getBinaryTree(user.id, 3);
  const { preference } = await getPlacementPreference();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('myTeam')}</h1>
      </div>

      {/* Referral Link and Placement Preference */}
      <ReferralSection 
        userId={user.id}
        currentPreference={preference}
        translations={{
          yourReferralLink: tReferral('yourReferralLink'),
          shareThisLink: tReferral('shareThisLink'),
          copy: tReferral('copy'),
          copied: tReferral('copied'),
          placementPreference: tReferral('placementPreference'),
          selectLeg: tReferral('selectLeg'),
          leftLeg: tReferral('leftLeg'),
          rightLeg: tReferral('rightLeg'),
          autoBalance: tReferral('autoBalance'),
          currentPreference: tReferral('currentPreference'),
          updatePreference: tReferral('updatePreference'),
          leftLegDesc: tReferral('leftLegDesc'),
          rightLegDesc: tReferral('rightLegDesc'),
          autoBalanceDesc: tReferral('autoBalanceDesc'),
        }}
      />

      {/* Team Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('directReferrals')}</p>
                <h3 className="text-2xl font-bold mt-2">{referrals?.total || 0}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('activeMembers')}</p>
                <h3 className="text-2xl font-bold mt-2">{activeMembers || 0}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('leftLegVolume')}</p>
                <h3 className="text-2xl font-bold mt-2">{teamVolume?.left || 0} PV</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('rightLegVolume')}</p>
                <h3 className="text-2xl font-bold mt-2">{teamVolume?.right || 0} PV</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Network className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Binary Tree Visualization */}
      <BinaryTreeVisualization data={binaryTree || []} currentUserId={user.id} />

      {/* Team Members Table */}
      <Card className="card">
        <CardHeader>
          <CardTitle>{t('teamMembers')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
              <TableRow className="border-0">
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
                  {t('name')}
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  {t('email')}
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  {t('position')}
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  {t('level')}
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
                  {t('status')}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {binaryTree && binaryTree.length > 0 ? (
                binaryTree.slice(0, 10).map((member: any, index: number) => {
                  const isLastRow = index === Math.min(binaryTree.length, 10) - 1;
                  return (
                    <TableRow key={member.user_id}>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "rounded-bl-lg" : ""
                        }`}
                      >
                        {member.first_name} {member.last_name}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "" : ""
                        }`}
                      >
                        {member.email}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "" : ""
                        }`}
                      >
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            member.position === "left"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-orange-500/10 text-orange-500"
                          }`}
                        >
                          {member.position === "left" ? t('left').toUpperCase() : t('right').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "" : ""
                        }`}
                      >
                        {t('level')} {member.depth}
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "rounded-br-lg" : ""
                        } text-center`}
                      >
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.status === "active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {member.status === "active" ? t('active') : member.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('noTeamMembers')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
