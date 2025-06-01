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
  ExternalLink,
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

// Helper function to convert IPFS URI to HTTP URL
const ipfsToHttp = (uri: string): string => {
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return uri;
};

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
          data.map((artwork: any) => {
            // Use IPFS images if available, fallback to placeholder
            let images = ["/placeholder.svg?height=400&width=400"];
            
            if (artwork.imageUris && artwork.imageUris.length > 0) {
              images = artwork.imageUris.map((uri: string) => ipfsToHttp(uri));
            }

            return {
              id: artwork.id,
              title: artwork.title || `Artwork ${artwork.imageHash?.slice(0, 8)}...`,
              dateSubmitted: artwork.timestamp || artwork.createdAt,
              status: artwork.validated
                ? (artwork.isOriginal ? "verified" : "rejected")
                : "pending",
              medium: artwork.medium || "Unknown",
              images: images,
              description: artwork.description || "",
              feedback: !artwork.isOriginal ? "Not original artwork detected." : null,
              tokenId: null,
              transactionHash: null,
              // IPFS fields
              imageUris: artwork.imageUris || [],
              metadataUri: artwork.metadataUri,
              imageHash: artwork.imageHash,
              artist: artwork.artist,
              year: artwork.year,
              dimensions: artwork.dimensions,
              additionalInfo: artwork.additionalInfo,
              validationStatus: {
                required: artwork.requiredValidators || 2,
                completed: artwork.consensusCount || 0,
                approved: artwork.isOriginal ? artwork.consensusCount : 0,
                rejected: artwork.isOriginal ? 0 : artwork.consensusCount,
                status: artwork.validated
                  ? (artwork.isOriginal ? "approved" : "rejected")
                  : "in_progress",
                validators: [],
                consensusReached: artwork.validated,
                consensusDate: artwork.timestamp || artwork.createdAt,
              },
            };
          })
        );
      })
      .catch(error => {
        console.error('Error fetching artworks:', error);
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
              onError={(e) => {
                // Fallback to placeholder if IPFS image fails to load
                (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400";
              }}
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
            
            {/* Show IPFS indicator */}
            {submission.imageUris && submission.imageUris.length > 0 && (
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                📡 IPFS
                {submission.metadataUri && (
                  <a
                    href={ipfsToHttp(submission.metadataUri)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="hover:text-blue-300"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

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
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {submission.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatDate(submission.dateSubmitted)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedArtwork(submission);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {submission.medium}
              </Badge>
              {submission.imageUris && submission.imageUris.length > 1 && (
                <span className="text-xs text-gray-500">
                  +{submission.imageUris.length - 1} more
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <Dialog open={!!selectedArtwork} onOpenChange={() => setSelectedArtwork(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedArtwork.title}
                {selectedArtwork.imageUris && selectedArtwork.imageUris.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    📡 IPFS
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Submitted on {formatDate(selectedArtwork.dateSubmitted)}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={selectedArtwork.images[0] || "/placeholder.svg"}
                        alt={selectedArtwork.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400";
                        }}
                      />
                    </div>
                    
                    {/* Additional IPFS Images */}
                    {selectedArtwork.imageUris && selectedArtwork.imageUris.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {selectedArtwork.imageUris.slice(1, 4).map((uri: string, index: number) => (
                          <div key={index} className="aspect-square overflow-hidden rounded border">
                            <img
                              src={ipfsToHttp(uri)}
                              alt={`${selectedArtwork.title} ${index + 2}`}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Artwork Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          {getStatusBadge(selectedArtwork.status)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Medium:</span>
                          <span>{selectedArtwork.medium}</span>
                        </div>
                        {selectedArtwork.artist && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Artist:</span>
                            <span>{selectedArtwork.artist}</span>
                          </div>
                        )}
                        {selectedArtwork.year && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Year:</span>
                            <span>{selectedArtwork.year}</span>
                          </div>
                        )}
                        {selectedArtwork.dimensions && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dimensions:</span>
                            <span>{selectedArtwork.dimensions}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedArtwork.description && (
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-gray-600">
                          {selectedArtwork.description}
                        </p>
                      </div>
                    )}

                    {selectedArtwork.additionalInfo && (
                      <div>
                        <h4 className="font-semibold mb-2">Additional Information</h4>
                        <p className="text-sm text-gray-600">
                          {selectedArtwork.additionalInfo}
                        </p>
                      </div>
                    )}

                    {/* IPFS Links */}
                    {(selectedArtwork.imageUris && selectedArtwork.imageUris.length > 0) || selectedArtwork.metadataUri && (
                      <div>
                        <h4 className="font-semibold mb-2">IPFS Storage</h4>
                        <div className="space-y-2 text-sm">
                          {selectedArtwork.metadataUri && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Metadata:</span>
                              <a
                                href={ipfsToHttp(selectedArtwork.metadataUri)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                View JSON <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                          {selectedArtwork.imageUris && selectedArtwork.imageUris.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Images:</span>
                              <span>{selectedArtwork.imageUris.length} stored on IPFS</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedArtwork.feedback && (
                      <div>
                        <h4 className="font-semibold mb-2">Feedback</h4>
                        <p className="text-sm text-red-600">
                          {selectedArtwork.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="validation">
                {selectedArtwork.validationStatus && (
                  <ArtworkValidationStatus
                    artworkId={selectedArtwork.id}
                    validationStatus={selectedArtwork.validationStatus}
                  />
                )}
              </TabsContent>

              <TabsContent value="blockchain">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Blockchain Information</h4>
                    <div className="space-y-2 text-sm">
                      {selectedArtwork.imageHash && (
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-500">Image Hash:</span>
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono break-all">
                            {selectedArtwork.imageHash}
                          </code>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Validation Status:</span>
                        <span>{selectedArtwork.validationStatus?.consensusReached ? 'Complete' : 'In Progress'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Consensus:</span>
                        <span>{selectedArtwork.validationStatus?.completed || 0}/{selectedArtwork.validationStatus?.required || 2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
