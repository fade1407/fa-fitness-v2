"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const subscribe = () => () => undefined;
const serverTheme = () => true;
function browserTheme() {
  const stored = window.localStorage.getItem("fa-fitness-theme");
  return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const savedTheme = useSyncExternalStore(subscribe, browserTheme, serverTheme);
  const [override, setOverride] = useState<boolean | null>(null);
  const dark = override ?? savedTheme;
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  function toggleTheme() {
    const next = !dark;
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("fa-fitness-theme", next ? "dark" : "light");
    setOverride(next);
  }
  return <button className="icon-button" onClick={toggleTheme} aria-label={dark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>;
}
