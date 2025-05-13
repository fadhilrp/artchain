"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, Database, Globe, Shield, Settings, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AIValidationSettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")

  // Mock settings state
  const [settings, setSettings] = useState({
    enableAI: true,
    autoRunValidation: true,
    similarityThreshold: 75,
    metadataWeight: 40,
    imageWeight: 60,
    internalDatabase: true,
    publicRegistry: true,
    externalDatabases: true,
    apiKey: "sk-ai-validation-key-12345",
    model: "advanced",
    notifyHighRisk: true,
    storeResults: true,
  })

  const handleToggle = (field: string) => {
    setSettings({
      ...settings,
      [field]: !settings[field as keyof typeof settings],
    })
  }

  const handleSliderChange = (field: string, value: number[]) => {
    setSettings({
      ...settings,
      [field]: value[0],
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to an API
    alert("Settings saved successfully!")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2 flex items-center text-sm" onClick={() => router.push("/app")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">AI Validation Settings</h1>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            <CardTitle>AI Validation Configuration</CardTitle>
          </div>
          <CardDescription>Configure how the AI system validates artwork submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="general">
                <Settings className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="sources">
                <Database className="h-4 w-4 mr-2" />
                Data Sources
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Shield className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-ai" className="text-base font-medium">
                    Enable AI Validation
                  </Label>
                  <p className="text-sm text-gray-500">Turn on AI-powered artwork validation</p>
                </div>
                <Switch id="enable-ai" checked={settings.enableAI} onCheckedChange={() => handleToggle("enableAI")} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-run" className="text-base font-medium">
                    Auto-Run Validation
                  </Label>
                  <p className="text-sm text-gray-500">Automatically run AI validation when artwork is submitted</p>
                </div>
                <Switch
                  id="auto-run"
                  checked={settings.autoRunValidation}
                  onCheckedChange={() => handleToggle("autoRunValidation")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="similarity-threshold" className="text-base font-medium">
                  Similarity Threshold: {settings.similarityThreshold}%
                </Label>
                <p className="text-sm text-gray-500">
                  Minimum similarity percentage to flag artwork as potentially duplicate
                </p>
                <Slider
                  id="similarity-threshold"
                  min={50}
                  max={95}
                  step={5}
                  value={[settings.similarityThreshold]}
                  onValueChange={(value) => handleSliderChange("similarityThreshold", value)}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Less Strict</span>
                  <span>More Strict</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Analysis Weights</Label>
                <p className="text-sm text-gray-500">
                  Adjust how much each factor contributes to the overall validation score
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="metadata-weight" className="text-sm">
                      Metadata: {settings.metadataWeight}%
                    </Label>
                    <Label htmlFor="image-weight" className="text-sm">
                      Image: {settings.imageWeight}%
                    </Label>
                  </div>
                  <Slider
                    id="metadata-weight"
                    min={0}
                    max={100}
                    step={10}
                    value={[settings.metadataWeight]}
                    onValueChange={(value) => {
                      handleSliderChange("metadataWeight", value)
                      handleSliderChange("imageWeight", [100 - value[0]])
                    }}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="internal-db" className="text-base font-medium">
                    Internal Database
                  </Label>
                  <p className="text-sm text-gray-500">Use our internal artwork database for validation</p>
                </div>
                <Switch
                  id="internal-db"
                  checked={settings.internalDatabase}
                  onCheckedChange={() => handleToggle("internalDatabase")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-registry" className="text-base font-medium">
                    Public Registry
                  </Label>
                  <p className="text-sm text-gray-500">Check against public blockchain art registries</p>
                </div>
                <Switch
                  id="public-registry"
                  checked={settings.publicRegistry}
                  onCheckedChange={() => handleToggle("publicRegistry")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="external-db" className="text-base font-medium">
                    External Databases
                  </Label>
                  <p className="text-sm text-gray-500">Connect to third-party art databases for validation</p>
                </div>
                <Switch
                  id="external-db"
                  checked={settings.externalDatabases}
                  onCheckedChange={() => handleToggle("externalDatabases")}
                />
              </div>

              <div className="pt-4 border-t">
                <Label htmlFor="api-key" className="text-base font-medium">
                  API Key
                </Label>
                <p className="text-sm text-gray-500 mb-2">API key for external database access</p>
                <Input
                  id="api-key"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => handleInputChange("apiKey", e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model-selection" className="text-base font-medium">
                  AI Model
                </Label>
                <p className="text-sm text-gray-500">Select the AI model to use for validation</p>
                <Select value={settings.model} onValueChange={(value) => handleInputChange("model", value)}>
                  <SelectTrigger id="model-selection">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (Faster, less accurate)</SelectItem>
                    <SelectItem value="standard">Standard (Balanced)</SelectItem>
                    <SelectItem value="advanced">Advanced (Slower, more accurate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-high-risk" className="text-base font-medium">
                    Notify on High Risk
                  </Label>
                  <p className="text-sm text-gray-500">Send notifications for high-risk validation results</p>
                </div>
                <Switch
                  id="notify-high-risk"
                  checked={settings.notifyHighRisk}
                  onCheckedChange={() => handleToggle("notifyHighRisk")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="store-results" className="text-base font-medium">
                    Store Validation Results
                  </Label>
                  <p className="text-sm text-gray-500">Save AI validation results for future reference</p>
                </div>
                <Switch
                  id="store-results"
                  checked={settings.storeResults}
                  onCheckedChange={() => handleToggle("storeResults")}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
        <div className="flex items-start">
          <Globe className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Data Privacy Notice</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              When using external databases, artwork data may be sent to third-party services for validation. All data
              is processed securely and in accordance with our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
