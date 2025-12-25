import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 mt-auto bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} MiniUrl. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
