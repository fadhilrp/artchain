"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadApiExample, ValidationApiExample, RewardApiExample } from "@/components/api-examples"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ApiDemoPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2 flex items-center text-sm" onClick={() => router.push("/app")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">API Demo</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mock API Examples</CardTitle>
          <CardDescription>Test the mock APIs for upload, validation, and reward processes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upload">Upload API</TabsTrigger>
              <TabsTrigger value="validation">Validation API</TabsTrigger>
              <TabsTrigger value="reward">Reward API</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  The Upload API handles the process of uploading artwork images and metadata to the platform,
                  registering them on the blockchain, and tracking the upload status.
                </p>
                <UploadApiExample />
              </div>
            </TabsContent>

            <TabsContent value="validation">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  The Validation API handles the process of reviewing and validating artwork submissions, including
                  AI-assisted validation and decision submission.
                </p>
                <ValidationApiExample />
              </div>
            </TabsContent>

            <TabsContent value="reward">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  The Reward API handles the process of calculating and distributing rewards to validators, tracking
                  reward balances, and processing withdrawals.
                </p>
                <RewardApiExample />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
        <h3 className="font-medium mb-2">API Implementation Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>These are mock APIs for demonstration and development purposes only.</li>
          <li>In a production environment, these would be replaced with real API endpoints.</li>
          <li>The mock APIs simulate network latency and processing time for a realistic experience.</li>
          <li>All data is randomly generated and does not persist between page refreshes.</li>
          <li>Error handling and validation are simplified for demonstration purposes.</li>
        </ul>
      </div>
    </div>
  )
}
