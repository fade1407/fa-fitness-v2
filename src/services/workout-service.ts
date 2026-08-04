import { sessionExercises } from "@/lib/demo-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ResistanceWorkout, WorkoutExercise } from "@/types/fitness";

type ProgramRow = { id: string; name: string };
type WorkoutDayRow = { id: string; name: string; day_order: number; weekday: number | null };
type ExerciseTemplateRow = {
  target_sets: number; target_reps_min: number | null; target_reps_max: number | null; target_weight_kg: number | null; rest_seconds: number;
  exercise: { id: string; name_ar: string; name_en: string; difficulty: string | null; movement_type: string | null; primary_muscle: { name_ar: string } | null } | null;
};

function demoWorkout(): ResistanceWorkout {
  return { kind: "resistance", name: "Full Body A", focus: "كامل الجسم", exercises: sessionExercises };
}

function chooseDay(days: WorkoutDayRow[], now = new Date()) {
  const scheduled = days.find((day) => day.weekday === now.getDay());
  if (scheduled) return scheduled;
  // Packages without assigned weekdays rotate consistently from Monday instead of exposing a package picker.
  return days[((now.getDay() + 6) % 7) % days.length];
}

function toWorkoutExercise(row: ExerciseTemplateRow): WorkoutExercise | null {
  if (!row.exercise) return null;
  const exercise = row.exercise;
  const targetReps = row.target_reps_min === null ? "حسب الخطة" : row.target_reps_max === null || row.target_reps_min === row.target_reps_max ? String(row.target_reps_min) : `${row.target_reps_min}–${row.target_reps_max}`;
  return {
    id: exercise.id, nameAr: exercise.name_ar, nameEn: exercise.name_en, primaryMuscle: exercise.primary_muscle?.name_ar ?? "كامل الجسم", equipment: "متنوع",
    difficulty: exercise.difficulty === "advanced" ? "متقدم" : exercise.difficulty === "intermediate" ? "متوسط" : "مبتدئ", movement: exercise.movement_type ?? "تمرين",
    targetSets: row.target_sets, targetReps, restSeconds: row.rest_seconds,
    sets: Array.from({ length: row.target_sets }, (_, index) => ({ id: `${exercise.id}-${index + 1}`, setNumber: index + 1, weight: Number(row.target_weight_kg ?? 0), reps: 0, rpe: 7, completed: false })),
    previousWeight: 0, bestWeight: 0,
  };
}

export async function getTodayResistanceWorkout(): Promise<ResistanceWorkout> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return demoWorkout();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return demoWorkout();

  const { data: programData } = await supabase.from("workout_programs").select("id,name").eq("user_id", user.id).eq("is_active", true).is("deleted_at", null).maybeSingle();
  const program = programData as ProgramRow | null;
  if (!program) return demoWorkout();
  const { data: daysData } = await supabase.from("workout_days").select("id,name,day_order,weekday").eq("program_id", program.id).order("day_order");
  const days = (daysData ?? []) as WorkoutDayRow[];
  if (!days.length) return { ...demoWorkout(), name: program.name };
  const day = chooseDay(days);
  const { data: templateData } = await supabase
    .from("workout_day_exercises")
    .select("target_sets,target_reps_min,target_reps_max,target_weight_kg,rest_seconds,exercise:exercises(id,name_ar,name_en,difficulty,movement_type,primary_muscle:muscle_groups(name_ar))")
    .eq("workout_day_id", day.id)
    .order("exercise_order");
  const exercises = ((templateData ?? []) as unknown as ExerciseTemplateRow[]).map(toWorkoutExercise).filter((item): item is WorkoutExercise => item !== null);
  return { kind: "resistance", programId: program.id, workoutDayId: day.id, name: day.name || program.name, focus: program.name, exercises: exercises.length ? exercises : sessionExercises };
}
