import { BlogPostCard } from "@/components/blog-post-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types";

export const revalidate = 60; // Revalidate every minute

async function getAllPosts() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return posts;
}

export default async function BlogListPage() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">博客文章</h1>
        <p className="text-xl text-muted-foreground">
          在这里查看我所有的笔记和文章。
        </p>
      </section>

      <section>
        {posts && posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              暂时还没有公开的文章。
            </p>
            <Link href="/blog/create">
              <Button>创建第一篇文章</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
