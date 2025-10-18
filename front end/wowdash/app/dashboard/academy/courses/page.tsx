import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { getAllCourses, getCoursesByCategory } from "@/app/actions/academy";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const allCourses = await getAllCourses();
  const categories = await getCoursesByCategory();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Cursos</h1>
          <p className="text-muted-foreground mt-1">
            Explora todos los cursos disponibles
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/academy">Volver</Link>
        </Button>
      </div>

      {/* Categories */}
      {Object.keys(categories).length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/academy/courses">Todos ({allCourses.length})</Link>
          </Button>
          {Object.entries(categories).map(([category, count]: [string, any]) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/dashboard/academy/courses?category=${category}`}>
                {category} ({count})
              </Link>
            </Button>
          ))}
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allCourses.map((course: any) => (
          <Link
            key={course.id}
            href={`/dashboard/academy/course/${course.slug}`}
            className="block"
          >
            <Card className="card hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {course.category && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {course.category}
                  </span>
                )}

                <h4 className="font-semibold mb-2 mt-2 line-clamp-2">
                  {course.title}
                </h4>
                
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm border-t pt-3">
                  <span className="text-muted-foreground">
                    {course.duration} min
                  </span>
                  {course.is_free ? (
                    <span className="text-green-600 font-medium">Gratis</span>
                  ) : (
                    <span className="text-primary font-medium">Premium</span>
                  )}
                </div>

                {course.required_rank_id && (
                  <div className="mt-2">
                    <span className="text-xs text-yellow-600 bg-yellow-500/10 px-2 py-1 rounded">
                      Requiere rango específico
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {allCourses.length === 0 && (
        <Card className="card">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay cursos disponibles</h3>
            <p className="text-muted-foreground">
              Los cursos se agregarán pronto. Mantente atento!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
