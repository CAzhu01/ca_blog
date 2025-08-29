"use client";

import React, { useState, useEffect, use } from "react";
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

export default function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
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

    const fetchProject = async () => {
      try {
        const { data: projectData, error } = await supabase
          .from("projects")
          .select("title, content")
          .eq("id", id)
          .single();

        if (error) throw error;

        setTitle(projectData.title);
        setContent(projectData.content);
      } catch (error: any) {
        toast({
          title: "获取项目失败",
          description: "您可能没有权限或项目不存在。",
          variant: "destructive",
        });
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, user, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        title: "表单不完整",
        description: "请填写标题和内容",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("projects")
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "项目已更新" });
      router.push(`/projects/${id}`);
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message,
        variant: "destructive",
      });
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
          <CardTitle>编辑项目</CardTitle>
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
            <Link href={`/projects/${id}`}>
              <Button variant="outline" disabled={isSubmitting}>
                取消
              </Button>
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
