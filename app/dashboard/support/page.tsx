import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Mail, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Help & Support</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Help Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Browse our knowledge base for answers to common questions.
            </p>
            <Button variant="outline" className="w-full">
              Browse Articles
            </Button>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-primary" />
              FAQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Quick answers to frequently asked questions.
            </p>
            <Button variant="outline" className="w-full">
              View FAQs
            </Button>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Need help? Our support team is here for you.
            </p>
            <Button variant="outline" className="w-full">
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="card">
        <CardHeader>
          <CardTitle>Getting Started Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold">1. Complete Your Profile</h4>
            <p className="text-sm text-muted-foreground">
              Make sure your profile information is complete and accurate.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">2. Activate Your Membership</h4>
            <p className="text-sm text-muted-foreground">
              Deposit $100 USDT to activate your membership and start earning commissions.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">3. Build Your Team</h4>
            <p className="text-sm text-muted-foreground">
              Share your referral link and start building your binary network.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">4. Access the Academy</h4>
            <p className="text-sm text-muted-foreground">
              Learn about AI and improve your skills with our educational content.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">5. Track Your Earnings</h4>
            <p className="text-sm text-muted-foreground">
              Monitor your commissions and team performance in the dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
