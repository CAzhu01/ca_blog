import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Github, Mail, ArrowDown } from "lucide-react";

export default function HomePage() {
  const projects = [
    {
      title: "项目一",
      description:
        "这是一个项目的简短描述。介绍这个项目是做什么的，以及它解决了什么问题。",
      link: "#",
    },
    {
      title: "项目二",
      description:
        "这是另一个项目的简短描述。可以突出你在这个项目中使用的技术。",
      link: "#",
    },
    {
      title: "项目三",
      description: "这是第三个项目的简短描述。分享项目的亮点和挑战。",
      link: "#",
    },
    {
      title: "项目四",
      description:
        "这是第四个项目的简短描述。可以是你的个人作品或参与的开源项目。",
      link: "#",
    },
  ];

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
          <Link href="#projects">
            <ArrowDown className="w-8 h-8 text-muted-foreground" />
          </Link>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="min-h-screen flex flex-col items-center justify-center py-20"
      >
        <h2 className="text-3xl font-bold text-center mb-12">My Projects</h2>
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 min-h-[60px]">
                  {project.description}
                </p>
                <Button variant="outline" asChild>
                  <Link href={project.link}>查看详情</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
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
