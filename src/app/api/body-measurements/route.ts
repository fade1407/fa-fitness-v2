import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { bodyMeasurementSchema } from "@/schemas/fitness-entry";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "لم يتم إعداد Supabase بعد." }, { status: 503 });
  const parsed = bodyMeasurementSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "بيانات القياس غير صحيحة." }, { status: 400 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "انتهت الجلسة." }, { status: 401 });
  const { error } = await supabase.from("body_measurements").upsert({ user_id: user.id, measured_on: new Date().toISOString().slice(0, 10), weight_kg: parsed.data.weight, body_fat_percent: parsed.data.bodyFat, waist_cm: parsed.data.waist }, { onConflict: "user_id,measured_on" });
  if (error) return NextResponse.json({ error: "تعذر حفظ القياس." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
