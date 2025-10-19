import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Network } from "lucide-react";

export default function MLMSettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MLM Configuration</h1>
        <p className="text-muted-foreground">Configure MLM system and binary tree settings</p>
      </div>

      <div className="grid gap-6">
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Commission Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fastStartL1">Fast Start Level 1 (%)</Label>
                  <Input
                    id="fastStartL1"
                    name="fastStartL1"
                    type="number"
                    defaultValue="40"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fastStartL2">Fast Start Level 2 (%)</Label>
                  <Input
                    id="fastStartL2"
                    name="fastStartL2"
                    type="number"
                    defaultValue="15"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fastStartL3">Fast Start Level 3 (%)</Label>
                  <Input
                    id="fastStartL3"
                    name="fastStartL3"
                    type="number"
                    defaultValue="10"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="binaryCommission">Binary Commission (%)</Label>
                  <Input
                    id="binaryCommission"
                    name="binaryCommission"
                    type="number"
                    defaultValue="10"
                    disabled
                  />
                </div>
              </div>
              <Button disabled>Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Binary Tree Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxDepth">Maximum Tree Depth</Label>
                  <Input
                    id="maxDepth"
                    name="maxDepth"
                    type="number"
                    defaultValue="10"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spilloverEnabled">Spillover Enabled</Label>
                  <select
                    id="spilloverEnabled"
                    name="spilloverEnabled"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="true"
                    disabled
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="autoPlacement">Auto Placement</Label>
                  <select
                    id="autoPlacement"
                    name="autoPlacement"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="balanced"
                    disabled
                  >
                    <option value="left">Left First</option>
                    <option value="right">Right First</option>
                    <option value="balanced">Balanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pvCarryover">PV Carryover Enabled</Label>
                  <select
                    id="pvCarryover"
                    name="pvCarryover"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="true"
                    disabled
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <Button disabled>Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle>Rank Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Bronze</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>• Direct Referrals: 3</p>
                  <p>• Left PV: 300</p>
                  <p>• Right PV: 300</p>
                  <p>• Matching Bonus: 5% (3 levels)</p>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Silver</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>• Direct Referrals: 5</p>
                  <p>• Left PV: 1,000</p>
                  <p>• Right PV: 1,000</p>
                  <p>• Matching Bonus: 7% (5 levels)</p>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-2">Gold</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>• Direct Referrals: 10</p>
                  <p>• Left PV: 5,000</p>
                  <p>• Right PV: 5,000</p>
                  <p>• Matching Bonus: 10% (7 levels)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> MLM configuration changes will be fully editable in the next update. 
              Current values are default settings and require database migration to modify.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
