import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchBox from "@/components/shared/search-box";
import CustomSelect from "@/components/shared/custom-select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Plus, Shield, Edit, Trash2, Lock } from "lucide-react";
import { getAllUsers, updateUserStatus, deleteUser } from "@/app/actions/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const search = params.search || '';
  const status = params.status || 'all';

  const { users, total, pages } = await getAllUsers(page, 20, search, status);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users</p>
        </div>
      </div>

      <Card className="card h-full !p-0 !block border-0 overflow-hidden">
        <CardHeader className="border-b border-neutral-200 dark:border-slate-600 !py-4 px-6 flex items-center flex-wrap gap-3 justify-between">
          <div className="flex items-center flex-wrap gap-3">
            <span className="text-base font-medium text-secondary-light mb-0">Show</span>
            <CustomSelect
              placeholder="20"
              options={["10", "20", "50", "100"]}
            />
            <SearchBox />
            <CustomSelect
              placeholder="Status"
              options={["all", "active", "pending", "blocked"]}
            />
          </div>
          <div className="flex gap-2">
            <Button className={cn(`w-auto h-11`)} variant="outline" asChild>
              <Link href="/admin/users/bulk-actions">
                Bulk Actions
              </Link>
            </Button>
            <Button className={cn(`w-auto h-11`)} asChild>
              <Link href="/admin/users/create">
                <Plus className="w-5 h-5" />
                Add New User
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="card-body p-6">
          <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
              <TableRow className="border-0">
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
                  User
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Email
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Balance
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Total PV
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Status
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Created
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user: any, index: number) => {
                const isLastRow = index === users.length - 1;
                return (
                  <TableRow key={user.id}>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "rounded-bl-lg" : ""
                      }`}
                    >
                      <div>
                        <h6 className="text-base mb-0 font-medium">
                          {user.first_name} {user.last_name}
                        </h6>
                        <p className="text-xs text-muted-foreground">
                          ID: {user.id.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      {user.email || 'N/A'}
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      <span className="font-semibold">
                        ${Number(user.balance || 0).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      {user.total_pv || 0} PV
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : user.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "rounded-br-lg" : ""
                      } text-center`}
                    >
                      <div className="flex justify-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-[50%] text-blue-500 bg-primary/10"
                          asChild
                        >
                          <Link href={`/admin/users/edit/${user.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-[50%] text-green-600 bg-green-600/10"
                          asChild
                        >
                          <Link href={`/admin/users/login-as/${user.id}`}>
                            <Shield className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-[50%] text-yellow-600 bg-yellow-600/10"
                          asChild
                        >
                          <Link href={`/admin/users/reset-password/${user.id}`}>
                            <Lock className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, total)} of {total} users
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/users?page=${page - 1}&search=${search}&status=${status}`}>
                    Previous
                  </Link>
                </Button>
              )}
              {page < pages && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/users?page=${page + 1}&search=${search}&status=${status}`}>
                    Next
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
