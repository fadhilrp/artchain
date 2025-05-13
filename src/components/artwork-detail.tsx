"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, FileText, Download, Info, Shield } from "lucide-react"
import { ArtworkValidationStatus } from "@/components/artwork-validation-status"

interface ArtworkDetailProps {
  artwork: {
    id: string
    title: string
    artist: string
    dateSubmitted: string
    status: string
    medium: string
    images: string[]
    description: string
    additionalInfo?: string
    feedback?: string
    tokenId?: string
    transactionHash?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ArtworkDetail({ artwork, isOpen, onClose }: ArtworkDetailProps) {
  const [activeTab, setActiveTab] = useState("details")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Unknown
          </Badge>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{artwork.title}</DialogTitle>
          <DialogDescription>by {artwork.artist}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Artwork Details</TabsTrigger>
            <TabsTrigger value="validation">
              <Shield className="h-4 w-4 mr-2" />
              Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={artwork.images[0] || "/placeholder.svg"}
                  alt={artwork.title}
                  className="w-full h-auto rounded-md"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  {getStatusBadge(artwork.status)}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Medium</h4>
                  <p className="text-sm text-gray-500">{artwork.medium}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-gray-500">{artwork.description}</p>
                </div>

                {artwork.additionalInfo && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Additional Information</h4>
                    <p className="text-sm text-gray-500">{artwork.additionalInfo}</p>
                  </div>
                )}

                {artwork.feedback && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Validator Feedback</h4>
                    <p className="text-sm text-gray-500">{artwork.feedback}</p>
                  </div>
                )}

                {artwork.status === "verified" && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Blockchain Information</h4>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Token ID: {artwork.tokenId}</p>
                      <p>Transaction: {artwork.transactionHash}</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        <FileText className="h-4 w-4 mr-2" />
                        View Certificate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="pt-6">
            <ArtworkValidationStatus artworkId={artwork.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
