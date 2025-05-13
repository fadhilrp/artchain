import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserDashboard } from "@/components/user-dashboard"
import { ValidatorDashboard } from "@/components/validator-dashboard"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ArtChain Dashboard</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="user">User Dashboard</TabsTrigger>
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
