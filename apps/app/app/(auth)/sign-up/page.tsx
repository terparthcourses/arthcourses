"use client"

// Next.js Components
import Link from "next/link";

// UI Components
import { SignUpForm } from "./SignUpForm";

// `AuthGuard` Component
import { AuthGuard } from "../AuthGuard";

// Lucide Icons
import { GraduationCap } from "lucide-react";

export default function SignUpPage() {
  return (
    <AuthGuard guestOnly={true} redirectTo="/">
      <div className="flex h-screen w-full items-center justify-center px-4">
        <div className="mx-auto max-w-md w-full px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-4">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-center">Get Started</h1>
            <p className="text-muted-foreground text-center mt-2">
              Create your account to begin learning
            </p>
          </div>

          <SignUpForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}