import { z } from "zod";

export const loginSchema = z.object({ username: z.string().trim().min(2, "أدخل اسمًا من حرفين على الأقل.").max(80, "الاسم طويل جدًا.") });
export type LoginValues = z.infer<typeof loginSchema>;
export const onboardingSchema = z.object({ firstName: z.string().min(2, "أدخل الاسم الأول."), height: z.coerce.number().min(100).max(250), currentWeight: z.coerce.number().min(30).max(350), targetWeight: z.coerce.number().min(30).max(350), goal: z.string().min(1), trainingDays: z.coerce.number().min(1).max(7) });
