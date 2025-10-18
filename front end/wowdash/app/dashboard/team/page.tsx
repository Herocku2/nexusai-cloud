import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Network, Award } from "lucide-react";
import { getDirectReferrals, getTeamVolume, getBinaryTree, getActiveMembers } from "@/app/actions/team";
import BinaryTreeVisualization from "@/components/mlm/BinaryTreeVisualization";
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
  
  if (!user) {
    redirect("/auth/login");
  }

  const referrals = await getDirectReferrals();
  const teamVolume = await getTeamVolume();
  const activeMembers = await getActiveMembers();
  const binaryTree = await getBinaryTree(user.id, 3);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Team</h1>
      </div>

      {/* Team Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Direct Referrals</p>
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
                <p className="text-sm text-muted-foreground">Active Members</p>
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
                <p className="text-sm text-muted-foreground">Left Leg Volume</p>
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
                <p className="text-sm text-muted-foreground">Right Leg Volume</p>
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
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
              <TableRow className="border-0">
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
                  Name
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Email
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Position
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Level
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
                  Status
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
                          {member.position?.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell
                        className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                          isLastRow ? "" : ""
                        }`}
                      >
                        Level {member.depth}
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
                          {member.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No team members yet. Start building your network!
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
