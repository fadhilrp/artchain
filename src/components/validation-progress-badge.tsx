import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ValidationProgressBadgeProps {
  completed: number
  required: number
  status: "pending" | "in_progress" | "approved" | "rejected"
}

export function ValidationProgressBadge({ completed, required, status }: ValidationProgressBadgeProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      case "in_progress":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {completed}/{required}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-2 w-48">
                  <p className="text-xs">Validation Progress</p>
                  <Progress value={(completed / required) * 100} className="h-1.5" />
                  <p className="text-xs text-gray-500">
                    {completed} of {required} validators have reviewed this artwork
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  return getStatusBadge()
}
