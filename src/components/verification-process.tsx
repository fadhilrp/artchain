"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Users,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AIValidationResults } from "@/components/ai-validation-results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ValidationStatus, Validator } from "@/lib/types/validation";

interface VerificationProcessProps {
  artwork: {
    id: string;
    title: string;
    artist: string;
    dateSubmitted: string;
    status: string;
    medium: string;
    images: string[];
    description: string;
    additionalInfo?: string;
    validationStatus?: ValidationStatus;
  };
  isOpen: boolean;
  onClose: () => void;
  onComplete: (
    artworkId: string,
    isApproved: boolean,
    feedback: string
  ) => void;
  totalSelected: number;
  currentIndex: number;
}

export function VerificationProcess({
  artwork,
  isOpen,
  onClose,
  onComplete,
  totalSelected,
  currentIndex,
}: VerificationProcessProps) {
  const [step, setStep] = useState<"analyzing" | "results" | "decision">(
    "analyzing"
  );
  const [validationDecision, setValidationDecision] = useState<
    "approve" | "reject" | null
  >(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("artwork");

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
          timestamp: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          reputation: 70 + Math.floor(Math.random() * 30),
        })),
      consensusReached: false,
    } as ValidationStatus);

  useEffect(() => {
    // Simulate AI analysis progress
    if (step === "analyzing") {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("results"), 500);
            return 100;
          }
          return newProgress;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [step]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = () => {
    if (!validationDecision) {
      alert("Please select whether to approve or reject this artwork");
      return;
    }

    if (feedback.trim() === "") {
      alert("Please provide feedback for the artist");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onComplete(artwork.id, validationDecision === "approve", feedback);
      setIsSubmitting(false);
      setValidationDecision(null);
      setFeedback("");
      setStep("analyzing");
      setAnalysisProgress(0);
    }, 1000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderStepContent = () => {
    switch (step) {
      case "analyzing":
        return (
          <div className="py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-teal-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">AI Analysis in Progress</h3>
            <p className="text-gray-500 mb-6">
              Our AI is analyzing the artwork against millions of existing
              pieces...
            </p>
            <div className="max-w-md mx-auto mb-4">
              <Progress value={analysisProgress} className="h-2" />
            </div>
            <p className="text-sm text-gray-400">
              This usually takes less than a minute
            </p>
          </div>
        );

      case "results":
        return (
          <div className="py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="artwork">Artwork Details</TabsTrigger>
                <TabsTrigger value="ai-results">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Analysis
                </TabsTrigger>
                {/* <TabsTrigger value="validators">
                  <Users className="h-4 w-4 mr-2" />
                  Validators ({artwork.consensusCount}/
                  {artwork.requiredValidators})
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="artwork">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="aspect-square rounded-md overflow-hidden border">
                      <img
                        src={artwork?.images?.[0] || "/placeholder.svg"}
                        alt={artwork?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold">{artwork?.title}</h3>
                      <p className="text-sm text-gray-500">
                        by {artwork?.artist}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Medium</p>
                        <p className="text-gray-500">{artwork?.medium}</p>
                      </div>
                      <div>
                        <p className="font-medium">Submitted</p>
                        <p className="text-gray-500">
                          {formatDate(artwork?.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-sm text-gray-500">
                        {artwork?.description}
                      </p>
                    </div>

                    {artwork?.additionalInfo && (
                      <div>
                        <p className="font-medium">Additional Information</p>
                        <p className="text-sm text-gray-500">
                          {artwork.additionalInfo}
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">
                          Validation Progress
                        </h4>
                        <span className="text-sm font-medium">
                          {artwork.consensusCount} of{" "}
                          {artwork.requiredValidators} validators
                        </span>
                      </div>
                      <Progress
                        value={
                          (validationStatus.completed /
                            validationStatus.required) *
                          100
                        }
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{validationStatus.approved} Approve</span>
                        <span>{validationStatus.rejected} Reject</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai-results">
                <AIValidationResults artwork={artwork} />
              </TabsContent>

              {/* <TabsContent value="validators">
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">
                        Validation Progress
                      </h4>
                      <span className="text-sm font-medium">
                        {validationStatus.completed} of{" "}
                        {validationStatus.required} validators
                      </span>
                    </div>
                    <Progress
                      value={
                        (validationStatus.completed /
                          validationStatus.required) *
                        100
                      }
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{validationStatus.approved} Approve</span>
                      <span>{validationStatus.rejected} Reject</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Validator Decisions</h4>
                    {validationStatus.validators.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {validationStatus.validators.map(
                          (validator: Validator) => (
                            <div
                              key={validator.id}
                              className="border rounded-lg p-3 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    {validator.avatar && (
                                      <AvatarImage
                                        src={
                                          validator.avatar || "/placeholder.svg"
                                        }
                                        alt={validator.name}
                                      />
                                    )}
                                    <AvatarFallback>
                                      {getInitials(validator.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {validator.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {validator.timestamp
                                        ? formatDate(validator.timestamp)
                                        : ""}
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
                                  {validator.decision === "approve"
                                    ? "Approved"
                                    : "Rejected"}
                                </Badge>
                              </div>
                              {validator.feedback && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                                  "{validator.feedback}"
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-500">
                          No validators have reviewed this artwork yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent> */}
            </Tabs>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setStep("decision")}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Continue to Decision
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "decision":
        return (
          <div className="py-6 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Validation Progress</h4>
                <span className="text-sm font-medium">
                  {artwork.consensusCount} of {artwork.requiredValidators}{" "}
                  validators
                </span>
              </div>
              <Progress
                value={
                  (artwork.consensusCount / artwork.requiredValidators) * 100
                }
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{validationStatus.approved} Approve</span>
                <span>{validationStatus.rejected} Reject</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                This artwork requires validation from{" "}
                {validationStatus.required} validators before a final decision
                is made
              </p>
            </div>

            <h3 className="text-lg font-bold">Your Validation Decision</h3>

            <RadioGroup
              value={validationDecision || ""}
              onValueChange={(value) =>
                setValidationDecision(value as "approve" | "reject")
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 dark:hover:bg-gray-900">
                <RadioGroupItem value="approve" id="approve" />
                <Label
                  htmlFor="approve"
                  className="flex items-center cursor-pointer"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="font-medium">Approve</p>
                    <p className="text-sm text-gray-500">
                      Artwork meets authenticity criteria
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-gray-50 dark:hover:bg-gray-900">
                <RadioGroupItem value="reject" id="reject" />
                <Label
                  htmlFor="reject"
                  className="flex items-center cursor-pointer"
                >
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="font-medium">Reject</p>
                    <p className="text-sm text-gray-500">
                      Artwork does not meet authenticity criteria
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
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
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Verifying Artwork</DialogTitle>
          <DialogDescription>
            {step === "analyzing"
              ? "AI is analyzing the artwork"
              : step === "results"
              ? "Review AI analysis results"
              : "Make your validation decision"}
          </DialogDescription>
        </DialogHeader>

        {renderStepContent()}

        <DialogFooter>
          {step === "decision" ? (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => setStep("results")}>
                Back to Results
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !validationDecision || feedback.trim() === "" || isSubmitting
                }
                className={
                  validationDecision === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : validationDecision === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : ""
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Decision"}
              </Button>
            </div>
          ) : step === "results" ? (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
