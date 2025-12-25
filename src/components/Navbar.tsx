import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-black">MiniUrl</h1>

        <Link
          href="/auth/login"
          className="border border-black px-4 py-2 rounded-lg
          text-black hover:bg-black hover:text-white transition"
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
