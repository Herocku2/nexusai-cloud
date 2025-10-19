import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTestUser } from "@/app/actions/create-test-user";
import { redirect } from "next/navigation";

export default function SetupPage() {
  async function handleCreateUsers() {
    'use server'
    const results = await createTestUser()
    console.log('Test users creation results:', results)
  }

  async function handleRedirectToLogin() {
    'use server'
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Setup Database - Test Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="font-semibold mb-2">Test Users to Create:</h3>
            <ul className="space-y-2 text-sm">
              <li className="p-2 bg-red-500/10 border border-red-500/20 rounded">
                <strong className="text-red-600">ADMIN USER:</strong><br />
                <strong>Email:</strong> admin@nexusai.com<br />
                <strong>Password:</strong> NexusAdmin2024!SecurePass
              </li>
              <li>
                <strong>Email:</strong> demo@nexusai.com<br />
                <strong>Password:</strong> Demo2024!Test
              </li>
              <li>
                <strong>Email:</strong> usuario@nexusai.com<br />
                <strong>Password:</strong> Usuario2024!
              </li>
            </ul>
          </div>

          <form action={handleCreateUsers}>
            <Button type="submit" className="w-full">
              Create Test Users
            </Button>
          </form>

          <form action={handleRedirectToLogin}>
            <Button type="submit" variant="outline" className="w-full">
              Go to Login
            </Button>
          </form>

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm">
              <strong>Note:</strong> Check the server console for creation results.
              If users already exist, you'll see an error which is normal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
