import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getExpiringMemberships, extendMembership } from "@/app/actions/admin-courses";
import { Calendar, Clock, User, DollarSign } from "lucide-react";

export default async function AdminMembershipsPage() {
  const memberships = await getExpiringMemberships(30);

  async function handleExtend(formData: FormData) {
    'use server'
    const membershipId = parseInt(formData.get('membershipId') as string);
    const days = parseInt(formData.get('days') as string);
    await extendMembership(membershipId, days);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Membership Management</h1>
          <p className="text-muted-foreground mt-1">
            Memberships expiring in the next 30 days
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {memberships.length} Expiring Soon
        </Badge>
      </div>

      {memberships.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Expiring Memberships</h3>
            <p className="text-muted-foreground">
              All memberships are current
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {memberships.map((membership: any) => {
            const expiryDate = new Date(membership.expires_at);
            const daysUntilExpiry = Math.ceil(
              (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            const isExpired = daysUntilExpiry < 0;
            const isUrgent = daysUntilExpiry <= 7 && daysUntilExpiry >= 0;

            return (
              <Card key={membership.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {membership.user?.first_name} {membership.user?.last_name}
                        <Badge 
                          variant={isExpired ? "destructive" : isUrgent ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {isExpired ? "Expired" : isUrgent ? "Urgent" : "Active"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        User ID: {membership.user_id}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold flex items-center gap-1">
                        <DollarSign className="w-5 h-5" />
                        {Number(membership.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {membership.type}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Started</p>
                      <p className="text-sm mt-1">
                        {new Date(membership.started_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Expires</p>
                      <p className={`text-sm mt-1 font-semibold ${
                        isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {expiryDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                      <p className={`text-sm mt-1 font-bold ${
                        isExpired ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {isExpired ? 'Expired' : `${daysUntilExpiry} days`}
                      </p>
                    </div>
                  </div>

                  <form action={handleExtend} className="flex gap-3 pt-4 border-t">
                    <input type="hidden" name="membershipId" value={membership.id} />
                    <div className="flex-1">
                      <Label htmlFor={`days-${membership.id}`} className="sr-only">
                        Days to extend
                      </Label>
                      <Input
                        id={`days-${membership.id}`}
                        name="days"
                        type="number"
                        placeholder="Days to extend"
                        defaultValue="30"
                        min="1"
                        max="365"
                        className="h-10"
                      />
                    </div>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      Extend Membership
                    </Button>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
