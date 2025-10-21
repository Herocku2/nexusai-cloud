import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { getProfile, updateProfile } from "@/app/actions/profile";
import { getTranslations } from "@/lib/translations";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations('profile_page');
  
  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('myProfile')}</h1>
      </div>

      {/* Profile Info Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('personalInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('firstName')}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue={profile?.first_name || ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">{t('lastName')}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={profile?.last_name || ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone || ""}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t('countryCode')}</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={profile?.country_code || ""}
                  placeholder="US"
                />
              </div>

              <Button type="submit" className="w-full">
                {t('updateProfile')}
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
                {t('accountInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">{t('email')}</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('userId')}</p>
                <p className="font-mono text-sm">{user.id.slice(0, 8)}...</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('sponsorId')}</p>
                <p className="font-medium">
                  {profile?.sponsor_id ? profile.sponsor_id.slice(0, 8) + "..." : t('none')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('memberSince')}</p>
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
                {t('accountStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{t('status')}</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    profile?.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {profile?.status?.toUpperCase() || t('pending').toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{t('emailVerified')}</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.email_confirmed_at
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {user.email_confirmed_at ? t('verified').toUpperCase() : t('notVerified').toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{t('membershipType')}</p>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                  {t('standard').toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wallet Address Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle>{t('usdtWalletAddress')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">{t('trc20Address')}</Label>
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  type="text"
                  defaultValue={profile?.wallet_address || ""}
                  placeholder={t('trc20Placeholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('trc20Helper')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="walletAddressERC20">{t('erc20Address')}</Label>
                <Input
                  id="walletAddressERC20"
                  name="walletAddressERC20"
                  type="text"
                  placeholder={t('erc20Placeholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('erc20Helper')}
                </p>
              </div>
            </div>

            <Button type="submit">
              {t('updateWalletAddress')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Referral Link Card */}
      <Card className="card">
        <CardHeader>
          <CardTitle>{t('yourReferralLink')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>{t('shareLink')}</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  readOnly
                  value={`https://nexusai.cloud/auth/register?sponsor=${user.id}`}
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://nexusai.cloud/auth/register?sponsor=${user.id}`
                    );
                  }}
                >
                  {t('copy')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
