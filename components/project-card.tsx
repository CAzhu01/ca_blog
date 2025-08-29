import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <Link href={`/projects/${project.id}`} className="hover:underline">
          <h3 className="text-xl font-bold">{project.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">
          {project.content.substring(0, 120)}...
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/projects/${project.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            查看详情
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
