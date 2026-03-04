"use client";

import { signIn } from "next-auth/react";

export default function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-bold text-white mb-4">
        <span className="text-emerald-400">Ping Pong</span> League
      </h2>
      <p className="text-gray-400 mb-6">Sign in to view the tournament</p>
      <button
        onClick={() => signIn("google")}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Sign in with Google
      </button>
    </div>
  );
}
