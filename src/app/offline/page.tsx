import Link from "next/link";
import { WifiOff } from "lucide-react";
export default function OfflinePage() { return <main className="auth-page"><section className="auth-card"><span className="auth-mark"><WifiOff /></span><p className="eyebrow">FA FITNESS</p><h1>أنت غير متصل الآن</h1><p>سنحفظ جلسة التمرين على جهازك ونزامنها عند عودة الشبكة.</p><Link className="button button--primary button--lg" href="/workouts">العودة للتمرين</Link></section></main>; }
