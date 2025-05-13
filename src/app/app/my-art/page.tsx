"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserArtworkList } from "@/components/user-artwork-list"
import { ArrowLeft, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MyArtPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2 flex items-center text-sm" onClick={() => router.push("/app")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">My Artwork</h1>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => router.push("/app/upload")}>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Artwork
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artwork Collection</CardTitle>
          <CardDescription>Manage and track your registered artwork</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <UserArtworkList filter="all" />
            </TabsContent>

            <TabsContent value="verified">
              <UserArtworkList filter="verified" />
            </TabsContent>

            <TabsContent value="pending">
              <UserArtworkList filter="pending" />
            </TabsContent>

            <TabsContent value="rejected">
              <UserArtworkList filter="rejected" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
