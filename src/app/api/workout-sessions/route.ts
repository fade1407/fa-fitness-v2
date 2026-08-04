import { NextResponse } from "next/server";
import { finishActivitySchema, finishWorkoutSchema } from "@/schemas/workout";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const validationError = () => NextResponse.json({ error: "تعذر التحقق من بيانات الجلسة." }, { status: 400 });

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "لم يتم إعداد Supabase بعد." }, { status: 503 });
  const body: unknown = await request.json().catch(() => null);
  const resistance = finishWorkoutSchema.safeParse(body);
  const activity = resistance.success ? null : finishActivitySchema.safeParse(body);
  if (!resistance.success && !activity?.success) return validationError();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "انتهت الجلسة. سجّل الدخول مجددًا." }, { status: 401 });

  if (activity?.success) {
    const { data: catalogue } = await supabase.from("training_activities").select("id,name_ar,category").eq("code", activity.data.activityCode).eq("is_active", true).maybeSingle();
    if (!catalogue || catalogue.category !== activity.data.kind) return validationError();
    const { error } = await supabase.from("workout_sessions").insert({
      user_id: user.id, session_kind: activity.data.kind, activity_id: catalogue.id, activity_name_snapshot: catalogue.name_ar,
      completed_at: new Date().toISOString(), duration_seconds: activity.data.durationSeconds, intensity: activity.data.intensity,
      overall_rpe: activity.data.intensity, estimated_calories: activity.data.estimatedCalories, distance_km: activity.data.distanceKm,
      notes: activity.data.notes, is_complete: true,
    });
    if (error) return NextResponse.json({ error: "تعذر حفظ الجلسة." }, { status: 500 });
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (!resistance.success) return validationError();
  const payload = resistance.data;
  const { data: session, error: sessionError } = await supabase.from("workout_sessions").insert({
    user_id: user.id, session_kind: "resistance", program_id: payload.programId, workout_day_id: payload.workoutDayId,
    completed_at: new Date().toISOString(), duration_seconds: payload.durationSeconds, overall_rpe: payload.overallRpe, notes: payload.notes, is_complete: true,
  }).select("id").single();
  if (sessionError || !session) return NextResponse.json({ error: "تعذر حفظ الجلسة." }, { status: 500 });

  const exercises = payload.exercises.map((exercise, index) => ({ user_id: user.id, session_id: session.id, exercise_id: exercise.id, name_snapshot: exercise.nameAr, exercise_order: index + 1 }));
  const { data: savedExercises, error: exercisesError } = await supabase.from("workout_session_exercises").insert(exercises).select("id,exercise_order");
  if (exercisesError || !savedExercises) return rollback(supabase, session.id);
  const sets = payload.exercises.flatMap((exercise, exerciseIndex) => {
    const saved = savedExercises.find((row) => row.exercise_order === exerciseIndex + 1);
    return exercise.sets.map((set) => ({ user_id: user.id, session_exercise_id: saved?.id, set_number: set.setNumber, weight_kg: set.weight, reps: set.reps, rpe: set.rpe, status: set.completed ? "completed" : "skipped", completed_at: set.completed ? new Date().toISOString() : null }));
  });
  const { error: setsError } = await supabase.from("workout_sets").insert(sets);
  if (setsError) return rollback(supabase, session.id);
  return NextResponse.json({ id: session.id }, { status: 201 });
}

async function rollback(supabase: Awaited<ReturnType<typeof createServerSupabaseClient>> & {}, sessionId: string) {
  await supabase.from("workout_sessions").delete().eq("id", sessionId);
  return NextResponse.json({ error: "تعذر حفظ تفاصيل الجلسة؛ لم يُسجّل أي تمرين." }, { status: 500 });
}
