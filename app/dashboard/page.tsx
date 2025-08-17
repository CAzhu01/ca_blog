import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";
import { BlogPostCard } from "@/components/blog-post-card";
import { log } from "console";

async function UserPostsList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch user posts.");
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          You haven't written any posts yet.
        </p>
        <Link href="/blog/create">
          <Button>Create your first post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center gap-4">
          <div className="flex-grow">
            <BlogPostCard post={post as any} />
          </div>
          <Link href={`/blog/edit/${post.id}`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/blog/create">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <UserPostsList />
      </Suspense>
    </div>
  );
}
