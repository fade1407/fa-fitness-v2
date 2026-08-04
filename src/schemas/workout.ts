import { z } from "zod";

const setSchema = z.object({ setNumber: z.number().int().positive(), weight: z.number().min(0), reps: z.number().int().min(0), rpe: z.number().min(1).max(10), completed: z.boolean() });
const exerciseSchema = z.object({ id: z.string().uuid(), nameAr: z.string().min(1), sets: z.array(setSchema).min(1) });
export const finishWorkoutSchema = z.object({ kind: z.literal("resistance"), programId: z.string().uuid().optional(), workoutDayId: z.string().uuid().optional(), exercises: z.array(exerciseSchema).min(1), durationSeconds: z.number().int().min(0).max(86_400), overallRpe: z.number().min(1).max(10).optional(), notes: z.string().max(2_000).optional() });
export type FinishWorkoutPayload = z.infer<typeof finishWorkoutSchema>;

export const finishActivitySchema = z.object({
  kind: z.enum(["cardio", "fitness"]),
  activityCode: z.string().regex(/^[a-z0-9-]+$/),
  activityName: z.string().min(1).max(120),
  durationSeconds: z.number().int().min(0).max(86_400),
  intensity: z.number().min(1).max(10).optional(),
  distanceKm: z.number().min(0).max(10_000).optional(),
  estimatedCalories: z.number().int().min(0).max(100_000).optional(),
  notes: z.string().max(2_000).optional(),
});
export type FinishActivityPayload = z.infer<typeof finishActivitySchema>;
