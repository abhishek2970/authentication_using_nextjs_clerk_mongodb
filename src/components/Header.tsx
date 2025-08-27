"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full bg-gray-900 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide hover:text-gray-300 transition">
          MyApp
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            About
          </Link>

          {/* Auth Section */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
