"use client"

// Next.js Components
import Link from "next/link";

// UI Components
import { SignInForm } from "./SignInForm";

// `AuthGuard` Component
import { AuthGuard } from "../AuthGuard";

// Lucide Icons
import { GraduationCap } from "lucide-react";

export default function SignInPage() {
  return (
    <AuthGuard guestOnly={true} redirectTo="/">
      <div className="flex h-screen w-full items-center justify-center px-4">
        <div className="mx-auto max-w-md w-full px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-4">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
            <p className="text-muted-foreground text-center mt-2">
              Sign in to continue your learning journey
            </p>
          </div>

          <SignInForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}