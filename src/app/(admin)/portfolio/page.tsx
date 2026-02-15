import Link from "next/link";
import {
  Briefcase,
  Code2,
  FolderKanban,
  Share2,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const portfolioSections = [
  {
    title: "Projects",
    href: "/portfolio/projects",
    description: "Manage your projects, case studies, and code samples.",
    icon: FolderKanban,
    color: "text-blue-500",
  },
  {
    title: "Experiences",
    href: "/portfolio/experiences",
    description: "Manage your work history and professional roles.",
    icon: Briefcase,
    color: "text-orange-500",
  },
  {
    title: "Skills",
    href: "/portfolio/skills",
    description: "Manage your technical skills and proficiencies.",
    icon: Code2,
    color: "text-purple-500",
  },
  {
    title: "Social Links",
    href: "/portfolio/social-links",
    description: "Manage links to your social media profiles.",
    icon: Share2,
    color: "text-pink-500",
  },
];

export default function PortfolioPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-muted-foreground">
          Manage the content showcased on your public portfolio.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {portfolioSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-all hover:bg-muted/50 hover:shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <section.icon className={`h-8 w-8 ${section.color}`} />
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* We could add quick stats here later */}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
