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
    <div className="relative border-l border-border ml-3 space-y-10">
      {experiences.map((experience) => {
        const startDate = experience.start_date
          ? format(new Date(experience.start_date), "MMM yyyy")
          : "";
        const endDate = experience.end_date
          ? format(new Date(experience.end_date), "MMM yyyy")
          : "Present";

        return (
          <div key={experience.id} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full -left-3 ring-8 ring-background">
              <Briefcase className="w-3 h-3 text-primary" />
            </span>
            <div className="p-4 bg-card border border-border rounded-lg shadow-sm">
              <div className="justify-between items-center mb-3 sm:flex">
                <time className="mb-1 text-xs font-normal text-muted-foreground sm:order-last sm:mb-0 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {startDate} - {endDate}
                  {experience.location && (
                    <span className="ml-3 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {experience.location}
                    </span>
                  )}
                </time>
                <div className="text-sm font-normal text-muted-foreground flex">
                  <h3 className="text-lg font-semibold text-foreground">
                    {experience.title}
                  </h3>
                  <span className="text-base font-medium text-primary block">
                    @{experience.company}
                  </span>
                </div>
              </div>
              <div className="p-3 text-xs italic font-normal text-muted-foreground border border-border rounded-lg bg-muted">
                {experience.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
