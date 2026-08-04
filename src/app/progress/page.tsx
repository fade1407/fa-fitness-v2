import { ProgressView } from "@/components/progress/progress-view";
import { getMeasurements } from "@/services/progress-service";
export const metadata = { title: "التقدم" };
export default async function ProgressPage() { return <ProgressView initialMeasurements={await getMeasurements()} />; }
