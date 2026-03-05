"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Standings" },
  { href: "/results", label: "Results" },
  { href: "/head-to-head", label: "H2H" },
  { href: "/stats", label: "Stats" },
  { href: "/rules", label: "Rules" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  async function handleViewerSignOut() {
    await fetch("/api/auth/viewer/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            <span className="text-emerald-400">Ping Pong</span> League
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Sign out
            </button>
          ) : (
            <>
              <button
                onClick={() => signIn("google")}
                className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Admin Login
              </button>
              <button
                onClick={handleViewerSignOut}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
      {/* Mobile nav */}
      <div className="sm:hidden flex border-t border-gray-800">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 text-center py-2 text-sm font-medium transition-colors ${
              pathname === link.href
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
