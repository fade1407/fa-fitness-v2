import { z } from "zod";

export const bodyMeasurementSchema = z.object({
  weight: z.number().min(30).max(350),
  bodyFat: z.number().min(0).max(100).optional(),
  waist: z.number().min(0).max(300).optional(),
});

export const nutritionEntrySchema = z.object({
  name: z.string().trim().min(1).max(160),
  mealType: z.string().trim().min(1).max(40),
  calories: z.number().int().min(0).max(10_000),
  protein: z.number().min(0).max(1_000),
  carbs: z.number().min(0).max(2_000),
  fat: z.number().min(0).max(1_000),
});

export const waterEntrySchema = z.object({ amount: z.number().int().min(1).max(5_000) });
