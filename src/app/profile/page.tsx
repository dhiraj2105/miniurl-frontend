"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-500">
          You are not logged in.{" "}
          <Link href="/auth/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center bg-white text-black px-4 py-10">
      <div className="w-full max-w-3xl border border-gray-200 rounded-xl bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
              {user.email}
            </div>
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current plan
            </label>
            <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3">
              <span className="font-medium">{user.plan}</span>
              <Link
                href="/billing"
                className="text-sm underline hover:text-gray-700"
              >
                Upgrade
              </Link>
            </div>
          </div>

          {/* Account creation date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Member since
            </label>
            <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="border border-black px-4 py-2 rounded-lg text-center
            hover:bg-black hover:text-white transition"
          >
            Back to Dashboard
          </Link>

          <button
            disabled
            className="border border-gray-300 px-4 py-2 rounded-lg text-gray-400 cursor-not-allowed"
          >
            Change Password (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
