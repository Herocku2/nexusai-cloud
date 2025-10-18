import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { getProfile, updateProfile } from "@/app/actions/profile";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      {/* Profile Info Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue={profile?.first_name || ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={profile?.last_name || ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone || ""}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country Code</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={profile?.country_code || ""}
                  placeholder="US"
                />
              </div>

              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Account Info */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user.id.slice(0, 8)}...</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sponsor ID</p>
                <p className="font-medium">
                  {profile?.sponsor_id ? profile.sponsor_id.slice(0, 8) + "..." : "None"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    profile?.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {profile?.status?.toUpperCase() || "PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Email Verified</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.email_confirmed_at
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {user.email_confirmed_at ? "VERIFIED" : "NOT VERIFIED"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Membership Type</p>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                  STANDARD
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wallet Address Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle>USDT Wallet Address</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">TRC20 Address</Label>
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  type="text"
                  defaultValue={profile?.wallet_address || ""}
                  placeholder="Enter your TRC20 USDT wallet address"
                />
                <p className="text-xs text-muted-foreground">
                  This address will be used for withdrawals
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="walletAddressERC20">ERC20 Address (Optional)</Label>
                <Input
                  id="walletAddressERC20"
                  name="walletAddressERC20"
                  type="text"
                  placeholder="Enter your ERC20 USDT wallet address"
                />
                <p className="text-xs text-muted-foreground">
                  Alternative withdrawal option
                </p>
              </div>
            </div>

            <Button type="submit">
              Update Wallet Address
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Referral Link Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Share this link to invite new members</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  readOnly
                  value={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/register?sponsor=${user.id}`}
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/register?sponsor=${user.id}`
                    );
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
