"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserDashboard } from "@/components/user-dashboard"
import { ValidatorDashboard } from "@/components/validator-dashboard"

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("user")

  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="user">Artist Dashboard</TabsTrigger>
          <TabsTrigger value="validator">Validator Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <UserDashboard />
        </TabsContent>

        <TabsContent value="validator">
          <ValidatorDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
