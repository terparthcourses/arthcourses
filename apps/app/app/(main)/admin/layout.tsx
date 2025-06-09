// ./(main)/admin/layout.tsx

// UI Components
import Container from "@/components/container";
import { ModeToggle } from "@/components/mode-toggle";
import { UserDropdown } from "@/app/(auth)/UserDropdown";

// `AuthGuard` Component
import { AuthGuard } from "@/app/(auth)/AuthGuard";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["ADMINISTRATOR"]} authRequired>
      <>
        <div className="border-b border-[var(--border)]">
          <Container>
            <nav className="flex justify-between items-center py-4">
              <h1 className="text-xl font-medium flex items-center gap-4">
                Art History Courses
              </h1>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <UserDropdown />
              </div>
            </nav>
          </Container>
        </div>

        <div>
          {children}
        </div>
      </>
    </AuthGuard>
  );
}