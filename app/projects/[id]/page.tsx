import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EnhancedContent } from "@/components/enhanced-content";
import { LoadingSpinner } from "@/components/loading-spinner";

export const revalidate = 60; // Revalidate every minute

async function ProjectContent({ id }: { id: string }) {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    console.error("Error fetching project:", error);
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      </header>
      <EnhancedContent content={project.content} />
    </article>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Projects list
      </Link>

      <Suspense fallback={<LoadingSpinner />}>
        <ProjectContent id={id} />
      </Suspense>
    </div>
  );
}
