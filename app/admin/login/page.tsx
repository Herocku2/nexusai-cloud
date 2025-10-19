import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { adminLogin } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function AdminLoginPage() {
  async function handleLogin(formData: FormData) {
    'use server'
    const result = await adminLogin(formData)
    
    if (result.success) {
      revalidatePath('/', 'layout')
      redirect('/admin/dashboard')
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-slate-900 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Admin Area
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Sign in to access your ADMIN AREA
            </p>
          </div>
          <form action={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@nexusai.com"
                className="h-12 rounded-xl bg-neutral-100 dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl bg-neutral-100 dark:bg-slate-800 border border-neutral-300 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-lg h-[52px] text-sm mt-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            >
              Sign In to Admin Area
            </Button>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4 mt-6">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Admin Credentials:
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 font-mono space-y-1">
                <span className="block">Email: admin@nexusai.com</span>
                <span className="block">Password: NexusAdmin2024!SecurePass</span>
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-xl p-4 mt-3">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Master Password:
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300 font-mono">
                NexusMaster2024!SuperSecure
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                Use this to access any user account
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
