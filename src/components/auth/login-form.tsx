"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginValues } from "@/schemas/auth";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter(); const [serverError, setServerError] = useState<string | null>(null); const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  async function onSubmit(values: LoginValues) { setServerError(null); const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) }); if (!response.ok) { const body = await response.json() as { error?: string }; setServerError(body.error ?? "تعذّر بدء جلستك."); return; } router.replace("/dashboard"); router.refresh(); }
  return <main className="auth-page"><section className="auth-card"><span className="auth-mark"><UserRound size={21} /></span><p className="eyebrow">FA FITNESS</p><h1>مرحبًا بك</h1><p>{configured ? "اكتب اسمك للبدء. لن تحتاج إلى كلمة مرور على هذا الجهاز." : "أضف مفاتيح Supabase في .env.local لتفعيل حسابك الخاص."}</p>{configured ? <form className="auth-form" onSubmit={handleSubmit(onSubmit)}><label>اسم المستخدم<input type="text" autoComplete="nickname" autoCapitalize="words" {...register("username")} />{errors.username ? <small>{errors.username.message}</small> : null}</label>{serverError ? <p style={{ color: "#ff9e9e", fontSize: ".8rem" }}>{serverError}</p> : null}<Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="spin" size={18} /> : null}دخول</Button><p className="auth-footnote">بياناتك تُحفظ لهذا الجهاز. عند تبديل الجهاز ستحتاج ربط الحساب لاحقًا.</p></form> : <p className="auth-footnote">وضع المعاينة العام مفعّل.</p>}</section></main>;
}
