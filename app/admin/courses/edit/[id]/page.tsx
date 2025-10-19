import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateCourse } from "@/app/actions/admin-courses";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: course } = await supabase
    .from('academy_content')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!course) {
    redirect('/admin/courses');
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await updateCourse(parseInt(params.id), formData);
    
    if (result.success) {
      redirect('/admin/courses');
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-muted-foreground">Update course information</p>
        </div>
      </div>

      <Card className="card">
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={course.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={course.category || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Content Type *</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={course.content_type}
                  required
                >
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="quiz">Quiz</option>
                  <option value="live_class">Live Class</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  defaultValue={course.duration}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="url">Video/Content URL *</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  defaultValue={course.video_url}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  type="url"
                  defaultValue={course.thumbnail_url || ''}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={course.description}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isFree">Access Type *</Label>
                <select
                  id="isFree"
                  name="isFree"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={course.is_public ? 'true' : 'false'}
                  required
                >
                  <option value="true">Free for all</option>
                  <option value="false">Premium (members only)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="w-full md:w-auto">
                Update Course
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/courses">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
