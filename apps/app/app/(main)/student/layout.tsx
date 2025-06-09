// ./(main)/student/layout.tsx

// UI Components
import Container from "@/components/container";
import { ModeToggle } from "@/components/mode-toggle";
import { UserDropdown } from "@/app/(auth)/UserDropdown";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}