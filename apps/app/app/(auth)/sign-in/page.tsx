"use client"

// Next.js Components
import Link from "next/link";

// UI Components
import { SignInForm } from "./SignInForm";

// `AuthGuard` Component
import { AuthGuard } from "../AuthGuard";

export default function SignInPage() {
  return (
    <AuthGuard guestOnly={true} redirectTo="/">
      <div className="flex h-screen w-full items-center justify-center px-4">
        <div className="mx-auto max-w-md w-full px-4 py-12 sm:px-6 lg:px-8">
          <SignInForm />
        </div>
      </div>
    </AuthGuard>
  );
}