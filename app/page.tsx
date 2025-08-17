import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-primary/20">
          <AvatarImage src="/placeholder-user.jpg" alt="Your Name" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Hello,CAZhu</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          student learning web3
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/blog">
            <Button size="lg">My Blog</Button>
          </Link>
          <Link href="mailto:your-email@example.com">
            <Button variant="outline" size="lg">
              <Mail className="mr-2 h-5 w-5" /> contact me
            </Button>
          </Link>
        </div>
      </section>

      {/* About Me Section */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">About Me</h2>
        <p className="text-lg text-center text-muted-foreground">
          I write smart contracts using Hardhat and build frontend applications
          with React and Next.js. I focus on creating clean, user-friendly
          interfaces and integrating practical Web3 solutions.
        </p>
      </section>

      {/* Projects Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">My Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Project Card 1 (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>项目一</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                这是一个项目的简短描述。介绍这个项目是做什么的，以及它解决了什么问题。
              </p>
              <Button variant="outline" asChild>
                <Link href="#">查看详情</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Project Card 2 (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>项目二</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                这是另一个项目的简短描述。可以突出你在这个项目中使用的技术。
              </p>
              <Button variant="outline" asChild>
                <Link href="#">查看详情</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Project Card 3 (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>更多项目</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                你可以在你的 GitHub 主页上看到我所有的项目。
              </p>
              <Button variant="outline" asChild>
                <Link href="https://github.com/your-github" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
