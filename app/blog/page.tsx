import { Suspense } from "react";
import { BlogPostCard } from "@/components/blog-post-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LoadingSpinner } from "@/components/loading-spinner";

export const revalidate = 60; // Revalidate every minute

async function PostsList({ query }: { query: string }) {
  const supabase = await createClient();
  let queryBuilder = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    queryBuilder = queryBuilder.ilike("title", `%${query}%`);
  }

  const { data: posts, error } = await queryBuilder;

  if (error) {
    console.error("Supabase error fetching posts:", error.message);
    throw new Error("Failed to fetch posts.");
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {query ? `No results for "${query}"` : "No posts yet."}
        </p>
        {query ? (
          <Link href="/blog">
            <Button variant="outline">Clear search</Button>
          </Link>
        ) : (
          <Link href="/blog/create">
            <Button>Create your first post</Button>
          </Link>
        )}
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

export default function BlogListPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground">
          {query
            ? `Showing results for "${query}"`
            : "Check out my latest posts"}
        </p>
      </section>

      <section>
        <Suspense fallback={<LoadingSpinner />}>
          <PostsList query={query} />
        </Suspense>
      </section>
    </div>
  );
}
