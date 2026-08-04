export type ActivityCategory = "cardio" | "fitness";

export type TrainingActivity = {
  code: string;
  category: ActivityCategory;
  nameAr: string;
};

// A local catalogue makes the start screen instant. Supabase remains the source of truth
// for the saved activity snapshot and is seeded with these same stable codes.
export const trainingActivities: TrainingActivity[] = [
  { code: "walking", category: "cardio", nameAr: "مشي" },
  { code: "running", category: "cardio", nameAr: "جري" },
  { code: "cycling", category: "cardio", nameAr: "دراجة" },
  { code: "elliptical", category: "cardio", nameAr: "جهاز بيضاوي" },
  { code: "stair-climber", category: "cardio", nameAr: "Stair Climber" },
  { code: "rowing", category: "cardio", nameAr: "جهاز تجديف" },
  { code: "jump-rope", category: "cardio", nameAr: "نط حبل" },
  { code: "swimming", category: "cardio", nameAr: "سباحة" },
  { code: "free-cardio", category: "cardio", nameAr: "كارديو حر" },
  { code: "hiit", category: "fitness", nameAr: "HIIT" },
  { code: "circuit", category: "fitness", nameAr: "Circuit" },
  { code: "bodyweight", category: "fitness", nameAr: "Bodyweight" },
  { code: "core", category: "fitness", nameAr: "Core" },
  { code: "stretching", category: "fitness", nameAr: "Stretching" },
  { code: "flexibility", category: "fitness", nameAr: "Flexibility" },
  { code: "agility", category: "fitness", nameAr: "Agility" },
  { code: "endurance", category: "fitness", nameAr: "Endurance" },
  { code: "fitness-free", category: "fitness", nameAr: "Fitness Free" },
];
