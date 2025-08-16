import { createClient } from "@/lib/supabase/server";

export default async function Categories() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return <pre>{JSON.stringify(categories, null, 2)}</pre>;
}
