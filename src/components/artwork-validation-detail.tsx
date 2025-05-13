"use client"

import { useState } from "react"
import { CheckCircle, XCircle, AlertTriangle, Maximize, ChevronLeft, ChevronRight, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AIValidationResults } from "@/components/ai-validation-results"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { ValidationStatus, Validator } from "@/lib/types/validation"

interface ArtworkValidationDetailProps {
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
    validationStatus?: ValidationStatus
  }
  isOpen: boolean
  onClose: () => void
  onValidationComplete: (artworkId: string, isApproved: boolean, feedback: string) => void
}

export function ArtworkValidationDetail({
  artwork,
  isOpen,
  onClose,
  onValidationComplete,
}: ArtworkValidationDetailProps) {
  const [validationDecision, setValidationDecision] = useState<"approve" | "reject" | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isAIValidating, setIsAIValidating] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Mock validation status if not provided
  const validationStatus =
    artwork.validationStatus ||
    ({
      required: 11,
      completed: Math.floor(Math.random() * 11), // Random number of completed validations (0-10)
      approved: Math.floor(Math.random() * 8), // Random number of approvals
      rejected: Math.floor(Math.random() * 3), // Random number of rejections
      status: "in_progress",
      validators: Array(Math.floor(Math.random() * 11))
        .fill(null)
        .map((_, i) => ({
          id: `validator-${i + 1}`,
          name: `Validator ${i + 1}`,
          decision: Math.random() > 0.3 ? "approve" : "reject",
          feedback: `Feedback from validator ${i + 1}`,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          reputation: 70 + Math.floor(Math.random() * 30),
        })),
      consensusReached: false,
    } as ValidationStatus)

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

  const handleSubmit = () => {
    if (!validationDecision) {
      alert("Please select whether to approve or reject this artwork")
      return
    }

    if (feedback.trim() === "") {
      alert("Please provide feedback for the artist")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onValidationComplete(artwork.id, validationDecision === "approve", feedback)
      setIsSubmitting(false)
      setValidationDecision(null)
      setFeedback("")
    }, 1000)
  }

  const nextImage = () => {
    if (currentImageIndex < artwork.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleRequestAIValidation = () => {
    setIsAIValidating(true)
    // Simulate AI processing time
    setTimeout(() => {
      setIsAIValidating(false)
    }, 2000)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Validate Artwork</SheetTitle>
            <SheetDescription>
              This artwork requires validation from 11 validators before a final decision is made
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Artwork Details</TabsTrigger>
                <TabsTrigger value="ai-validation">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Validation
                </TabsTrigger>
                <TabsTrigger value="validators">
                  <Users className="h-4 w-4 mr-2" />
                  Validators ({validationStatus.completed}/{validationStatus.required})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="pt-4">
                <div className="relative">
                  <div
                    className="aspect-square rounded-md overflow-hidden border cursor-pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    <img
                      src={artwork.images[currentImageIndex] || "/placeholder.svg"}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsImageModalOpen(true)
                      }}
                    >
                      <Maximize className="h-4 w-4" />
                    </button>
                  </div>

                  {artwork.images.length > 1 && (
                    <div className="flex justify-center mt-2 space-x-2">
                      <Button variant="outline" size="icon" onClick={prevImage} disabled={currentImageIndex === 0}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm py-2">
                        {currentImageIndex + 1} / {artwork.images.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextImage}
                        disabled={currentImageIndex === artwork.images.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-lg font-bold">{artwork.title}</h3>
                    <p className="text-sm text-gray-500">by {artwork.artist}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Medium</p>
                      <p className="text-gray-500">{artwork.medium}</p>
                    </div>
                    <div>
                      <p className="font-medium">Submitted</p>
                      <p className="text-gray-500">{formatDate(artwork.dateSubmitted)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-sm text-gray-500">{artwork.description}</p>
                  </div>

                  {artwork.additionalInfo && (
                    <div>
                      <p className="font-medium">Additional Information</p>
                      <p className="text-sm text-gray-500">{artwork.additionalInfo}</p>
                    </div>
                  )}

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Validation Progress</h4>
                      <span className="text-sm font-medium">
                        {validationStatus.completed} of {validationStatus.required} validators
                      </span>
                    </div>
                    <Progress value={(validationStatus.completed / validationStatus.required) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{validationStatus.approved} Approve</span>
                      <span>{validationStatus.rejected} Reject</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-validation" className="pt-4">
                <AIValidationResults
                  artwork={artwork}
                  isLoading={isAIValidating}
                  onRequestAIValidation={handleRequestAIValidation}
                />
              </TabsContent>

              <TabsContent value="validators" className="pt-4">
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Validation Progress</h4>
                      <span className="text-sm font-medium">
                        {validationStatus.completed} of {validationStatus.required} validators
                      </span>
                    </div>
                    <Progress value={(validationStatus.completed / validationStatus.required) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{validationStatus.approved} Approve</span>
                      <span>{validationStatus.rejected} Reject</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Validator Decisions</h4>
                    {validationStatus.validators.length > 0 ? (
                      <div className="space-y-3">
                        {validationStatus.validators.map((validator: Validator) => (
                          <div key={validator.id} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  {validator.avatar && (
                                    <AvatarImage src={validator.avatar || "/placeholder.svg"} alt={validator.name} />
                                  )}
                                  <AvatarFallback>{getInitials(validator.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{validator.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {validator.timestamp ? formatDate(validator.timestamp) : ""}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                className={
                                  validator.decision === "approve"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }
                              >
                                {validator.decision === "approve" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {validator.decision === "approve" ? "Approved" : "Rejected"}
                              </Badge>
                            </div>
                            {validator.feedback && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                                "{validator.feedback}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-500">No validators have reviewed this artwork yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Your Validation Decision</h3>

              <RadioGroup
                value={validationDecision || ""}
                onValueChange={(value) => setValidationDecision(value as "approve" | "reject")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="flex items-center cursor-pointer">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="font-medium">Approve</p>
                      <p className="text-sm text-gray-500">Artwork meets authenticity criteria</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject" className="flex items-center cursor-pointer">
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <p className="font-medium">Reject</p>
                      <p className="text-sm text-gray-500">Artwork does not meet authenticity criteria</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-6 space-y-2">
                <Label htmlFor="feedback">Feedback for Artist</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide detailed feedback about your decision..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-gray-500">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  This feedback will be visible to the artist
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-8">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!validationDecision || feedback.trim() === "" || isSubmitting}
              className={
                validationDecision === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : validationDecision === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : ""
              }
            >
              {isSubmitting ? "Submitting..." : "Submit Validation"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{artwork.title}</DialogTitle>
            <DialogDescription>by {artwork.artist}</DialogDescription>
          </DialogHeader>

          <div className="relative">
            <img
              src={artwork.images[currentImageIndex] || "/placeholder.svg"}
              alt={artwork.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />

            {artwork.images.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-black/30 hover:bg-black/50 text-white border-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-black/30 hover:bg-black/50 text-white border-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  disabled={currentImageIndex === artwork.images.length - 1}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="text-center w-full">
              {artwork.images.length > 1 && (
                <span className="text-sm">
                  Image {currentImageIndex + 1} of {artwork.images.length}
                </span>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
