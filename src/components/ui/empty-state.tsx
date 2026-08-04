import { Inbox } from "lucide-react";
import { Button } from "./button";

export function EmptyState({ title, description, actionLabel, onAction }: { title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  return <div className="empty-state"><span><Inbox size={28} /></span><h3>{title}</h3><p>{description}</p>{actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}</div>;
}
