import { percent } from "@/lib/fitness";

export function ProgressBar({ value, goal, label, detail, tone = "lime" }: { value: number; goal: number; label?: string; detail?: string; tone?: "lime" | "blue" | "orange" }) {
  const completion = percent(value, goal);
  return (
    <div className="progress-block">
      {label ? <div className="progress-label"><span>{label}</span><span>{detail ?? `${completion}%`}</span></div> : null}
      <div className="progress-track" aria-label={label} aria-valuemin={0} aria-valuemax={goal} aria-valuenow={value} role="progressbar">
        <span className={`progress-fill progress-fill--${tone}`} style={{ width: `${completion}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({ value, goal, label, sublabel, tone = "lime" }: { value: number; goal: number; label: string; sublabel: string; tone?: "lime" | "blue" | "orange" }) {
  const completion = percent(value, goal);
  return (
    <div className={`progress-ring progress-ring--${tone}`} style={{ "--progress": `${completion * 3.6}deg` } as React.CSSProperties}>
      <div className="progress-ring__inner"><strong>{label}</strong><span>{sublabel}</span></div>
    </div>
  );
}
