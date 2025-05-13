"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface RewardTransactionDetailsProps {
  transaction: {
    id: string
    date: string
    amount: number
    type: string
    status: string
    artworkId: string
    artworkTitle: string
    artworkArtist: string
    artworkImage: string
    note?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function RewardTransactionDetails({ transaction, isOpen, onClose }: RewardTransactionDetailsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ART`
  }

  // Mock blockchain transaction hash
  const transactionHash = "0x7f9e4b5c3d2a1f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3"

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Details for transaction {transaction.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge
              variant="outline"
              className={
                transaction.status === "completed"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
              }
            >
              {transaction.status === "completed" ? "Completed" : "Pending"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Amount</span>
            <span className="text-sm font-bold">{formatCurrency(transaction.amount)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Date</span>
            <span className="text-sm">{formatDate(transaction.date)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Type</span>
            <Badge
              variant="outline"
              className={
                transaction.type === "bonus"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              }
            >
              {transaction.type === "verification" ? "Verification Reward" : "Bonus Reward"}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <span className="text-sm font-medium">Artwork</span>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={transaction.artworkImage || "/placeholder.svg"}
                  alt={transaction.artworkTitle}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{transaction.artworkTitle}</p>
                <p className="text-xs text-gray-500">by {transaction.artworkArtist}</p>
              </div>
            </div>
          </div>

          {transaction.note && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Note</span>
              <p className="text-sm text-gray-500 bg-gray-50 dark:bg-gray-900 p-2 rounded-md">{transaction.note}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <span className="text-sm font-medium">Blockchain Details</span>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Transaction ID</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono truncate max-w-[150px]">{transaction.id}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleCopyToClipboard(transaction.id)}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy transaction ID</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Blockchain Hash</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono truncate max-w-[150px]">{transactionHash}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleCopyToClipboard(transactionHash)}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy transaction hash</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Blockchain Explorer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
