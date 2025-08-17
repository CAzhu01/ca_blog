import { Suspense } from "react";
import { BlogPostCard } from "@/components/blog-post-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LoadingSpinner } from "@/components/loading-spinner";

export const revalidate = 60; // Revalidate every minute

async function PostsList() {
  // Data fetching is now inside the component that uses the data.
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error fetching posts:", error.message);
    // This error will be caught by the nearest error.tsx boundary
    throw new Error("Failed to fetch posts.");
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No Blog here</p>
        <Link href="/blog/create">
          <Button>Create your first blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post as any} />
      ))}
    </div>
  );
}

export default function BlogListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Static content - loads instantly */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog List</h1>
        <p className="text-xl text-muted-foreground">
          Check out my latest posts
        </p>
      </section>

      {/* The Suspense boundary wraps the dynamic, data-fetching component */}
      <section>
        <Suspense fallback={<LoadingSpinner />}>
          <PostsList />
        </Suspense>
      </section>
    </div>
  );
}
