import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TableTales — AI Vibe Concierge Dining Platform",
  description: "Transform restaurant discovery into an immersive sensory journey. Natural language mood analysis curates dishes, tells origin stories, and syncs group ordering.",
  keywords: ["AI dining", "restaurant discovery", "concierge", "sensory dining", "group ordering", "TableTales"],
  openGraph: {
    title: "TableTales — AI Vibe Concierge Dining Platform",
    description: "Speak your mood. Taste the atmosphere. Immersive culinary discovery powered by AI and real-time group syncing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-vibe="romantic"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
