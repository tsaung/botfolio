import { getSystemSetting } from "@/lib/actions/settings";
import { ModelSelector } from "@/components/admin/model-selector";
import { Separator } from "@/components/ui/separator";

export default async function SettingsModelPage() {
  const aiConfig = (await getSystemSetting("ai_model_config")) || {
    provider: "openrouter",
    modelId: "openai/gpt-4o-mini",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Model Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Select the AI model that powers your bot.
        </p>
      </div>
      <Separator />
      <ModelSelector initialConfig={aiConfig} />
    </div>
  );
}
