"use client";

import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/server";

export default async function Instruments() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select();

  const { data: insertedCategories } = await supabase
    .from("categories")
    .insert([
      { name: "New Category", slug: "new-category", description: null },
    ]);

  return (
    <div>
      <h2>Categories</h2>
      <pre>{JSON.stringify(categories, null, 2)}</pre>
      <h2>Inserted Categories</h2>
      <pre>{JSON.stringify(insertedCategories, null, 2)}</pre>

      <button
        onClick={() =>
          toast({
            title: "Test Toast",
            description: "This is a test toast notification.",
          })
        }
      >
        Show Toast
      </button>
    </div>
  );
}
