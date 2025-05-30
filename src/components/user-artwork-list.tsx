"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Download,
  Users,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ValidationProgressBadge } from "@/components/validation-progress-badge";
import { ArtworkValidationStatus } from "@/components/artwork-validation-status";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserArtworkListProps {
  filter?: "all" | "verified" | "pending" | "rejected";
}

export function UserArtworkList({ filter = "all" }: UserArtworkListProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetch('http://localhost:3001/artworks')
      .then(res => res.json())
      .then(data => {
        setSubmissions(
          data.map((artwork: any) => ({
            id: artwork.id,
            title: artwork.title,
            dateSubmitted: artwork.metadata?.timestamp || artwork.createdAt,
            status: artwork.consensus
              ? (artwork.isDuplicate ? "rejected" : "verified")
              : "pending",
            medium: artwork.metadata?.medium || "Unknown",
            images: ["/placeholder.svg"], // No image storage yet
            description: artwork.metadata?.description || "",
            feedback: artwork.isDuplicate ? "Duplicate artwork detected." : null,
            tokenId: null,
            transactionHash: null,
            validationStatus: {
              required: 11,
              completed: artwork.consensus ? 11 : 5,
              approved: artwork.isDuplicate ? 3 : 9,
              rejected: artwork.isDuplicate ? 8 : 2,
              status: artwork.consensus
                ? (artwork.isDuplicate ? "rejected" : "approved")
                : "in_progress",
              validators: [],
              consensusReached: artwork.consensus,
              consensusDate: artwork.metadata?.timestamp || artwork.createdAt,
            },
          }))
        );
      });
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(
        submissions.filter((submission) => submission.status === filter)
      );
    }
  }, [submissions, filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">Loading your submissions...</p>
      </div>
    );
  }

  if (filteredSubmissions.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500">No artwork found with this status.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSubmissions.map((submission) => (
        <div
          key={submission.id}
          className="overflow-hidden rounded-lg border bg-white dark:bg-gray-950 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedArtwork(submission)}
        >
          <div className="aspect-square relative">
            <img
              src={submission.images[0] || "/placeholder.svg"}
              alt={submission.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              {submission.validationStatus ? (
                <ValidationProgressBadge
                  completed={submission.validationStatus.completed}
                  required={submission.validationStatus.required}
                  status={
                    submission.validationStatus.status as
                      | "pending"
                      | "in_progress"
                      | "approved"
                      | "rejected"
                  }
                />
              ) : (
                getStatusBadge(submission.status)
              )}
            </div>
            {submission.validationStatus && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white p-2 rounded flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">
                    {submission.validationStatus.completed}/
                    {submission.validationStatus.required} Validators
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">
                    {submission.validationStatus.approved} Approve
                  </span>
                  <span className="text-xs mx-1">•</span>
                  <span className="text-xs">
                    {submission.validationStatus.rejected} Reject
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium truncate">{submission.title}</h3>
            <p className="text-sm text-gray-500">
              Submitted: {formatDate(submission.dateSubmitted)}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedArtwork(submission);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      ))}

      <Dialog
        open={!!selectedArtwork}
        onOpenChange={(open) => !open && setSelectedArtwork(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedArtwork && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedArtwork.title}</DialogTitle>
                <DialogDescription>
                  Submitted on {formatDate(selectedArtwork.dateSubmitted)}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Artwork Details</TabsTrigger>
                  <TabsTrigger value="validation">
                    <Shield className="h-4 w-4 mr-2" />
                    Validation
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <img
                        src={selectedArtwork.images[0] || "/placeholder.svg"}
                        alt={selectedArtwork.title}
                        className="w-full h-auto rounded-md"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Status</h4>
                        {selectedArtwork.validationStatus ? (
                          <ValidationProgressBadge
                            completed={
                              selectedArtwork.validationStatus.completed
                            }
                            required={selectedArtwork.validationStatus.required}
                            status={
                              selectedArtwork.validationStatus.status as
                                | "pending"
                                | "in_progress"
                                | "approved"
                                | "rejected"
                            }
                          />
                        ) : (
                          getStatusBadge(selectedArtwork.status)
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Medium</h4>
                        <p className="text-sm text-gray-500">
                          {selectedArtwork.medium}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          Description
                        </h4>
                        <p className="text-sm text-gray-500">
                          {selectedArtwork.description}
                        </p>
                      </div>

                      {selectedArtwork.feedback && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">
                            Validator Feedback
                          </h4>
                          <p className="text-sm text-gray-500">
                            {selectedArtwork.feedback}
                          </p>
                        </div>
                      )}

                      {selectedArtwork.status === "verified" && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">
                            Blockchain Information
                          </h4>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Token ID: {selectedArtwork.tokenId}</p>
                            <p>
                              Transaction: {selectedArtwork.transactionHash}
                            </p>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700"
                            >
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

                <TabsContent value="validation">
                  {selectedArtwork.validationStatus && (
                    <ArtworkValidationStatus
                      artworkId={selectedArtwork.id}
                      validationStatus={
                        selectedArtwork.validationStatus
                          ? {
                              ...selectedArtwork.validationStatus,
                              status: selectedArtwork.validationStatus
                                .status as
                                | "approved"
                                | "pending"
                                | "in_progress"
                                | "rejected",
                            }
                          : undefined
                      }
                    />
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
