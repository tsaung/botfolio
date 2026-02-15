"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  ArrowUp,
  ArrowDown,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Database } from "@/types/database";
import {
  deleteExperience,
  reorderExperiences,
} from "@/lib/actions/experiences";
import { toast } from "sonner";
import { format } from "date-fns";

type Experience = Database["public"]["Tables"]["experiences"]["Row"];

interface ExperiencesListProps {
  initialExperiences: Experience[];
}

export function ExperiencesList({ initialExperiences }: ExperiencesListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingExperience, setDeletingExperience] =
    useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  function handleDeleteClick(experience: Experience) {
    setDeletingExperience(experience);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deletingExperience) return;
    setIsDeleting(true);

    try {
      await deleteExperience(deletingExperience.id);
      setDeleteDialogOpen(false);
      setDeletingExperience(null);
      toast.success("Experience deleted successfully");
    } catch (error) {
      console.error("Failed to delete experience:", error);
      toast.error("Failed to delete experience");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleReorder(index: number, direction: "up" | "down") {
    if (isReordering) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === initialExperiences.length - 1) return;

    setIsReordering(true);
    const newExperiences = [...initialExperiences];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    // Swap items
    [newExperiences[index], newExperiences[targetIndex]] = [
      newExperiences[targetIndex],
      newExperiences[index],
    ];

    // Update sort_order for all affected items
    const updates = newExperiences.map((exp, idx) => ({
      id: exp.id,
      sort_order: idx,
    }));

    try {
      await reorderExperiences(updates);
      toast.success("Experience order updated");
    } catch (error) {
      console.error("Failed to reorder experiences:", error);
      toast.error("Failed to reorder experiences");
    } finally {
      setIsReordering(false);
    }
  }

  function formatDateRange(start: string, end: string | null) {
    const startDate = format(new Date(start), "MMM yyyy");
    const endDate = end ? format(new Date(end), "MMM yyyy") : "Present";
    return `${startDate} - ${endDate}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
          <p className="text-muted-foreground">
            Manage your work history and professional roles.
          </p>
        </div>
        <Button onClick={() => router.push("/portfolio/experiences/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="border-b">
              <th className="h-10 px-4 font-medium w-[50px]">Order</th>
              <th className="h-10 px-4 font-medium">Role & Company</th>
              <th className="h-10 px-4 font-medium hidden sm:table-cell">
                Duration
              </th>
              <th className="h-10 px-4 font-medium hidden md:table-cell">
                Location
              </th>
              <th className="h-10 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialExperiences.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No experiences added yet. Click &quot;Add Experience&quot; to
                  get started.
                </td>
              </tr>
            ) : (
              initialExperiences.map((experience, index) => (
                <tr
                  key={experience.id}
                  className="border-b last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleReorder(index, "up")}
                        disabled={index === 0 || isReordering}
                        title="Move Up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleReorder(index, "down")}
                        disabled={
                          index === initialExperiences.length - 1 ||
                          isReordering
                        }
                        title="Move Down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted rounded-md p-2 hidden sm:block">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-base">
                          {experience.title}
                        </span>
                        <span className="text-muted-foreground">
                          {experience.company}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>
                        {formatDateRange(
                          experience.start_date,
                          experience.end_date,
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {experience.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{experience.location}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          router.push(
                            `/portfolio/experiences/${experience.id}/edit`,
                          )
                        }
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(experience)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;
              {deletingExperience?.title} at {deletingExperience?.company}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
