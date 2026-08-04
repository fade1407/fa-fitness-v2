import type { LucideIcon } from "lucide-react";
import { Card } from "./card";

export function MetricCard({ icon: Icon, label, value, suffix, change, tone = "lime" }: { icon: LucideIcon; label: string; value: string | number; suffix?: string; change?: string; tone?: "lime" | "blue" | "orange" }) {
  return <Card className="metric-card"><span className={`metric-icon metric-icon--${tone}`}><Icon size={19} /></span><p>{label}</p><div><strong>{value}</strong>{suffix ? <span>{suffix}</span> : null}</div>{change ? <small>{change}</small> : null}</Card>;
}
