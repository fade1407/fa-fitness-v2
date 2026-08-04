export type Theme = "light" | "dark" | "system";

export type Exercise = {
  id: string;
  nameAr: string;
  nameEn: string;
  primaryMuscle: string;
  equipment: string;
  difficulty: "مبتدئ" | "متوسط" | "متقدم";
  movement: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
  imageUrl?: string;
};

export type WorkoutSet = {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
};

export type WorkoutExercise = Exercise & {
  notes?: string;
  previousWeight?: number;
  bestWeight?: number;
  sets: WorkoutSet[];
};

export type TrainingSessionKind = "resistance" | "cardio" | "fitness";

export type ResistanceWorkout = {
  kind: "resistance";
  programId?: string;
  workoutDayId?: string;
  name: string;
  focus: string;
  exercises: WorkoutExercise[];
};

export type ActivityWorkout = {
  kind: "cardio" | "fitness";
  activityCode: string;
  activityName: string;
};

export type BodyMeasurement = {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  waist?: number;
};

export type NutritionEntry = {
  id: string;
  mealType: "إفطار" | "غداء" | "عشاء" | "سناك" | "قبل التمرين" | "بعد التمرين";
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type DashboardData = {
  profile: { firstName: string; level: number; points: number; currentWeight: number };
  today: { date: string; workoutName: string; workoutFocus: string; estimatedMinutes: number };
  weekly: { completed: number; planned: number; minutes: number; currentStreak: number; longestStreak: number };
  goals: { calories: number; protein: number; water: number };
  consumed: { calories: number; protein: number; water: number };
  latestAchievement: { title: string; description: string; icon: string };
  motivation: string;
};

export type MealTotals = { calories: number; protein: number; carbs: number; fat: number };
