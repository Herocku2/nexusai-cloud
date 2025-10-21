import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { loginAsUser } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function LoginAsUserPage({ params }: { params: { id: string } }) {
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
    const result = await loginAsUser(params.id);
    
    if (result.success && result.redirectUrl) {
      redirect(result.redirectUrl);
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
          <h1 className="text-3xl font-bold">Login as User</h1>
          <p className="text-muted-foreground">Impersonate user account</p>
        </div>
      </div>

      <Card className="card max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Impersonate {user.first_name} {user.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 dark:text-amber-200 font-semibold">
                  Security Warning
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  This action will allow you to access the user's account as if you were them. 
                  All actions performed will be logged. Only admins can perform this action.
                </p>
              </div>
            </div>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="p-4 bg-muted rounded-lg space-y-1">
                <p className="text-sm"><strong>User:</strong> {user.first_name} {user.last_name}</p>
                <p className="text-sm"><strong>User ID:</strong> {user.id}</p>
                <p className="text-sm"><strong>Status:</strong> {user.status}</p>
                <p className="text-sm"><strong>Balance:</strong> ${Number(user.balance).toFixed(2)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="w-full md:w-auto">
                Login as User
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
