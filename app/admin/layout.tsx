import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Users, BookOpen, DollarSign, Settings, LayoutDashboard, CreditCard, TrendingUp, GitBranch } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Area - Nexus AI MLM",
  description: "Administration panel for Nexus AI MLM platform",
};

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Binary Tree', href: '/admin/binary-tree', icon: GitBranch },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen },
  { name: 'Withdrawals', href: '/admin/withdrawals', icon: DollarSign },
  { name: 'Deposits', href: '/admin/deposits', icon: TrendingUp },
  { name: 'Memberships', href: '/admin/memberships', icon: CreditCard },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-bold text-lg">Admin Area</h2>
              <p className="text-xs text-muted-foreground">Nexus AI MLM</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm">User Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
