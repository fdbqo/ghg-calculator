"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 mb-6">
      <div className="container mx-auto flex justify-center space-x-8">
        <Link href="/" className="text-lg font-medium text-gray hover:text-green-600 transition">
          Electricity⚡
        </Link>
        <Link href="/fuel" className="text-lg font-medium text-gray hover:text-green-600 transition">
          Fuel⛽
        </Link>
        <Link href="/heating" className="text-lg font-medium text-gray hover:text-green-600 transition">
          Heating🔥
        </Link>
      </div>
    </nav>
  );
}
