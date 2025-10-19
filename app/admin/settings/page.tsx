import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSystemSettings, updateSystemSetting } from "@/app/actions/admin-courses";
import { Settings, Save } from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();

  async function handleUpdate(formData: FormData) {
    'use server'
    const key = formData.get('key') as string;
    const value = formData.get('value') as string;
    await updateSystemSetting(key, value);
  }

  // Default settings if none exist
  const defaultSettings = [
    { key: 'min_withdrawal_amount', value: '20', description: 'Minimum withdrawal amount in USDT' },
    { key: 'withdrawal_fee_percentage', value: '10', description: 'Withdrawal fee percentage' },
    { key: 'min_deposit_amount', value: '100', description: 'Minimum deposit amount in USDT' },
    { key: 'initial_membership_cost', value: '89', description: 'Initial membership cost in USDT' },
    { key: 'monthly_membership_cost', value: '89', description: 'Monthly membership cost in USDT' },
    { key: 'fast_start_level1_commission', value: '40', description: 'Fast Start Level 1 commission' },
    { key: 'fast_start_level2_commission', value: '8', description: 'Fast Start Level 2 commission' },
    { key: 'binary_commission_percentage', value: '50', description: 'Binary commission percentage' },
    { key: 'max_binary_depth', value: '10', description: 'Maximum binary tree depth' },
    { key: 'support_email', value: 'support@nexusai.com', description: 'Support email address' },
  ];

  const displaySettings = settings.length > 0 ? settings : defaultSettings;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure platform parameters and business rules
          </p>
        </div>
        <Settings className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {displaySettings.map((setting: any) => (
          <Card key={setting.key}>
            <CardHeader>
              <CardTitle className="text-base capitalize">
                {setting.key.replace(/_/g, ' ')}
              </CardTitle>
              <CardDescription>
                {setting.description || 'System configuration parameter'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleUpdate} className="space-y-4">
                <input type="hidden" name="key" value={setting.key} />
                <div className="space-y-2">
                  <Label htmlFor={setting.key}>Value</Label>
                  <div className="flex gap-2">
                    <Input
                      id={setting.key}
                      name="value"
                      defaultValue={setting.value}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Type: {setting.type || 'string'}
                </p>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-yellow-700 dark:text-yellow-400">
          <p>• Changes to these settings affect the entire platform</p>
          <p>• Commission percentages are in whole numbers (e.g., 50 = 50%)</p>
          <p>• Amounts are in USDT</p>
          <p>• Some changes may require platform restart to take effect</p>
          <p>• Always test changes in a staging environment first</p>
        </CardContent>
      </Card>
    </div>
  );
}
