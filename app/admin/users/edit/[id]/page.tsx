import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateUserData } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function EditUserPage({ params }: { params: { id: string } }) {
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
    const result = await updateUserData(params.id, formData);
    
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
          <h1 className="text-3xl font-bold">Edit User</h1>
          <p className="text-muted-foreground">Update user information</p>
        </div>
      </div>

      <Card className="card">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue={user.first_name || ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={user.last_name || ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={user.country || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Balance (USDT)</Label>
                <Input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={user.balance}
                />
                <p className="text-xs text-muted-foreground">
                  Current balance: ${Number(user.balance).toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue={user.status}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="p-4 bg-muted rounded-lg space-y-1">
                  <p className="text-sm"><strong>User ID:</strong> {user.id}</p>
                  <p className="text-sm"><strong>Total Earnings:</strong> ${Number(user.total_earnings).toFixed(2)}</p>
                  <p className="text-sm"><strong>Total PV:</strong> {user.total_pv}</p>
                  <p className="text-sm"><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="w-full md:w-auto">
                Update User
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
