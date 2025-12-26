// import Link from "next/link";

// const Navbar = () => {
//   return (
//     <nav className="w-full border-b border-gray-200 bg-white">
//       <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
//         <h1 className="text-xl font-bold text-black">MiniUrl</h1>

//         <Link
//           href="/auth/login"
//           className="border border-black px-4 py-2 rounded-lg
//           text-black hover:bg-black hover:text-white transition"
//         >
//           Login
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  const username = user?.email.split("@")[0];

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black">
          MiniUrl
        </Link>

        {/* Right side */}
        {!user ? (
          <Link
            href="/auth/login"
            className="border border-black px-4 py-2 rounded-lg
            text-black hover:bg-black hover:text-white transition"
          >
            Login
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* User button */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 border border-black px-4 py-2 rounded-lg cursor-pointer 
              text-black hover:bg-black hover:text-white transition"
            >
              <span className="font-medium">{username}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-lg overflow-hidden">
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>

                <div className="border-t">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
