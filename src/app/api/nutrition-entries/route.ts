import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { nutritionEntrySchema } from "@/schemas/fitness-entry";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "لم يتم إعداد Supabase بعد." }, { status: 503 });
  const parsed = nutritionEntrySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "بيانات الوجبة غير صحيحة." }, { status: 400 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "انتهت الجلسة." }, { status: 401 });
  const { error } = await supabase.from("nutrition_entries").insert({ user_id: user.id, eaten_at: new Date().toISOString(), meal_type: parsed.data.mealType, food_name: parsed.data.name, calories: parsed.data.calories, protein_g: parsed.data.protein, carbs_g: parsed.data.carbs, fat_g: parsed.data.fat });
  if (error) return NextResponse.json({ error: "تعذر حفظ الوجبة." }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
