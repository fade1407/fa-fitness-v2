"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginValues } from "@/schemas/auth";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter(); const [serverError, setServerError] = useState<string | null>(null); const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  async function onSubmit(values: LoginValues) { setServerError(null); const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); if (!response.ok) { const body = await response.json() as { error?: string }; setServerError(body.error ?? "تعذّر الدخول."); return; } router.replace("/dashboard"); router.refresh(); }
  return <main className="auth-page"><section className="auth-card"><span className="auth-mark"><KeyRound size={21} /></span><p className="eyebrow">FA FITNESS</p><h1>مرحبًا بعودتك</h1><p>{configured ? "سجّل الدخول لمتابعة رحلتك الرياضية." : "أضف مفاتيح Supabase في .env.local لتفعيل حسابك الخاص."}</p>{configured ? <form className="auth-form" onSubmit={handleSubmit(onSubmit)}><label>البريد الإلكتروني<input type="email" autoComplete="email" {...register("email")} />{errors.email ? <small>{errors.email.message}</small> : null}</label><label>كلمة المرور<input type="password" autoComplete="current-password" {...register("password")} />{errors.password ? <small>{errors.password.message}</small> : null}</label>{serverError ? <p style={{ color: "#ff9e9e", fontSize: ".8rem" }}>{serverError}</p> : null}<Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="spin" size={18} /> : null}تسجيل الدخول</Button><p className="auth-footnote"><Link href="/login?reset=1">نسيت كلمة المرور؟</Link></p></form> : <div className="auth-form"><Link className="button button--primary button--lg" href="/dashboard">معاينة التطبيق محليًا</Link><p className="auth-footnote">لن يعمل هذا الزر بعد النشر ما لم تُضف إعدادات Supabase.</p></div>}</section></main>;
}
