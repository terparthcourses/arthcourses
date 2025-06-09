"use client"

// Next.js Hooks
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Custom Hooks
import { useSession } from "@/lib/hooks/useSession";

// `AuthGuard` Component
import { AuthGuard } from "./(auth)/AuthGuard";

// Lucide Icons
import { LoaderCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/student");
  }, [router]);
  return (
    <AuthGuard authRequired redirectTo="/sign-in">
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    </AuthGuard>
  );
}
