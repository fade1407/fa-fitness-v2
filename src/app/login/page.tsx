import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { authenticationRequired } from "@/lib/auth-mode";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata = { title: "تسجيل الدخول" };

export default function LoginPage() {
  // Launch mode: open the app directly until authentication is enabled again.
  if (!authenticationRequired) redirect("/dashboard");
  return <LoginForm configured={isSupabaseConfigured()} />;
}
