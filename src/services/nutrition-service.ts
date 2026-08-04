import { dashboardDemo, nutritionDemo } from "@/lib/demo-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { NutritionEntry } from "@/types/fitness";

type NutritionRow = { id: string; meal_type: NutritionEntry["mealType"]; food_name: string; eaten_at: string; calories: number; protein_g: number; carbs_g: number; fat_g: number };
type WaterRow = { amount_ml: number };
export async function getNutritionData(): Promise<{ entries: NutritionEntry[]; water: number }> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { entries: nutritionDemo, water: dashboardDemo.consumed.water };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { entries: nutritionDemo, water: dashboardDemo.consumed.water };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [nutritionResult, waterResult] = await Promise.all([supabase.from("nutrition_entries").select("id,meal_type,food_name,eaten_at,calories,protein_g,carbs_g,fat_g").eq("user_id", user.id).gte("eaten_at", today.toISOString()).order("eaten_at"), supabase.from("water_entries").select("amount_ml").eq("user_id", user.id).gte("consumed_at", today.toISOString())]);
  const entries = ((nutritionResult.data ?? []) as NutritionRow[]).map((row) => ({ id: row.id, mealType: row.meal_type, name: row.food_name, time: new Intl.DateTimeFormat("ar-SA", { hour: "2-digit", minute: "2-digit" }).format(new Date(row.eaten_at)), calories: row.calories, protein: row.protein_g, carbs: row.carbs_g, fat: row.fat_g }));
  const water = ((waterResult.data ?? []) as WaterRow[]).reduce((total, row) => total + row.amount_ml, 0);
  return { entries: entries.length ? entries : nutritionDemo, water: water || dashboardDemo.consumed.water };
}
