import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCourseBySlug, getCourseProgress } from "@/app/actions/academy";
import CoursePlayer from "./course-player";

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CoursePage({ params }: PageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const course = await getCourseBySlug(params.slug);
  
  if (!course) {
    notFound();
  }

  const progress = await getCourseProgress(course.id.toString());

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/academy">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Volver a la Academia</p>
        </div>
      </div>

      <CoursePlayer course={course} progress={progress} />
    </div>
  );
}
