import { getSystemSetting } from '@/lib/actions/settings'
import { ModelSelector } from '@/components/admin/model-selector'

export default async function AISettingsPage() {
  const config = await getSystemSetting('ai_model_config') || {
    provider: 'openrouter',
    modelId: 'openai/gpt-4o-mini',
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Settings</h1>
        <p className="text-muted-foreground">Configure the AI models and behavior.</p>
      </div>
      <ModelSelector initialConfig={config} />
    </div>
  )
}
