import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export default function BulkActionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Bulk Actions</h1>
          <p className="text-muted-foreground">Perform actions on multiple users</p>
        </div>
      </div>

      <Card className="card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Available Bulk Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Update User Status</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Change the status of multiple users at once (Active, Inactive, Suspended)
              </p>
              <Button disabled>Coming Soon</Button>
            </div>

            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Export Users</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export user data to CSV or Excel format
              </p>
              <Button disabled>Coming Soon</Button>
            </div>

            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Send Notifications</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send email or in-app notifications to selected users
              </p>
              <Button disabled>Coming Soon</Button>
            </div>

            <div className="p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Update Balances</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add or subtract balance from multiple users
              </p>
              <Button disabled>Coming Soon</Button>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href="/admin/users">Back to Users</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
