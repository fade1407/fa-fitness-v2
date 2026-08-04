"use client";

import { Activity, ArrowLeft, Dumbbell, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { trainingActivities, type ActivityCategory } from "@/constants/training-activities";
import { Button } from "@/components/ui/button";

export function TrainingStart() {
  const [showActivities, setShowActivities] = useState(false);
  const [category, setCategory] = useState<ActivityCategory>("cardio");
  const activities = trainingActivities.filter((activity) => activity.category === category);
  if (!showActivities) return <div className="start-grid"><Link href="/workouts/session/resistance" className="start-choice"><Dumbbell size={26} /><div><h2>تمرين مقاومة</h2><p>يفتح جلسة اليوم من باقتك النشطة تلقائيًا.</p></div><ArrowLeft size={18} /></Link><button className="start-choice" onClick={() => setShowActivities(true)}><HeartPulse size={26} /><div><h2>كارديو ولياقة</h2><p>اختر النشاط ثم يبدأ المؤقت مباشرة.</p></div><ArrowLeft size={18} /></button></div>;
  return <section><div className="page-intro"><div><p className="eyebrow">ابدأ الآن</p><h2>كارديو ولياقة</h2><p>اختر نشاطًا واحدًا؛ يمكنك تعديل التفاصيل عند الإنهاء.</p></div><Button variant="secondary" onClick={() => setShowActivities(false)}>رجوع</Button></div><div className="activity-tabs" role="tablist"><button className={category === "cardio" ? "activity-tab activity-tab--active" : "activity-tab"} onClick={() => setCategory("cardio")} role="tab">الكارديو</button><button className={category === "fitness" ? "activity-tab activity-tab--active" : "activity-tab"} onClick={() => setCategory("fitness")} role="tab">اللياقة</button></div><div className="activity-grid">{activities.map((activity) => <Link className="activity-choice" href={`/workouts/session/${activity.category}?activity=${activity.code}`} key={activity.code}><Activity size={18} /><span>{activity.nameAr}</span><ArrowLeft size={16} /></Link>)}</div></section>;
}
