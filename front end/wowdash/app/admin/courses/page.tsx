import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchBox from "@/components/shared/search-box";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { getAllCourses, deleteCourse, toggleCourseStatus } from "@/app/actions/admin-courses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminCoursesPage() {
  const courses = await getAllCourses();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">Manage academy courses and content</p>
        </div>
      </div>

      <Card className="card h-full !p-0 !block border-0 overflow-hidden">
        <CardHeader className="border-b border-neutral-200 dark:border-slate-600 !py-4 px-6 flex items-center flex-wrap gap-3 justify-between">
          <div className="flex items-center flex-wrap gap-3">
            <SearchBox />
          </div>
          <Button className={cn(`w-auto h-11`)} asChild>
            <Link href="/admin/courses/create">
              <Plus className="w-5 h-5" />
              Add New Course
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="card-body p-6">
          <Table className="table-auto border-spacing-0 border-separate">
            <TableHeader>
              <TableRow className="border-0">
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-s rounded-tl-lg">
                  Course
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Category
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Duration
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Type
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12">
                  Status
                </TableHead>
                <TableHead className="bg-neutral-100 dark:bg-slate-700 border-t border-neutral-200 dark:border-slate-600 overflow-hidden px-4 h-12 border-e rounded-tr-lg text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {courses.map((course: any, index: number) => {
                const isLastRow = index === courses.length - 1;
                return (
                  <TableRow key={course.id}>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "rounded-bl-lg" : ""
                      }`}
                    >
                      <div>
                        <h6 className="text-base mb-0 font-medium line-clamp-2">
                          {course.title}
                        </h6>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {course.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      {course.category || 'General'}
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      {course.duration} min
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      <span className="text-xs">
                        {course.is_free ? 'Free' : 'Premium'}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`py-3 px-4 border-b border-neutral-200 dark:border-slate-600 first:border-s last:border-e ${
                        isLastRow ? "" : ""
                      }`}
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.is_active
                            ? "bg-green-500/10 text-green-500"
                            : "bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {course.is_active ? 'Active' : 'Inactive'}
                      </span>
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
                          <Link href={`/admin/courses/edit/${course.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <form action={async () => {
                          'use server'
                          await toggleCourseStatus(course.id, course.is_active)
                        }}>
                          <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            className={`rounded-[50%] ${
                              course.is_active 
                                ? 'text-yellow-600 bg-yellow-600/10' 
                                : 'text-green-600 bg-green-600/10'
                            }`}
                          >
                            {course.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses found. Create your first course!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
