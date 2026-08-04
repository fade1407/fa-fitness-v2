import type { MealTotals, WorkoutSet } from "@/types/fitness";

export function calculateVolume(sets: WorkoutSet[]): number {
  return sets.filter((set) => set.completed).reduce((total, set) => total + set.weight * set.reps, 0);
}

export function calculateMealTotals(entries: Array<{ calories: number; protein: number; carbs: number; fat: number }>): MealTotals {
  return entries.reduce(
    (total, entry) => ({
      calories: total.calories + entry.calories,
      protein: total.protein + entry.protein,
      carbs: total.carbs + entry.carbs,
      fat: total.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function percent(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((value / goal) * 100)));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-SA").format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("ar-SA", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(date),
  );
}

export function startOfMondayWeek(date = new Date()): Date {
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

export function calculateCurrentStreak(completedAt: string[], now = new Date()): number {
  const completedDays = new Set(completedAt.map((value) => new Date(value).toISOString().slice(0, 10)));
  const cursor = new Date(now); cursor.setHours(0, 0, 0, 0);
  if (!completedDays.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (completedDays.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}
