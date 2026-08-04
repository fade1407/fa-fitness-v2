import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const weekdays = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
export function CalendarView() { const days = Array.from({ length: 35 }, (_, index) => index - 2); const workoutDays = new Set([1,4,8,11,15,18,22,25,29]); const restDays = new Set([2,5,9,12,16,19,23,26,30]); return <><div className="page-intro"><div><p className="eyebrow">الالتزام</p><h2>التقويم الرياضي</h2><p>شاهد التمرين والقياسات والإنجازات في مكان واحد.</p></div><div className="hero-actions"><Button variant="secondary" size="sm"><ChevronRight size={16} /></Button><Button variant="secondary" size="sm"><ChevronLeft size={16} /></Button></div></div><Card className="calendar-card"><div className="section-heading"><h2>يوليو 2026</h2><span className="pill">9 جلسات مكتملة</span></div><div className="calendar-grid">{weekdays.map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}{days.map((day, index) => <button key={index} className={`calendar-day ${index === 33 ? "calendar-day--today" : ""} ${workoutDays.has(index) ? "calendar-day--workout" : restDays.has(index) ? "calendar-day--rest" : ""}`} aria-label={day > 0 && day <= 31 ? `يوم ${day}` : "يوم من شهر آخر"}><span>{day > 0 && day <= 31 ? day : ""}</span></button>)}</div></Card></>;
}
