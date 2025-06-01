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
import { ArrowLeft, Clock, Filter, Search, Sparkles, ExternalLink, Shield } from "lucide-react";
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
      
      // Use the blockchain endpoint that retrieves from smart contract
      const response = await fetch('http://localhost:3001/api/artworks');
      if (!response.ok) {
        throw new Error('Failed to fetch artworks from blockchain');
      }
      
      const blockchainResponse = await response.json();
      console.log('Fetched response from blockchain:', blockchainResponse);
      
      // Handle different response formats (IPFS-enabled vs legacy)
      const blockchainArtworks = blockchainResponse.artworks || blockchainResponse;
      const isIPFSEnabled = blockchainResponse.source === 'ipfs-blockchain';
      
      console.log(`Using ${isIPFSEnabled ? 'IPFS-enabled' : 'legacy'} blockchain integration`);
      console.log('Raw blockchain artworks:', blockchainArtworks);
      
      // Also get database artworks for additional metadata if not using IPFS contract
      let dbArtworks: Artwork[] = [];
      if (!isIPFSEnabled) {
        dbArtworks = await api.getArtworks();
      }
      
      // Transform and merge blockchain data with database metadata
      const transformedArtworks: Artwork[] = blockchainArtworks.map((blockchainArt: any) => {
        // Find matching database entry by imageHash (only needed for legacy)
        const dbArt = dbArtworks.find(db => db.imageHash === blockchainArt.imageHash);
        
        // Use IPFS images - priority: blockchain IPFS URIs > database IPFS URIs > placeholder
        let images = ["/placeholder.svg?height=400&width=400"];
        
        if (blockchainArt.ipfsImageUris && blockchainArt.ipfsImageUris.length > 0) {
          // IPFS-enabled contract has the URIs directly
          images = blockchainArt.ipfsImageUris.map((uri: string) => ipfsToHttp(uri));
        } else if (dbArt?.imageUris && dbArt.imageUris.length > 0) {
          // Legacy: get from database
          images = dbArt.imageUris.map((uri: string) => ipfsToHttp(uri));
        }

        return {
          // Use blockchain as source of truth for validation status
          id: blockchainArt.imageHash,
          imageHash: blockchainArt.imageHash,
          artist: blockchainArt.artist || dbArt?.artist || 'Unknown Artist',
          title: blockchainArt.title || dbArt?.title || `Artwork ${blockchainArt.imageHash.slice(0, 8)}...`,
          status: blockchainArt.validated ? "validated" : ("pending" as const),
          dateSubmitted: blockchainArt.timestamp || dbArt?.timestamp || new Date().toISOString(),
          images: images,
          description: blockchainArt.description || dbArt?.description || `Blockchain Status: ${
            blockchainArt.validated ? "Validated" : "Pending Validation"
          }\nConsensus: ${blockchainArt.consensusCount}/${blockchainArt.requiredValidators}\nOriginal: ${blockchainArt.isOriginal ? "Yes" : "No"}`,
          additionalInfo: blockchainArt.additionalInfo || dbArt?.additionalInfo || `Original Author: ${blockchainArt.originalAuthor || 'Unknown'}`,
          medium: blockchainArt.medium || dbArt?.medium || "Digital Art",
          
          // Blockchain validation data (source of truth)
          consensusCount: Number(blockchainArt.consensusCount) || 0,
          requiredValidators: Number(blockchainArt.requiredValidators) || 2,
          isOriginal: blockchainArt.isOriginal || false,
          validated: blockchainArt.validated || false,
          originalAuthor: blockchainArt.originalAuthor || 'Unknown',
          
          // IPFS-specific fields from blockchain (preferred) or database fallback
          imageUris: blockchainArt.ipfsImageUris || dbArt?.imageUris || [],
          metadataUri: blockchainArt.ipfsMetadataUri || dbArt?.metadataUri,
          
          // Additional metadata
          year: blockchainArt.year || dbArt?.year,
          dimensions: blockchainArt.dimensions || dbArt?.dimensions,
          createdAt: dbArt?.createdAt,
          timestamp: blockchainArt.timestamp
        };
      });
      
      // Filter to show only pending validation artworks
      const pendingArtworks = transformedArtworks.filter(art => !art.validated);
      
      console.log(`Found ${pendingArtworks.length} artworks pending validation from ${isIPFSEnabled ? 'IPFS-enabled' : 'legacy'} blockchain`);
      
      setPendingArtworks(pendingArtworks);
      setFilteredArtworks(pendingArtworks);
    } catch (err) {
      setError("Failed to fetch artworks from blockchain");
      console.error("Error fetching artworks from blockchain:", err);
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
            Review and verify artworks retrieved from blockchain smart contract
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Connected to Blockchain
            </div>
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

      {/* Information about decentralized process */}
      {!isLoading && (
        <Card className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Decentralized Validation Process
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  Artworks are retrieved directly from the blockchain smart contract using <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">getTotalArtworks()</code> and <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">getArtworkHash()</code> functions.
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  During validation, you'll connect to your local VLM (Vision Language Model) to ensure complete privacy and decentralized processing.
                </p>
              </div>
            </div>
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
