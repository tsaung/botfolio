import { Database } from "@/types/database";
import { format } from "date-fns";
import { Briefcase, Calendar, MapPin } from "lucide-react";

type Experience = Database["public"]["Tables"]["experiences"]["Row"];

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <div className="relative border-l-2 border-muted/50 ml-3 space-y-12">
      {experiences.map((experience) => {
        const startDate = experience.start_date
          ? format(new Date(experience.start_date), "MMM yyyy")
          : "";
        const endDate = experience.end_date
          ? format(new Date(experience.end_date), "MMM yyyy")
          : "Present";

        return (
          <div key={experience.id} className="relative pl-8 md:pl-10 group">
            {/* Timeline Dot */}
            <span className="absolute top-0 left-[-9px] flex items-center justify-center w-[18px] h-[18px] bg-background border-4 border-muted rounded-full group-hover:border-primary transition-colors duration-300 ring-4 ring-background" />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
              <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                {experience.title}
              </h3>
              <time className="text-sm font-mono font-medium text-muted-foreground whitespace-nowrap">
                {startDate} — {endDate}
              </time>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-base font-semibold text-foreground/80">
                {experience.company}
              </span>
              {experience.location && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {experience.location}
                  </span>
                </>
              )}
            </div>

            <div className="relative p-5 bg-card/50 hover:bg-card border border-border/50 hover:border-primary/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {experience.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
