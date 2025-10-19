import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";
import { getCurrentRank, getAllRanks, getRankProgress, getRankHistory } from "@/app/actions/ranks";
import { Progress } from "@/components/ui/progress";

export default async function RanksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const currentRankResult = await getCurrentRank();
  const allRanksResult = await getAllRanks();
  const progressResult = await getRankProgress();
  const historyResult = await getRankHistory();

  const currentRank = currentRankResult.rank;
  const allRanks = allRanksResult.ranks;
  const progress = progressResult.progress;
  const history = historyResult.history;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rank System</h1>
      </div>

      {/* Current Rank */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="h-10 w-10" />
            </div>
            <div>
              <p className="text-sm opacity-80">Current Rank</p>
              <h2 className="text-3xl font-bold mt-1">
                {currentRank ? currentRank.ranks.name : 'Afiliado'}
              </h2>
              <p className="text-sm opacity-80 mt-2">
                Level {currentRank ? currentRank.ranks.level : 1}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress to Next Rank */}
      {progress && progress.nextRank && (
        <Card>
          <CardHeader>
            <CardTitle>Progress to {progress.nextRank.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Direct Referrals */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Direct Referrals</span>
                <span className="text-sm text-muted-foreground">
                  {progress.requirements.directReferrals.current} / {progress.requirements.directReferrals.required}
                </span>
              </div>
              <Progress value={progress.requirements.directReferrals.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {progress.requirements.directReferrals.percentage.toFixed(0)}% complete
              </p>
            </div>

            {/* Left Leg PV */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Left Leg Volume</span>
                <span className="text-sm text-muted-foreground">
                  {progress.requirements.leftPV.current} / {progress.requirements.leftPV.required} PV
                </span>
              </div>
              <Progress value={progress.requirements.leftPV.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {progress.requirements.leftPV.percentage.toFixed(0)}% complete
              </p>
            </div>

            {/* Right Leg PV */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Right Leg Volume</span>
                <span className="text-sm text-muted-foreground">
                  {progress.requirements.rightPV.current} / {progress.requirements.rightPV.required} PV
                </span>
              </div>
              <Progress value={progress.requirements.rightPV.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {progress.requirements.rightPV.percentage.toFixed(0)}% complete
              </p>
            </div>

            {/* Total PV */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Total Personal Volume</span>
                <span className="text-sm text-muted-foreground">
                  {progress.requirements.totalPV.current} / {progress.requirements.totalPV.required} PV
                </span>
              </div>
              <Progress value={progress.requirements.totalPV.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {progress.requirements.totalPV.percentage.toFixed(0)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Ranks */}
      <Card>
        <CardHeader>
          <CardTitle>All Ranks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allRanks.map((rank: any) => {
              const isCurrentRank = currentRank?.ranks?.id === rank.id;
              const isPastRank = currentRank?.ranks?.level ? rank.level < currentRank.ranks.level : false;
              
              return (
                <Card 
                  key={rank.id} 
                  className={`${
                    isCurrentRank 
                      ? 'border-2 border-purple-500 bg-purple-50 dark:bg-purple-950' 
                      : isPastRank 
                      ? 'opacity-60' 
                      : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold">{rank.name}</h3>
                        <p className="text-xs text-muted-foreground">Level {rank.level}</p>
                      </div>
                      {isCurrentRank && (
                        <Award className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Referrals:</span>
                        <span className="font-medium">{rank.required_direct_referrals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Left PV:</span>
                        <span className="font-medium">{rank.required_left_pv}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Right PV:</span>
                        <span className="font-medium">{rank.required_right_pv}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total PV:</span>
                        <span className="font-medium">{rank.required_total_pv}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Matching:</span>
                        <span className="font-medium text-green-600">
                          {rank.matching_bonus_percentage}% ({rank.matching_bonus_levels} levels)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Rank History */}
      {history && history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rank Achievement History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.map((achievement: any) => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.ranks.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Achieved on {new Date(achievement.achieved_at).toLocaleDateString()}
                    </p>
                  </div>
                  {achievement.is_current && (
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 text-xs font-semibold rounded-full">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
