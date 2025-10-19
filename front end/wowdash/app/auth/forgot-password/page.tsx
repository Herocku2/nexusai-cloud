import { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password | Nexus AI",
  description: "Reset your Nexus AI account password",
};

export default function ForgotPasswordPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-slate-900 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">N</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nexus AI
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
              Forgot Password?
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </section>
  );
}
