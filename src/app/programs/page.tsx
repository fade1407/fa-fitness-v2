import { Archive, CalendarDays, Copy, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
const programs = [{ name: "Full Body A / B / C", state: "نشط", days: "3 أيام أسبوعيًا", progress: "الأسبوع 4 من 8" }, { name: "قوة الأساس", state: "مسودة", days: "4 أيام أسبوعيًا", progress: "لم يبدأ" }];
export default function ProgramsPage() { return <><div className="page-intro"><div><p className="eyebrow">برامجك</p><h2>البرامج التدريبية</h2><p>رتب أيام التمرين وأدر خطتك بمرونة.</p></div><Button><Plus size={18} /> برنامج جديد</Button></div><div className="exercise-grid">{programs.map((program) => <Card className="exercise-card" key={program.name}><div className="exercise-card__top"><div><h3>{program.name}</h3><p>{program.days}</p></div><span className="pill">{program.state}</span></div><div className="exercise-meta"><span className="pill"><CalendarDays size={13} /> {program.progress}</span></div><div className="exercise-footer"><Link href="/workouts/session/today" className="button button--primary button--sm">بدء الجلسة</Link><div><Button variant="ghost" size="sm"><Copy size={16} /></Button><Button variant="ghost" size="sm"><Archive size={16} /></Button></div></div></Card>)}</div></>;
}
