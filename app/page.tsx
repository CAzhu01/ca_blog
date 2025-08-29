import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Github, Mail, ArrowDown, Edit } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BlogPostCard } from "@/components/blog-post-card";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

async function RecentBlogs() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching recent posts:", error);
    return <p>Error loading posts.</p>;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No blog posts yet.
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post as any} />
      ))}
    </div>
  );
}

async function RecentProjects() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: true })
    .limit(4);

  if (error) {
    console.error("Error fetching recent projects:", error);
    return <p>Error loading projects.</p>;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No projects yet.</div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6 min-h-[60px]">
              {project.content}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/projects/${project.id}`}>查看详情</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Introduction Section */}
      <section
        id="intro"
        className="min-h-screen flex flex-col items-center justify-center text-center relative"
      >
        <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
          <div className="md:mr-12 mb-8 md:mb-0">
            <Avatar className="w-40 h-40 ring-4 ring-primary/20">
              <AvatarImage src="/zuoweimen.jpg" alt="Your Name" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hello, I'm CAZhu
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              I am a student learning Web3, focusing on smart contract
              development with Hardhat and building front-end applications with
              React and Next.js. I am passionate about creating clean,
              user-friendly interfaces and exploring practical Web3 solutions.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="/blog">
                <Button size="lg">My Blog</Button>
              </Link>
              <Link href="#contact">
                <Button variant="outline" size="lg">
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-12 animate-bounce">
          <Link href="#recent-blogs">
            <ArrowDown className="w-8 h-8 text-muted-foreground" />
          </Link>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section
        id="recent-blogs"
        className="min-h-screen flex flex-col items-center justify-center py-20"
      >
        <h2 className="text-3xl font-bold text-center mb-12">Recent Blogs</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <RecentBlogs />
        </Suspense>
        <div className="mt-12">
          <Link href="/blog">
            <Button variant="outline">View All Blogs</Button>
          </Link>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen flex flex-col items-center justify-center py-20"
      >
        <h2 className="text-3xl font-bold text-center mb-12">My Projects</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <RecentProjects />
        </Suspense>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex flex-col items-center justify-center text-center"
      >
        <h2 className="text-3xl font-bold mb-8">Contact Me</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Feel free to reach out. I'm always open to connecting and
          collaborating.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <Link
            href="https://github.com/CAzhu01"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg hover:text-primary transition-colors"
          >
            <Github className="w-6 h-6" />
            <span>GitHub</span>
          </Link>
          <Link
            href="mailto:your-email@example.com"
            className="flex items-center gap-2 text-lg hover:text-primary transition-colors"
          >
            <Mail className="w-6 h-6" />
            <span>1460622019@qq.com</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
