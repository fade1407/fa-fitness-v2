import type { BodyMeasurement, DashboardData, Exercise, NutritionEntry, WorkoutExercise } from "@/types/fitness";

export const dashboardDemo: DashboardData = {
  profile: { firstName: "فيصل", level: 12, points: 2840, currentWeight: 78.4 },
  today: { date: "2026-07-31", workoutName: "Full Body A", workoutFocus: "قوة شاملة", estimatedMinutes: 52 },
  weekly: { completed: 2, planned: 3, minutes: 118, currentStreak: 6, longestStreak: 14 },
  goals: { calories: 2400, protein: 170, water: 3000 },
  consumed: { calories: 1560, protein: 112, water: 1850 },
  latestAchievement: { title: "سلسلة من 6 أيام", description: "حافظت على عاداتك ستة أيام متتالية.", icon: "⚡" },
  motivation: "التركيز اليوم: تحرّك بإتقان، ثم دوّن كل مجموعة.",
};

const exerciseSeeds = [
  ["barbell-squat", "سكوات بالبار", "Barbell Back Squat", "الأرجل", "بار", "متوسط", "دفع", 4, "6–8", 120],
  ["bench-press", "ضغط صدر بالبار", "Barbell Bench Press", "الصدر", "بار", "متوسط", "دفع", 4, "6–8", 120],
  ["row", "تجديف بار منحني", "Bent Over Row", "الظهر", "بار", "متوسط", "سحب", 3, "8–10", 90],
  ["rdl", "رفعة رومانية", "Romanian Deadlift", "الأرجل", "بار", "متوسط", "سحب", 3, "8–10", 120],
  ["ohp", "ضغط كتف واقف", "Overhead Press", "الأكتاف", "بار", "متوسط", "دفع", 3, "8–10", 90],
  ["lat-pulldown", "سحب علوي", "Lat Pulldown", "الظهر", "كيبل", "مبتدئ", "سحب", 3, "10–12", 75],
  ["leg-press", "ضغط الأرجل", "Leg Press", "الأرجل", "أجهزة", "مبتدئ", "دفع", 3, "10–12", 90],
  ["db-incline", "ضغط دمبل مائل", "Incline Dumbbell Press", "الصدر", "دمبل", "متوسط", "دفع", 3, "8–12", 75],
  ["cable-row", "تجديف كيبل جالس", "Seated Cable Row", "الظهر", "كيبل", "مبتدئ", "سحب", 3, "10–12", 75],
  ["lateral-raise", "رفرفة جانبية", "Lateral Raise", "الأكتاف", "دمبل", "مبتدئ", "عزل", 3, "12–15", 60],
  ["curl", "بايسبس دمبل", "Dumbbell Curl", "البايسبس", "دمبل", "مبتدئ", "عزل", 3, "10–12", 60],
  ["triceps", "دفع ترايسبس كيبل", "Cable Triceps Pushdown", "الترايسبس", "كيبل", "مبتدئ", "عزل", 3, "10–12", 60],
 ] as const;

export const exerciseLibrary: Exercise[] = exerciseSeeds.map(([id, nameAr, nameEn, primaryMuscle, equipment, difficulty, movement, targetSets, targetReps, restSeconds]) => ({
  id,
  nameAr,
  nameEn,
  primaryMuscle,
  equipment,
  difficulty: difficulty as Exercise["difficulty"],
  movement: movement as string,
  targetSets,
  targetReps,
  restSeconds,
}));

export const sessionExercises: WorkoutExercise[] = exerciseLibrary.slice(0, 5).map((exercise, exerciseIndex) => ({
  ...exercise,
  previousWeight: [80, 60, 65, 70, 35][exerciseIndex],
  bestWeight: [90, 70, 75, 80, 42.5][exerciseIndex],
  sets: Array.from({ length: exercise.targetSets }, (_, index) => ({
    id: `${exercise.id}-${index + 1}`,
    setNumber: index + 1,
    weight: [80, 60, 65, 70, 35][exerciseIndex],
    reps: exerciseIndex === 0 ? 8 : 10,
    rpe: 7,
    completed: false,
  })),
}));

export const measurementDemo: BodyMeasurement[] = [
  { date: "2026-07-01", weight: 80.2, bodyFat: 20.4, muscleMass: 34.2, waist: 88 },
  { date: "2026-07-08", weight: 79.7, bodyFat: 20.1, muscleMass: 34.4, waist: 87.5 },
  { date: "2026-07-15", weight: 79.3, bodyFat: 19.8, muscleMass: 34.6, waist: 87 },
  { date: "2026-07-22", weight: 78.8, bodyFat: 19.5, muscleMass: 34.8, waist: 86.5 },
  { date: "2026-07-31", weight: 78.4, bodyFat: 19.1, muscleMass: 35, waist: 86 },
];

export const nutritionDemo: NutritionEntry[] = [
  { id: "meal-1", mealType: "إفطار", name: "شوفان، زبادي يوناني وتوت", time: "08:15", calories: 520, protein: 36, carbs: 62, fat: 14 },
  { id: "meal-2", mealType: "غداء", name: "دجاج مشوي وأرز بسمتي", time: "13:40", calories: 740, protein: 58, carbs: 82, fat: 18 },
  { id: "meal-3", mealType: "سناك", name: "مخفوق بروتين وموز", time: "16:30", calories: 300, protein: 25, carbs: 38, fat: 4 },
];
