"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useRouter, notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import { RichTextEditor } from "@/components/rich-text-editor";
import type { Post } from "@/types";

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const { data: postData, error } = await supabase
          .from("posts")
          .select("title, content")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        setTitle(postData.title);
        setContent(postData.content);
      } catch (error: any) {
        toast({
          title: "获取文章失败",
          description: "您可能没有权限或文章不存在。",
          variant: "destructive",
        });
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id, user, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({ title: "表单不完整", description: "请填写标题和内容", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("posts")
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq("id", params.id);

      if (error) throw error;

      toast({ title: "文章已更新" });
      router.push(`/blog/${params.id}`);
    } catch (error: any) {
      toast({ title: "更新失败", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>编辑文章</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/blog/${params.id}`}>
              <Button variant="outline" disabled={isSubmitting}>取消</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : "保存更改"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}