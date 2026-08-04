"use client";

import { Dumbbell, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { exerciseLibrary } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export function ExerciseLibrary() {
  const [query, setQuery] = useState(""); const [muscle, setMuscle] = useState("الكل");
  const muscles = ["الكل", ...new Set(exerciseLibrary.map((exercise) => exercise.primaryMuscle))];
  const visibleExercises = useMemo(() => exerciseLibrary.filter((exercise) => (muscle === "الكل" || exercise.primaryMuscle === muscle) && `${exercise.nameAr} ${exercise.nameEn}`.toLowerCase().includes(query.toLowerCase())), [query, muscle]);
  return <><div className="page-intro"><div><p className="eyebrow">مكتبتك</p><h2>التمارين</h2><p>ابحث، صفِّ، وأدر تمارينك الشخصية.</p></div><Button><Plus size={18} /> إضافة تمرين</Button></div><div className="toolbar"><div className="search-input"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم تمرين…" aria-label="البحث في التمارين" /></div><select className="filter-select" value={muscle} onChange={(event) => setMuscle(event.target.value)} aria-label="فلترة حسب العضلة">{muscles.map((item) => <option key={item}>{item}</option>)}</select><Button variant="secondary" size="sm"><SlidersHorizontal size={17} /> فلاتر</Button></div>{visibleExercises.length ? <div className="exercise-grid">{visibleExercises.map((exercise) => <Card key={exercise.id} className="exercise-card"><div className="exercise-card__top"><div><h3>{exercise.nameAr}</h3><p>{exercise.nameEn}</p></div><span className="pill">{exercise.difficulty}</span></div><div className="exercise-meta"><span className="pill">{exercise.primaryMuscle}</span><span className="pill">{exercise.equipment}</span><span className="pill">{exercise.movement}</span></div><div className="exercise-footer"><span>{exercise.targetSets} مجموعات × {exercise.targetReps}</span><Button variant="ghost" size="sm"><Dumbbell size={16} /> إضافة</Button></div></Card>)}</div> : <EmptyState title="لا توجد تمارين مطابقة" description="جرّب كلمة بحث أو فلترًا مختلفًا." actionLabel="مسح الفلاتر" onAction={() => { setQuery(""); setMuscle("الكل"); }} />}</>;
}
