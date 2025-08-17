"use client";

import React from "react";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function CreateBlogPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = getSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "未登录",
        description: "请先登录后再创建文章",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "表单不完整",
        description: "请填写标题和内容",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, content }])
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "文章创建成功",
      });

      // Redirect to the new post's page
      router.push(`/blog/${data.id}`);
    } catch (error: any) {
      toast({
        title: "创建失败",
        description: error.message || "发生了未知错误，请稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>创建新文章</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文章标题"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">内容</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="开始编写文章内容..."
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard">
              <Button variant="outline" disabled={isLoading}>
                取消
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "创建文章"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}