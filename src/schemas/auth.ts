import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email("أدخل بريدًا إلكترونيًا صحيحًا."), password: z.string().min(8, "كلمة المرور يجب أن تحتوي 8 أحرف على الأقل.") });
export type LoginValues = z.infer<typeof loginSchema>;
export const onboardingSchema = z.object({ firstName: z.string().min(2, "أدخل الاسم الأول."), height: z.coerce.number().min(100).max(250), currentWeight: z.coerce.number().min(30).max(350), targetWeight: z.coerce.number().min(30).max(350), goal: z.string().min(1), trainingDays: z.coerce.number().min(1).max(7) });
