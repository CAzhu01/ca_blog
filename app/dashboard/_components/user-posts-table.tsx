"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Post } from "@/types";
import { formatDate } from "@/lib/utils";
import { Edit, Trash2, Eye, EyeOff, Globe, Lock } from "lucide-react";

export function UserPostsTable({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const handleTogglePublish = async (post: Post) => {
    const newPublishedState = !post.published;
    // Optimistic UI update
    setPosts(posts.map((p) => (p.id === post.id ? { ...p, published: newPublishedState } : p)));

    const { error } = await supabase
      .from("posts")
      .update({ published: newPublishedState })
      .eq("id", post.id);

    if (error) {
      // Revert on error
      setPosts(posts);
      toast({ title: "操作失败", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newPublishedState ? "文章已发布" : "文章已设为草稿" });
      router.refresh(); // Revalidate data on the server
    }
  };

  const handleToggleVisibility = async (post: Post) => {
    const newPublicState = !post.is_public;
    setPosts(posts.map((p) => (p.id === post.id ? { ...p, is_public: newPublicState } : p)));

    const { error } = await supabase
      .from("posts")
      .update({ is_public: newPublicState })
      .eq("id", post.id);

    if (error) {
      setPosts(posts);
      toast({ title: "操作失败", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newPublicState ? "文章已设为公开" : "文章已设为私有" });
      router.refresh();
    }
  };

  const handleDelete = async (postId: string) => {
    const originalPosts = posts;
    setPosts(posts.filter((p) => p.id !== postId));

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      setPosts(originalPosts);
      toast({ title: "删除失败", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "文章已删除" });
      router.refresh();
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">您还没有创建任何文章</p>
        <Link href="/blog/create">
          <Button>创建第一篇文章</Button>
        </Link>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>标题</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>可见性</TableHead>
          <TableHead>创建日期</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>
              {post.published ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">已发布</span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">草稿</span>
              )}
            </TableCell>
            <TableCell>
              {post.is_public ? (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">公开</span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">私有</span>
              )}
            </TableCell>
            <TableCell>{formatDate(post.created_at)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="icon" onClick={() => handleTogglePublish(post)} title={post.published ? "设为草稿" : "发布"}>
                  {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleToggleVisibility(post)} title={post.is_public ? "设为私有" : "设为公开"}>
                  {post.is_public ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/blog/edit/${post.id}`}><Edit className="h-4 w-4" /></Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>您确定要删除这篇文章吗？此操作无法撤销。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-red-500 hover:bg-red-600">删除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
