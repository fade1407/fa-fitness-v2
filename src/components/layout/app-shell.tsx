"use client";

import { Bell, ChevronLeft, Dumbbell, Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { primaryNavigation, secondaryNavigation } from "@/constants/navigation";
import { InstallPrompt } from "./install-prompt";
import { ServiceWorker } from "./service-worker";
import { ThemeToggle } from "./theme-toggle";

const publicRoutes = ["/login", "/onboarding", "/offline"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (publicRoutes.includes(pathname)) return <>{children}<ServiceWorker /></>;
  const currentTitle = [...primaryNavigation, ...secondaryNavigation].find((item) => pathname.startsWith(item.href))?.label ?? "FA FITNESS";
  return <div className="app-shell"><aside className={`sidebar ${open ? "sidebar--open" : ""}`}><div className="brand"><span className="brand-mark"><Dumbbell size={20} /></span><div><strong>FA FITNESS</strong><small>الأداء الشخصي</small></div><button className="sidebar-close icon-button" onClick={() => setOpen(false)} aria-label="إغلاق القائمة"><ChevronLeft size={18} /></button></div><nav className="sidebar-nav" aria-label="التنقل الرئيسي">{primaryNavigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname.startsWith(href) ? "nav-link nav-link--active" : "nav-link"} onClick={() => setOpen(false)}><Icon size={19} /><span>{label}</span></Link>)}<div className="nav-divider" />{secondaryNavigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname.startsWith(href) ? "nav-link nav-link--active" : "nav-link"} onClick={() => setOpen(false)}><Icon size={19} /><span>{label}</span></Link>)}</nav><div className="sidebar-callout"><Sparkles size={17} /><p>سلسلتك الحالية <strong>6 أيام</strong></p></div></aside><div className="app-main"><header className="topbar"><button className="mobile-menu icon-button" onClick={() => setOpen(true)} aria-label="فتح القائمة"><Menu size={21} /></button><div><p className="eyebrow">FA FITNESS</p><h1>{currentTitle}</h1></div><div className="topbar-actions"><InstallPrompt /><ThemeToggle /><button className="icon-button" aria-label="الإشعارات"><Bell size={19} /><span className="notification-dot" /></button><span className="avatar">ف</span></div></header><main className="page-content">{children}</main></div><nav className="bottom-nav" aria-label="تنقل الجوال">{primaryNavigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname.startsWith(href) ? "bottom-nav__link bottom-nav__link--active" : "bottom-nav__link"}><Icon size={20} /><span>{label}</span></Link>)}</nav><div className={open ? "sidebar-backdrop sidebar-backdrop--open" : "sidebar-backdrop"} onClick={() => setOpen(false)} /></div>;
}
