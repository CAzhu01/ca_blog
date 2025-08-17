// This is now a Server Component by default
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";
import { UserPostsTable } from "./_components/user-posts-table";

async function UserPostsList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Or redirect to login page
    notFound();
  }

  // In the simplified model, the dashboard shows all posts
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch user posts.");
  }

  return <UserPostsTable initialPosts={posts} />;
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的文章</h1>
        <Link href="/blog/create">
          <Button>创建新文章</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>文章管理</CardTitle>
          <CardDescription>管理您的所有博客文章</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <UserPostsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}