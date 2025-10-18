import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, Clock, TrendingUp } from "lucide-react";
import { getAllCourses, getAcademyStats, getMyCourses } from "@/app/actions/academy";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AcademyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const stats = await getAcademyStats();
  const myCourses = await getMyCourses();
  const allCourses = await getAllCourses();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Academia Nexus AI</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cursos Disponibles</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalCourses}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cursos Completados</p>
                <h3 className="text-2xl font-bold mt-2">{stats.completedCourses}</h3>
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
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <h3 className="text-2xl font-bold mt-2">{stats.inProgressCourses}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Horas Completadas</p>
                <h3 className="text-2xl font-bold mt-2">{stats.totalHours}h</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mis Cursos en Progreso */}
      {myCourses.length > 0 && (
        <Card className="card">
          <CardHeader>
            <CardTitle>Continuar Aprendiendo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myCourses.slice(0, 6).map((progress: any) => (
                <Link
                  key={progress.id}
                  href={`/dashboard/academy/course/${progress.content.slug}`}
                  className="block"
                >
                  <Card className="card hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        {progress.content.thumbnail_url ? (
                          <img
                            src={progress.content.thumbnail_url}
                            alt={progress.content.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <h4 className="font-semibold mb-2 line-clamp-2">
                        {progress.content.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{progress.content.duration} min</span>
                        <span className="text-primary font-medium">
                          {progress.progress_percentage || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progress.progress_percentage || 0}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Todos los Cursos */}
      <Card className="card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Catálogo de Cursos</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/dashboard/academy/courses">Ver Todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allCourses.slice(0, 8).map((course: any) => (
              <Link
                key={course.id}
                href={`/dashboard/academy/course/${course.slug}`}
                className="block"
              >
                <Card className="card hover:shadow-lg transition-shadow cursor-pointer">
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
                    <h4 className="font-semibold mb-2 line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {course.duration} min
                      </span>
                      {course.is_free ? (
                        <span className="text-green-600 font-medium">Gratis</span>
                      ) : (
                        <span className="text-primary font-medium">Premium</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
