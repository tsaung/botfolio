import { Database } from "@/types/database";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bot,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { TechIcon } from "@/components/portfolio/tech-icons";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
type Skill = Database["public"]["Tables"]["skills"]["Row"];

interface ProfileHeroProps {
  profile: Profile | null;
  socialLinks?: SocialLink[];
  skills?: Skill[];
}

export function ProfileHero({
  profile,
  socialLinks = [],
  skills = [],
}: ProfileHeroProps) {
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center p-8 min-h-[50vh]">
        <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-muted shadow-xl">
          <img
            src="/avatar.jpg"
            alt="Default Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Welcome to BotFolio
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            This portfolio is currently empty. Please set up your profile to
            verify your identity.
          </p>
        </div>
        <Button asChild variant="default" size="lg" className="mt-4">
          <Link href="/login">Set up Profile</Link>
        </Button>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="w-5 h-5" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      case "x":
        return <Twitter className="w-5 h-5" />;
      case "email":
        return <Mail className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center py-12 md:py-20 animate-in fade-in zoom-in duration-500">
      <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-2xl ring-4 ring-primary/10">
        <AvatarImage
          src={profile.avatar_url || "/avatar.jpg"}
          alt={profile.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-muted text-4xl">
          {profile.name?.slice(0, 2).toUpperCase() || (
            <Bot className="w-16 h-16 opacity-50" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-4 max-w-2xl px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {profile.name}
        </h1>

        {(() => {
          const topSkills = skills
            .filter((s) => (s.proficiency ?? 0) >= 4)
            .slice(0, 6);

          if (topSkills.length > 0) {
            return (
              <div className="flex flex-wrap items-center justify-center gap-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {topSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="p-3 bg-secondary/30 rounded-2xl group-hover:bg-secondary/60 transition-colors">
                      <TechIcon name={skill.name} className="w-8 h-8" />
                    </div>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            );
          }

          return profile.profession ? (
            <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {profile.profession}
            </p>
          ) : null;
        })()}

        {profile.welcome_message && (
          <p className="text-muted-foreground text-lg leading-relaxed pt-2 max-w-lg mx-auto">
            {profile.welcome_message
              .replace("{name}", profile.name || "")
              .replace("{profession}", profile.profession || "")
              .replace("{experience}", String(profile.experience || ""))
              .replace("{field}", profile.field || "")}
          </p>
        )}
      </div>

      {socialLinks.length > 0 && (
        <div className="flex items-center gap-4 pt-4">
          {socialLinks.map((link) => (
            <Button
              key={link.id}
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full hover:bg-muted/80 hover:scale-110 transition-all"
            >
              <Link href={link.url} target="_blank" rel="noopener noreferrer">
                {getSocialIcon(link.platform)}
                <span className="sr-only">{link.platform}</span>
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
