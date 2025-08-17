"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Quote,
  Highlighter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "开始编写内容...",
  disabled = false,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedCodeLanguage, setSelectedCodeLanguage] = useState("js");
  const [isClient, setIsClient] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const supabase = getSupabaseClient();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {},
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none p-4",
      },
    },
  });

  if (!editor || !isClient) {
    return (
      <div className="border rounded-md h-[300px] flex items-center justify-center">
        加载编辑器中...
      </div>
    );
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录后才能上传图片。",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const filePath = `public/${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (data.publicUrl) {
        editor.chain().focus().setImage({ src: data.publicUrl }).run();
        toast({ title: "图片上传成功" });
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "图片上传失败",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const addCodeBlock = () => {
    editor
      .chain()
      .focus()
      .toggleCodeBlock({ language: selectedCodeLanguage })
      .run();
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can().chain().focus().toggleBold().run() || disabled
          }
          className={editor.isActive("bold") ? "bg-muted" : ""}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can().chain().focus().toggleItalic().run() || disabled
          }
          className={editor.isActive("italic") ? "bg-muted" : ""}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={disabled}
          className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
          type="button"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={disabled}
          className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
          type="button"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={editor.isActive("blockquote") ? "bg-muted" : ""}
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          disabled={disabled}
          className={editor.isActive("highlight") ? "bg-muted" : ""}
          type="button"
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              className={editor.isActive("codeBlock") ? "bg-muted" : ""}
              type="button"
            >
              <Code className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Select
                  value={selectedCodeLanguage}
                  onValueChange={setSelectedCodeLanguage}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="js">JavaScript</SelectItem>
                    <SelectItem value="ts">TypeScript</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="plaintext">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addCodeBlock} type="button">
                  插入代码块
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              className={editor.isActive("link") ? "bg-muted" : ""}
              type="button"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <Input
                type="url"
                placeholder="输入链接 URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Button onClick={addLink} type="button">
                添加链接
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              type="button"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">通过URL添加</p>
              <Input
                type="url"
                placeholder="输入图片 URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isUploading}
              />
              <Button onClick={addImage} type="button" disabled={isUploading}>
                添加图片
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-popover px-2 text-muted-foreground">
                    或
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="image-upload">上传本地图片</label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="text-sm"
                />
                {isUploading && <p className="text-sm text-muted-foreground">上传中，请稍候...</p>}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="ml-auto flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run() || disabled}
            type="button"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run() || disabled}
            type="button"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-md"
      />
    </div>
  );
}