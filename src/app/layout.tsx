import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/copy";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = { title: { default: APP_NAME, template: `%s | ${APP_NAME}` }, description: APP_DESCRIPTION, applicationName: APP_NAME, manifest: "/manifest.webmanifest", appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: APP_NAME }, icons: { icon: "/icons/icon.svg", apple: "/icons/icon.svg" } };
export const viewport: Viewport = { themeColor: "#111412", colorScheme: "dark light", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body><AppShell>{children}</AppShell></body></html>;
}
