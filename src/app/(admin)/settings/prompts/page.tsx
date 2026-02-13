import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Suggested Prompts</h3>
        <p className="text-sm text-muted-foreground">
          Configure the quick reply options that visitors see when they first
          open the chat.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Label htmlFor={`prompt-${i}`}>Prompt {i}</Label>
            <Input
              id={`prompt-${i}`}
              placeholder="e.g. Tell me about your experience"
            />
          </div>
        ))}
        <Button>Save Prompts</Button>
      </div>
    </div>
  );
}
