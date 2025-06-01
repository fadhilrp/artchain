"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Filter, Search, Sparkles, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { VerificationProcess } from "@/components/verification-process";
import { api, Artwork, ValidationError } from "@/lib/api";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";

// Helper function to convert IPFS URI to HTTP URL
const ipfsToHttp = (uri: string): string => {
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return uri;
};

export default function VerifyQueuePage() {
  const router = useRouter();
  const { address: validatorAddress } = useAccount();
  const [pendingArtworks, setPendingArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMedium, setFilterMedium] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setIsLoading(true);
      const artworks = await api.getArtworks();
      
      // Transform the data to match our interface
      const transformedArtworks: Artwork[] = artworks.map((artwork) => {
        // Use IPFS images if available, fallback to placeholder
        let images = ["/placeholder.svg?height=400&width=400"];
        
        if (artwork.imageUris && artwork.imageUris.length > 0) {
          images = artwork.imageUris.map(uri => ipfsToHttp(uri));
        }

        return {
          ...artwork,
          id: artwork.imageHash || artwork.id?.toString() || 'unknown',
          title: artwork.title || `Artwork ${artwork.imageHash?.slice(0, 8)}...`,
          artist: artwork.artist || 'Unknown Artist',
          status: artwork.validated ? "validated" : ("pending" as const),
          dateSubmitted: artwork.timestamp || artwork.createdAt || new Date().toISOString(),
          images: images,
          description: artwork.description || `Validation Status: ${
            artwork.validated ? "Validated" : "Pending"
          }\nConsensus: ${artwork.consensusCount}/${artwork.requiredValidators}`,
          additionalInfo: artwork.additionalInfo || `Original: ${artwork.isOriginal ? "Yes" : "No"}`,
          medium: artwork.medium || "Digital Art",
          consensusCount: artwork.consensusCount || 0,
          requiredValidators: artwork.requiredValidators || 2,
          imageHash: artwork.imageHash,
          isOriginal: artwork.isOriginal,
          validated: artwork.validated,
          // IPFS-specific fields
          imageUris: artwork.imageUris || [],
          metadataUri: artwork.metadataUri,
        };
      });
      
      setPendingArtworks(transformedArtworks);
      setFilteredArtworks(transformedArtworks);
    } catch (err) {
      setError("Failed to fetch artworks");
      console.error("Error fetching artworks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = [...pendingArtworks];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply medium filter
    if (filterMedium !== "all") {
      result = result.filter((item) =>
        item.medium.toLowerCase().includes(filterMedium.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.dateSubmitted).getTime();
      const dateB = new Date(b.dateSubmitted).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredArtworks(result);
  }, [pendingArtworks, searchTerm, filterMedium, sortOrder]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSelectAll = () => {
    if (selectedArtworks.length === filteredArtworks.length) {
      setSelectedArtworks([]);
    } else {
      setSelectedArtworks(filteredArtworks.map((item) => item.id));
    }
  };

  const handleSelectArtwork = (id: string) => {
    setSelectedArtworks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerifySelected = () => {
    if (selectedArtworks.length === 0) {
      alert("Please select at least one artwork to verify");
      return;
    }
    // Logic for batch verification
    setIsVerifying(true);
  };

  const handleVerificationComplete = async (
    artworkId: string,
    isApproved: boolean,
    feedback: string
  ) => {
    if (!validatorAddress) {
      toast.error("Please connect your wallet to validate artwork");
      return;
    }

    try {
      const artwork = pendingArtworks.find((art) => art.id === artworkId);
      if (!artwork) {
        throw new Error("Artwork not found");
      }

      const validationData = {
        imageHash: artwork.imageHash,
        isOriginal: isApproved,
        originalAuthor: isApproved ? artwork.artist : "Unknown",
        validatorAddress: validatorAddress,
      };

      console.log("Submitting validation:", validationData);

      const response = await fetch("http://localhost:3001/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Validation failed");
      }

      const result = await response.json();
      console.log("Validation result:", result);

      toast.success(
        `Artwork ${isApproved ? "approved" : "rejected"} successfully!`
      );

      // Refresh the artworks list
      await fetchArtworks();

      // Close the verification modal
      setSelectedArtwork(null);
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof ValidationError) {
        toast.error(`Validation failed: ${error.message}`);
      } else {
        toast.error(
          `Validation failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  const handleCancelVerification = () => {
    setSelectedArtwork(null);
    setIsVerifying(false);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-4 flex items-center text-sm"
            onClick={() => router.push("/app")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Verification Queue</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review and verify submitted artworks
          </p>
        </div>
        {!validatorAddress && (
          <div className="flex flex-col items-end space-y-2">
            <ConnectButton />
            <p className="text-sm text-gray-500">
              Connect wallet to validate artworks
            </p>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title or artist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filterMedium} onValueChange={setFilterMedium}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Mediums</SelectItem>
                <SelectItem value="oil">Oil Painting</SelectItem>
                <SelectItem value="acrylic">Acrylic</SelectItem>
                <SelectItem value="digital">Digital Art</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="sculpture">Sculpture</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={
                  selectedArtworks.length === filteredArtworks.length &&
                  filteredArtworks.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                {selectedArtworks.length} of {filteredArtworks.length} selected
              </span>
            </div>
            {selectedArtworks.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedArtworks([])}
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  onClick={handleVerifySelected}
                  disabled={!validatorAddress}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Verify Selected
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Artworks Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <Card
              key={artwork.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedArtworks.includes(artwork.id)
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => handleSelectArtwork(artwork.id)}
            >
              <div className="relative">
                <img
                  src={artwork.images[0]}
                  alt={artwork.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    // Fallback to placeholder if IPFS image fails to load
                    (e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400";
                  }}
                />
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedArtworks.includes(artwork.id)}
                    onCheckedChange={() => handleSelectArtwork(artwork.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      artwork.status === "validated" ? "default" : "secondary"
                    }
                  >
                    {artwork.status === "validated" ? "Validated" : "Pending"}
                  </Badge>
                </div>
                {/* Show IPFS indicator */}
                {artwork.imageUris && artwork.imageUris.length > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    📡 IPFS
                    {artwork.metadataUri && (
                      <a
                        href={ipfsToHttp(artwork.metadataUri)}
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
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold truncate">{artwork.title}</h3>
                    <p className="text-sm text-gray-600 truncate">
                      by {artwork.artist}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {formatDate(artwork.dateSubmitted)}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {artwork.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {artwork.medium}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtwork(artwork);
                    }}
                    disabled={!validatorAddress}
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Review
                  </Button>
                </div>
                {/* Additional IPFS info */}
                {artwork.imageUris && artwork.imageUris.length > 1 && (
                  <div className="mt-2 text-xs text-gray-500">
                    +{artwork.imageUris.length - 1} more images stored on IPFS
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredArtworks.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              No artworks found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Verification Modal */}
      {selectedArtwork && (
        <VerificationProcess
          artwork={selectedArtwork}
          isOpen={true}
          onClose={handleCancelVerification}
          onComplete={handleVerificationComplete}
          totalSelected={1}
          currentIndex={1}
        />
      )}
    </div>
  );
}
