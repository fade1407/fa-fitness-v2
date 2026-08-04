import {
  CalendarDays,
  ChartNoAxesCombined,
  Dumbbell,
  House,
  Settings,
  Soup,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = { href: string; label: string; icon: LucideIcon };

export const primaryNavigation: NavigationItem[] = [
  { href: "/dashboard", label: "الرئيسية", icon: House },
  { href: "/workouts", label: "التمارين", icon: Dumbbell },
  { href: "/progress", label: "التقدم", icon: ChartNoAxesCombined },
  { href: "/nutrition", label: "التغذية", icon: Soup },
  { href: "/settings", label: "حسابي", icon: Settings },
];

export const secondaryNavigation: NavigationItem[] = [
  { href: "/calendar", label: "التقويم", icon: CalendarDays },
];
