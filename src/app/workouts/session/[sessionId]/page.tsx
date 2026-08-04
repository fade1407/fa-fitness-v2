import { ActivitySession } from "@/components/workout/activity-session";
import { trainingActivities } from "@/constants/training-activities";
import { WorkoutSession } from "@/components/workout/workout-session";
import { getTodayResistanceWorkout } from "@/services/workout-service";
export const metadata = { title: "جلسة التمرين" };
export default async function WorkoutSessionPage({ params, searchParams }: { params: Promise<{ sessionId: string }>; searchParams: Promise<{ activity?: string }> }) {
  const { sessionId } = await params; const { activity } = await searchParams;
  if ((sessionId === "cardio" || sessionId === "fitness") && activity) {
    const selected = trainingActivities.find((item) => item.code === activity && item.category === sessionId);
    if (selected) return <ActivitySession workout={{ kind: sessionId, activityCode: selected.code, activityName: selected.nameAr }} />;
  }
  return <WorkoutSession workout={await getTodayResistanceWorkout()} />;
}
