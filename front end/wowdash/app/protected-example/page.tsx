import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'
import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function ProtectedExample() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          🎉 Protected Page
        </h1>
        
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              ✓ Authentication Successful
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Information
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Email:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.email}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">User ID:</span>
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {user.id.substring(0, 8)}...
                </span>
              </div>

              {user.user_metadata?.username && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Username:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.user_metadata.username}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Email Verified:</span>
                <span className={`text-sm font-medium ${
                  user.email_confirmed_at 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {user.email_confirmed_at ? '✓ Verified' : '⚠ Not Verified'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <form action={signOut} className="w-full">
              <Button 
                type="submit" 
                variant="destructive"
                className="w-full"
              >
                Sign Out
              </Button>
            </form>

            <a 
              href="/dashboard"
              className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Go to Dashboard
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            This page is protected by Supabase Authentication
          </p>
        </div>
      </div>
    </div>
  )
}
