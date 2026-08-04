import type { Metadata, Viewport } from "next";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/copy";
import { AppShell } from "@/components/layout/app-shell";

const APP_ICON = "/icons/fa-fitness-v2-icon-1024.png";

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: APP_NAME },
  icons: {
    icon: [{ url: APP_ICON, sizes: "1024x1024", type: "image/png" }],
    apple: [{ url: APP_ICON, sizes: "1024x1024", type: "image/png" }],
  },
};
export const viewport: Viewport = { themeColor: "#111412", colorScheme: "dark light", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" suppressHydrationWarning><body><AppShell>{children}</AppShell></body></html>;
}
