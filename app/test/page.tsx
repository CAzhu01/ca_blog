import { createServerClient } from "@/lib/supabase/server";

export default async function Instruments() {
  const supabase = await createServerClient();
  const { data: categories } = await supabase.from("categories").select();

  return <pre>{JSON.stringify(categories, null, 2)}</pre>;
}
