import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getExpiringMemberships } from "@/app/actions/admin-courses";

export default async function ExpiringMembershipsPage() {
  const memberships = await getExpiringMemberships(7); // Próximos 7 días

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/memberships">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Expiring Memberships</h1>
          <p className="text-muted-foreground">Memberships expiring in the next 7 days</p>
        </div>
      </div>

      {memberships.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No memberships expiring in the next 7 days
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {memberships.map((membership: any) => {
            const expiryDate = new Date(membership.expires_at);
            const now = new Date();
            const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const isExpired = daysLeft < 0;
            const isUrgent = daysLeft <= 2;

            return (
              <Card key={membership.id} className={`card ${isExpired ? 'border-red-500' : isUrgent ? 'border-yellow-500' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {membership.user?.first_name} {membership.user?.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{membership.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">${Number(membership.amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="font-medium">{expiryDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days Left</p>
                    <p className={`font-bold ${isExpired ? 'text-red-500' : isUrgent ? 'text-yellow-500' : 'text-green-500'}`}>
                      {isExpired ? 'EXPIRED' : `${daysLeft} days`}
                    </p>
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/admin/memberships">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
