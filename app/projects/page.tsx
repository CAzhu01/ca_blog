import { Suspense } from "react";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Edit } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

async function ProjectsList({ query }: { query: string }) {
  const supabase = await createClient();
  let queryBuilder = supabase.from("projects").select("*");

  if (query) {
    queryBuilder = queryBuilder.ilike("title", `%${query}%`);
  }

  const { data: projects, error } = await queryBuilder;

  if (error) {
    console.error("Supabase error fetching projects:", error.message);
    throw new Error("Failed to fetch projects.");
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          {query ? `No results for \"${query}\"` : "No projects yet."}
        </p>
        {query ? (
          <Link href="/projects">
            <Button variant="outline">Clear search</Button>
          </Link>
        ) : (
          <Link href="/projects/create">
            <Button>Create your first project</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {projects.map((project) => (
        <div key={project.id} className="flex items-center gap-4">
          <div className="flex-grow">
            <ProjectCard project={project as any} />
          </div>
          <Button variant="outline" asChild>
            <Link href={`/projects/edit/${project.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              编辑
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function ProjectsListPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-muted-foreground">
          {query ? `Showing results for \"${query}\"` : "My projects and works"}
        </p>
      </section>

      <section>
        <Suspense fallback={<LoadingSpinner />}>
          <ProjectsList query={query} />
        </Suspense>
      </section>
    </div>
  );
}
