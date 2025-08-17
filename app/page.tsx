import { BlogPostCard } from "@/components/blog-post-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types";

export const revalidate = 60; // 每分钟重新验证页面

async function getPosts() {
  const supabase = await createClient();

  // 首先获取已发布且公开的文章
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 5);

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // 如果没有文章，直接返回空数组
  if (!posts || posts.length === 0) {
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">CA Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            record my life
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Link href="/blog/create">
            <Button size="lg">New Post</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No public posts yet</p>
            <Link href="/blog/create">
              <Button>Create your first post</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
