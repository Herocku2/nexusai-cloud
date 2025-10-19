import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCourse } from "@/app/actions/admin-courses";
import { redirect } from "next/navigation";

export default function CreateCoursePage() {
  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await createCourse(formData)
    
    if (result.success) {
      redirect('/admin/courses')
    }
    
    // Si hay error, podríamos manejarlo aquí
    // Por ahora, simplemente no retornamos nada para cumplir con el tipo void
    if (result.error) {
      console.error('Error creating course:', result.error)
      // Aquí podrías lanzar un error o manejarlo de otra forma
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
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">Add a new course to the academy</p>
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
                  placeholder="Introduction to MLM Business"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="Business, Marketing, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Content Type *</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  placeholder="30"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="url">Video/Content URL *</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  YouTube, Vimeo, or direct video URL
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  name="thumbnailUrl"
                  type="url"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Course description and learning outcomes..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="isFree">Access Type *</Label>
                <select
                  id="isFree"
                  name="isFree"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="true">Free for all</option>
                  <option value="false">Premium (members only)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="w-full md:w-auto">
                Create Course
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
