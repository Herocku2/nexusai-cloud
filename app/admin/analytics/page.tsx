import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Business insights and performance metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart Coming Soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart Coming Soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Users by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Map Coming Soon</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Commission Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">Chart Coming Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Average Order Value</p>
              <p className="text-2xl font-bold mt-2">$89.00</p>
              <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold mt-2">3.2%</p>
              <p className="text-xs text-green-500 mt-1">↑ 0.8% from last month</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Retention Rate</p>
              <p className="text-2xl font-bold mt-2">68%</p>
              <p className="text-xs text-red-500 mt-1">↓ 2% from last month</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Churn Rate</p>
              <p className="text-2xl font-bold mt-2">5.4%</p>
              <p className="text-xs text-green-500 mt-1">↓ 1.2% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            <strong>Coming Soon:</strong> Advanced analytics with interactive charts, real-time data, 
            and customizable dashboards will be available in the next update. Integration with popular 
            analytics tools is also planned.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
