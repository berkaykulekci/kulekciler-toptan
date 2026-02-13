import AdminTopStats from "@/components/admin/AdminTopStats";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer();

  const [{ count: total }, { count: active }, { count: featured }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_featured", true),
  ]);

  return <AdminTopStats total={total || 0} active={active || 0} featured={featured || 0} />;
}
