import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/schemas/auth";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" }, { status: 400 });
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "لم يتم إعداد Supabase بعد." }, { status: 503 });
  const { error } = await supabase.auth.signInAnonymously({ options: { data: { first_name: parsed.data.username } } });
  if (error) return NextResponse.json({ error: "تعذّر إنشاء الجلسة. تأكد من تفعيل الدخول المجهول في Supabase." }, { status: 401 });
  return NextResponse.json({ ok: true });
}
