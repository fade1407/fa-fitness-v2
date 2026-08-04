import { dashboardDemo } from "@/lib/demo-data";
import { calculateCurrentStreak, startOfMondayWeek } from "@/lib/fitness";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DashboardData } from "@/types/fitness";

type ProfileRow = { first_name: string; current_weight_kg: number | null; training_days_per_week: number | null };
type GoalRow = { calories: number; protein_g: number; water_target_ml: number };
type NutritionRow = { calories: number; protein_g: number };
type WaterRow = { amount_ml: number };
type SessionRow = { duration_seconds: number | null; completed_at: string | null };

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return dashboardDemo;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return dashboardDemo;
  const today = new Date(); const startOfWeek = startOfMondayWeek(today); const startOfDay = new Date(today); startOfDay.setHours(0, 0, 0, 0);
  const historyStart = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const [profileResult, goalsResult, sessionsResult, nutritionResult, waterResult, programResult] = await Promise.all([
    supabase.from("profiles").select("first_name,current_weight_kg,training_days_per_week").eq("id", user.id).single(),
    supabase.from("nutrition_goals").select("calories,protein_g,water_target_ml").eq("user_id", user.id).maybeSingle(),
    supabase.from("workout_sessions").select("duration_seconds,completed_at").eq("user_id", user.id).eq("is_complete", true).gte("completed_at", historyStart.toISOString()),
    supabase.from("nutrition_entries").select("calories,protein_g").eq("user_id", user.id).gte("eaten_at", startOfDay.toISOString()),
    supabase.from("water_entries").select("amount_ml").eq("user_id", user.id).gte("consumed_at", startOfDay.toISOString()),
    supabase.from("workout_programs").select("name").eq("user_id", user.id).eq("is_active", true).maybeSingle(),
  ]);
  const profile = profileResult.data as ProfileRow | null; const goals = goalsResult.data as GoalRow | null; const nutrition = (nutritionResult.data ?? []) as NutritionRow[]; const water = (waterResult.data ?? []) as WaterRow[]; const sessions = (sessionsResult.data ?? []) as SessionRow[];
  const weeklySessions = sessions.filter((session) => session.completed_at && new Date(session.completed_at) >= startOfWeek);
  const completed = weeklySessions.length; const minutes = weeklySessions.reduce((total, row) => total + Math.round((row.duration_seconds ?? 0) / 60), 0);
  const streak = calculateCurrentStreak(sessions.map((session) => session.completed_at).filter((value): value is string => Boolean(value)), today);
  return { ...dashboardDemo, profile: { ...dashboardDemo.profile, firstName: profile?.first_name ?? dashboardDemo.profile.firstName, currentWeight: profile?.current_weight_kg ?? dashboardDemo.profile.currentWeight }, today: { ...dashboardDemo.today, workoutName: programResult.data?.name ?? "تمرين اليوم" }, weekly: { ...dashboardDemo.weekly, completed, planned: profile?.training_days_per_week ?? dashboardDemo.weekly.planned, minutes, currentStreak: streak }, goals: { calories: goals?.calories ?? dashboardDemo.goals.calories, protein: goals?.protein_g ?? dashboardDemo.goals.protein, water: goals?.water_target_ml ?? dashboardDemo.goals.water }, consumed: { ...dashboardDemo.consumed, calories: nutrition.reduce((total, entry) => total + entry.calories, 0), protein: nutrition.reduce((total, entry) => total + entry.protein_g, 0), water: water.reduce((total, entry) => total + entry.amount_ml, 0) } };
}
