"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function BillingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">Loading plans...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">
          You must be logged in.{" "}
          <Link href="/auth/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center bg-white text-black px-4 py-10">
      <div className="w-full max-w-4xl border border-gray-200 rounded-xl bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold">Upgrade your plan</h1>
          <p className="text-sm text-gray-600 mt-1">
            Unlock powerful features to grow faster with MiniUrl
          </p>
        </div>

        {/* Current Plan */}
        <div className="mb-10 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-600">Current plan</p>
          <p className="text-lg font-medium mt-1">{user.plan}</p>
        </div>

        {/* Coming Soon */}
        <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center mb-10">
          <h2 className="text-xl font-semibold mb-2">
            🚀 Premium plans coming soon
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            We’re actively building advanced features to help you track,
            optimize, and scale your shortened links.
          </p>
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <Feature title="Real-time analytics">
            Live click tracking with interactive graphs and charts.
          </Feature>

          <Feature title="Advanced insights">
            Country, device, browser, and referrer breakdowns.
          </Feature>

          <Feature title="Custom domains">
            Use your own branded domains for short links.
          </Feature>

          <Feature title="Higher limits">
            Create more links with increased click & API limits.
          </Feature>

          <Feature title="Link expiration & rules">
            Set expiration dates, redirects, and access rules.
          </Feature>

          <Feature title="Priority support">
            Faster support and early access to new features.
          </Feature>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
          <Link href="/dashboard" className="underline hover:text-gray-700">
            Back to dashboard
          </Link>

          <button
            disabled
            className="border border-gray-300 px-6 py-3 rounded-lg text-gray-400 cursor-not-allowed"
          >
            Upgrade (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}
