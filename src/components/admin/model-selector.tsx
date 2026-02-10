'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateSystemSetting } from '@/lib/actions/settings'

const MODEL_OPTIONS = [
  { label: 'GPT-4o (OpenAI)', value: 'openai/gpt-4o' },
  { label: 'GPT-4o Mini (OpenAI)', value: 'openai/gpt-4o-mini' },
  { label: 'Claude 3.5 Sonnet (Anthropic)', value: 'anthropic/claude-3.5-sonnet' },
  { label: 'Llama 3.1 70B (Meta)', value: 'meta-llama/llama-3.1-70b-instruct' },
]

interface ModelSelectorProps {
  initialConfig: {
    provider: string
    modelId: string
  }
}

export function ModelSelector({ initialConfig }: ModelSelectorProps) {
  const [modelId, setModelId] = React.useState(initialConfig?.modelId || 'openai/gpt-4o-mini')
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSystemSetting('ai_model_config', {
        provider: 'openrouter',
        modelId,
      })
      alert('Settings saved!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>AI Model</CardTitle>
        <CardDescription>Select the AI model for the public chat interface.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Model
          </label>
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}
