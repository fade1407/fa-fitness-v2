import { NutritionView } from "@/components/nutrition/nutrition-view";
import { getNutritionData } from "@/services/nutrition-service";
export const metadata = { title: "التغذية" };
export default async function NutritionPage() { const data = await getNutritionData(); return <NutritionView initialEntries={data.entries} initialWater={data.water} />; }
