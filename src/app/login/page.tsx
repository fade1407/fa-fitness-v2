import { LoginForm } from "@/components/auth/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/client";
export const metadata = { title: "تسجيل الدخول" };
export default function LoginPage() { return <LoginForm configured={isSupabaseConfigured()} />; }
