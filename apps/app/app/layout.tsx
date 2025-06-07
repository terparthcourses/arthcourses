import "./globals.css";

// Next.js Metadata API
import type { Metadata } from "next";

// Google Fonts
import { Geist, Geist_Mono } from "next/font/google";

// `ThemeProvider` Component
import { ThemeProvider } from "@/components/theme-provider";

// `AuthProvider` Component
import { AuthProvider } from './(auth)/AuthProvider'

// React Query Provider
import { ReactQueryProvider } from "@/lib/react-query-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Articles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-card/50`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}