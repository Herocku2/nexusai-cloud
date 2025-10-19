import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { resetUserPassword } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function ResetPasswordPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: user } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!user) {
    redirect('/admin/users');
  }

  async function handleSubmit(formData: FormData) {
    'use server'
    const newPassword = formData.get('password') as string;
    const result = await resetUserPassword(params.id, newPassword);
    
    if (result.success) {
      redirect('/admin/users');
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">Set a new password for the user</p>
        </div>
      </div>

      <Card className="card max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Reset Password for {user.first_name} {user.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Warning:</strong> This will immediately change the user's password. 
              Make sure to communicate the new password to the user securely.
            </p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-4 bg-muted rounded-lg space-y-1">
                <p className="text-sm"><strong>User:</strong> {user.first_name} {user.last_name}</p>
                <p className="text-sm"><strong>User ID:</strong> {user.id}</p>
                <p className="text-sm"><strong>Status:</strong> {user.status}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="w-full md:w-auto">
                Reset Password
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/users">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
