"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModelSelector } from "@/components/admin/model-selector";

interface AISettingsProps {
  initialConfig: any; // Replace 'any' with proper type if available, e.g. AIModelConfig
}

export function AISettings({ initialConfig }: AISettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Configuration</CardTitle>
        <CardDescription>
          Manage how the AI interacts with visitors on your portfolio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 max-w-2xl">
          <ModelSelector initialConfig={initialConfig} />
        </div>
      </CardContent>
    </Card>
  );
}
