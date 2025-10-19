import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircleMore, Inbox } from "lucide-react";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <Card className="card">
        <CardContent className="py-12 text-center">
          <MessageCircleMore className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Message System Coming Soon</h3>
          <p className="text-muted-foreground">
            Stay tuned! The messaging feature will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
