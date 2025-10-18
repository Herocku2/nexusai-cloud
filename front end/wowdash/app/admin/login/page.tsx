import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { adminLogin } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';

export default function AdminLoginPage() {
  async function handleLogin(formData: FormData) {
    'use server'
    const result = await adminLogin(formData)
    
    if (result.success) {
      // Establecer cookie de admin
      cookies().set('admin_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
      })
      redirect('/admin/dashboard')
    }
    
    return result
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Area</CardTitle>
          <p className="text-muted-foreground">Nexus AI MLM Administration</p>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@nexusai.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In to Admin
            </Button>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                🔐 Admin Credentials:
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                Email: admin@nexusai.com<br/>
                Password: NexusAdmin2024!SecurePass
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-2">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                🔑 Master Password:
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 font-mono">
                NexusMaster2024!SuperSecure
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Use this to access any user account
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
