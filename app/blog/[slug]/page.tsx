import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { EnhancedContent } from "@/components/enhanced-content";
import { LoadingSpinner } from "@/components/loading-spinner";

export const revalidate = 60; // Revalidate every minute

async function BlogPostContent({ slug }: { slug: string }) {
  const supabase = await createClient();

  // Fetch post and author in parallel
  const postPromise = supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();
  
  const userPromise = supabase.auth.getUser();

  const [{ data: post, error: postError }, { data: { user } }] = await Promise.all([postPromise, userPromise]);

  if (postError || !post) {
    console.error("Error fetching post:", postError);
    notFound();
  }

  // If the post is not public and the user is not logged in, treat as not found.
  if (!post.is_public && !user) {
    notFound();
  }
  
  // Fetch author profile (optional, can be displayed even if this fails)
  const { data: authorProfile } = await supabase
    .from("profiles") // Assuming your public user table is named 'profiles'
    .select("username")
    .eq("id", post.author_id)
    .single();

  const authorName = authorProfile?.username || "未知作者";

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-muted-foreground">
          {formatDate(post.created_at)} · {authorName}
          {!post.is_public && (
            <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              私有文章
            </span>
          )}
        </div>
      </header>
      <EnhancedContent content={post.content} />
    </article>
  );
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Static content - loads instantly */}
      <Link
        href="/blog"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回博客列表
      </Link>

      {/* Suspense boundary for the article content */}
      <Suspense fallback={<LoadingSpinner />}>
        <BlogPostContent slug={params.slug} />
      </Suspense>
    </div>
  );
}