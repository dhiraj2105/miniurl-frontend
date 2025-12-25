"use client";

import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Dashboard (Coming Soon)</h1>

      <button
        onClick={handleLogout}
        className="bg-black text-white px-6 py-2 rounded-lg border 
        cursor-pointer"
      >
        Logout
      </button>
    </main>
  );
}
