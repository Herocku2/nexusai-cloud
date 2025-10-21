import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Nexus AI MLM",
  description: "Administrator login for Nexus AI MLM platform",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout sin sidebar para la página de login
  return <>{children}</>;
}
