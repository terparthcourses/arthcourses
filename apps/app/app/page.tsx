"use client"

// Next.js Hooks
import { useRouter } from "next/navigation";

// Custom Hooks
import { useSession } from "@/lib/hooks/useSession";

// `AuthGuard` Component
import { AuthGuard } from "./(auth)/AuthGuard";

// UI Components
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const { user, signOut } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  }

  return (
    <AuthGuard authRequired redirectTo="/sign-in">
      <div className="p-4">
        {user && (
          <Button onClick={handleSignOut}>
            Sign Out
          </Button>
        )}
      </div>
    </AuthGuard>
  );
}
