import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { EnhancedContent } from "@/components/enhanced-content";
import { LoadingSpinner } from "@/components/loading-spinner";

export const revalidate = 60; // Revalidate every minute

async function BlogPostContent({ id }: { id: string }) {
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    console.error("Error fetching post:", error);
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-muted-foreground">
          {formatDate(post.created_at)}
        </div>
      </header>
      <EnhancedContent content={post.content} />
    </article>
  );
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/blog"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回博客列表
      </Link>

      <Suspense fallback={<LoadingSpinner />}>
        <BlogPostContent id={params.id} />
      </Suspense>
    </div>
  );
}
