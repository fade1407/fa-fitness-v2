import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { waterEntrySchema } from "@/schemas/fitness-entry";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "لم يتم إعداد Supabase بعد." }, { status: 503 });
  const parsed = waterEntrySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "كمية الماء غير صحيحة." }, { status: 400 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "انتهت الجلسة." }, { status: 401 });
  const { error } = await supabase.from("water_entries").insert({ user_id: user.id, consumed_at: new Date().toISOString(), amount_ml: parsed.data.amount });
  if (error) return NextResponse.json({ error: "تعذر حفظ كمية الماء." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
