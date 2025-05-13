import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
        <p className="text-lg font-medium">Loading rewards data...</p>
      </div>
    </div>
  )
}
