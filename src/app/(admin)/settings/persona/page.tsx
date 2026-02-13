import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea"; // Assuming we'll use a form here later
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPersonaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Persona</h3>
        <p className="text-sm text-muted-foreground">
          Define how your bot behaves and interacts with visitors.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="system-prompt">System Prompt</Label>
          <Textarea
            id="system-prompt"
            placeholder="You are a helpful portfolio assistant..."
            className="min-h-[200px]"
          />
          <p className="text-sm text-muted-foreground">
            This serves as the "brain" of your bot. You can use placeholders
            like {"{name}"} which will be replaced by your profile data.
          </p>
        </div>
        <Button>Save Persona</Button>
      </div>
    </div>
  );
}
