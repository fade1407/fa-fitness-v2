import { measurementDemo } from "@/lib/demo-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { BodyMeasurement } from "@/types/fitness";

type MeasurementRow = { measured_on: string; weight_kg: number | null; body_fat_percent: number | null; muscle_mass_kg: number | null; waist_cm: number | null };
export async function getMeasurements(): Promise<BodyMeasurement[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return measurementDemo;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return measurementDemo;
  const { data } = await supabase.from("body_measurements").select("measured_on,weight_kg,body_fat_percent,muscle_mass_kg,waist_cm").eq("user_id", user.id).order("measured_on", { ascending: true });
  const entries = ((data ?? []) as MeasurementRow[]).filter((row) => row.weight_kg !== null).map((row) => ({ date: row.measured_on, weight: row.weight_kg!, bodyFat: row.body_fat_percent ?? undefined, muscleMass: row.muscle_mass_kg ?? undefined, waist: row.waist_cm ?? undefined }));
  return entries.length ? entries : measurementDemo;
}
