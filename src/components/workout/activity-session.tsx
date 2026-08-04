"use client";

import { CirclePause, Clock3, Flag, Play, Save } from "lucide-react";
import { useState } from "react";
import { useSessionTimer } from "@/hooks/use-session-timer";
import type { ActivityWorkout } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";

function formatTimer(seconds: number) { return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`; }

export function ActivitySession({ workout }: { workout: ActivityWorkout }) {
  const timer = useSessionTimer();
  const [finishOpen, setFinishOpen] = useState(false); const [saving, setSaving] = useState(false); const [toast, setToast] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(0); const [intensity, setIntensity] = useState(6); const [distanceKm, setDistanceKm] = useState(0); const [calories, setCalories] = useState(0); const [notes, setNotes] = useState("");
  async function finish() {
    setSaving(true);
    const durationSeconds = minutes > 0 ? minutes * 60 : timer.elapsedSeconds;
    const response = await fetch("/api/workout-sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: workout.kind, activityCode: workout.activityCode, activityName: workout.activityName, durationSeconds, intensity, distanceKm: distanceKm || undefined, estimatedCalories: calories || undefined, notes: notes || undefined }) });
    setSaving(false);
    if (response.ok) { setFinishOpen(false); setToast("تم حفظ الجلسة وتحديث تقدمك."); return; }
    setToast("تعذر حفظ الجلسة. تحقق من الاتصال ثم حاول مجددًا.");
  }
  return <><div className="session-header"><div><p className="eyebrow">{workout.kind === "cardio" ? "كارديو" : "لياقة"}</p><h2>{workout.activityName}</h2><p>بدأ المؤقت تلقائيًا عند فتح الجلسة.</p></div></div><section className="activity-session-card"><Clock3 size={26} /><strong>{formatTimer(timer.elapsedSeconds)}</strong><span>{timer.isRunning ? "قيد التمرين" : "موقوف مؤقتًا"}</span><div className="hero-actions">{timer.isRunning ? <Button variant="secondary" onClick={timer.pause}><CirclePause size={17} /> إيقاف</Button> : <Button variant="secondary" onClick={timer.resume}><Play size={17} /> استكمال</Button>}<Button onClick={() => setFinishOpen(true)}><Flag size={17} /> إنهاء</Button></div></section><section className="session-card"><h3>تذكير بسيط</h3><p>يمكنك إنهاء النشاط في أي وقت. ستُراجع المدة والشدة والمسافة والسعرات قبل الحفظ.</p></section><div className="session-actions"><Button variant="secondary" onClick={() => setToast("المؤقت مستمر حتى تنهي الجلسة")}> <Save size={17} /> حفظ والمتابعة</Button><Button onClick={() => setFinishOpen(true)}><Flag size={17} /> إنهاء الجلسة</Button></div><Modal open={finishOpen} title="إنهاء الجلسة" onClose={() => setFinishOpen(false)}><div className="form-grid"><label>المدة بالدقائق <input inputMode="numeric" value={minutes || Math.ceil(timer.elapsedSeconds / 60)} onChange={(event) => setMinutes(Math.max(0, Number(event.target.value) || 0))} /></label><label>الشدة (1–10) <input type="number" min="1" max="10" value={intensity} onChange={(event) => setIntensity(Number(event.target.value) || 1)} /></label><label>المسافة بالكيلومتر <input inputMode="decimal" value={distanceKm || ""} onChange={(event) => setDistanceKm(Number(event.target.value) || 0)} /></label><label>السعرات التقديرية <input inputMode="numeric" value={calories || ""} onChange={(event) => setCalories(Number(event.target.value) || 0)} /></label></div><label>ملاحظات <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} /></label><div className="form-actions"><Button variant="secondary" onClick={() => setFinishOpen(false)}>إلغاء</Button><Button onClick={finish} disabled={saving}>{saving ? "جارٍ الحفظ…" : "حفظ وإنهاء"}</Button></div></Modal><Toast message={toast} /></>;
}
