"use client";

// Custom Hooks
import { useSession } from "@/lib/hooks/useSession";

// Next.js Hooks
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Lucide Icons
import {
  LogOutIcon,
  UserIcon,
  LoaderCircle,
  NotebookPen,
  NotebookText,
  ShieldUser
} from "lucide-react";

export function UserDropdown() {
  const router = useRouter();

  const {
    signOut,
    user,
    loading
  } = useSession();

  const path = usePathname();
  const isStudentPath = path.includes("/student");
  const isTeacherPath = path.includes("/teacher");
  const isAdminPath = path.includes("/administrator");

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            aria-label="Open account menu"
            className="hover:cursor-pointer"
          >
            <UserIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64">
          <DropdownMenuLabel className="flex items-start gap-3">
            <div className="flex min-w-0 flex-col">
              {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                  <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
                </div>
              ) : (
                <>
                  <span className="text-foreground truncate text-sm font-medium">
                    {user?.name || ""}
                  </span>
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {user?.email || ""}
                  </span>
                </>
              )}
            </div>
          </DropdownMenuLabel>
          {
            (user && (user.role === "TEACHER" || user.role === "ADMINISTRATOR" || user.role === "STUDENT")) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/student")}
                  className="cursor-pointer"
                  disabled={isStudentPath}
                >
                  <NotebookText size={16} className="text-muted-foreground" aria-hidden="true" />
                  <span>Student View</span>
                </DropdownMenuItem>
              </>
            )
          }
          {
            (user && (user.role === "TEACHER" || user.role === "ADMINISTRATOR")) && (
              <>
                <DropdownMenuItem
                  onClick={() => router.push("/teacher")}
                  className="cursor-pointer"
                  disabled={isTeacherPath}
                >
                  <NotebookPen size={16} className="text-muted-foreground" aria-hidden="true" />
                  <span>Teacher View</span>
                </DropdownMenuItem>
              </>
            )
          }
          {
            user && user.role === "ADMINISTRATOR" && (
              <>
                <DropdownMenuItem
                  onClick={() => router.push("/admin")}
                  className="cursor-pointer"
                  disabled={isAdminPath}
                >
                  <ShieldUser size={16} className="text-muted-foreground" aria-hidden="true" />
                  <span>Admin View</span>
                </DropdownMenuItem>
              </>
            )
          }
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOutIcon size={16} aria-hidden="true" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}