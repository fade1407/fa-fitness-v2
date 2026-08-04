import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getDashboardData } from "@/services/dashboard-service";
export const metadata = { title: "الرئيسية" };
export default async function DashboardPage() { return <DashboardView data={await getDashboardData()} />; }
