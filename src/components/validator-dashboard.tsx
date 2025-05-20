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
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  ClipboardList,
  Coins,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArtworkValidationDetail } from "@/components/artwork-validation-detail";
import Link from "next/link";
import { ValidationProgressBadge } from "@/components/validation-progress-badge";

// Mock data for pending validations
const mockPendingValidations = [
  {
    id: "art-101",
    title: "Urban Landscape #3",
    artist: "James Wilson",
    dateSubmitted: "2025-05-12T09:15:00Z",
    status: "pending",
    medium: "Acrylic on canvas",
    images: ["/placeholder.svg?height=400&width=400"],
    description:
      "A contemporary view of city architecture and human interaction.",
    additionalInfo:
      "Created during my residency in New York. This is part of a series exploring urban environments.",
    validationStatus: {
      required: 11,
      completed: 4,
      approved: 3,
      rejected: 1,
      status: "in_progress" as
        | "pending"
        | "in_progress"
        | "approved"
        | "rejected",
      validators: [],
      consensusReached: false,
    },
  },
  {
    id: "art-102",
    title: "Serenity in Blue",
    artist: "Maria Chen",
    dateSubmitted: "2025-05-11T14:22:00Z",
    status: "pending",
    medium: "Oil on canvas",
    images: ["/placeholder.svg?height=400&width=400"],
    description: "An abstract exploration of emotions through shades of blue.",
    additionalInfo: "Inspired by my travels to coastal regions.",
    validationStatus: {
      required: 11,
      completed: 2,
      approved: 2,
      rejected: 0,
      status: "in_progress" as
        | "pending"
        | "in_progress"
        | "approved"
        | "rejected",
      validators: [],
      consensusReached: false,
    },
  },
  {
    id: "art-103",
    title: "Digital Dystopia",
    artist: "Alex Rodriguez",
    dateSubmitted: "2025-05-10T16:45:00Z",
    status: "pending",
    medium: "Digital Art",
    images: ["/placeholder.svg?height=400&width=400"],
    description: "A commentary on technology's impact on society.",
    additionalInfo:
      "Created using a combination of 3D modeling and digital painting techniques.",
    validationStatus: {
      required: 11,
      completed: 7,
      approved: 6,
      rejected: 1,
      status: "in_progress" as
        | "pending"
        | "in_progress"
        | "approved"
        | "rejected",
      validators: [],
      consensusReached: false,
    },
  },
  {
    id: "art-104",
    title: "Forest Whispers",
    artist: "Emma Johnson",
    dateSubmitted: "2025-05-09T11:30:00Z",
    status: "pending",
    medium: "Watercolor",
    images: ["/placeholder.svg?height=400&width=400"],
    description:
      "A serene forest scene capturing the interplay of light through trees.",
    additionalInfo: "Painted on location in the Pacific Northwest.",
    validationStatus: {
      required: 11,
      completed: 9,
      approved: 8,
      rejected: 1,
      status: "in_progress" as
        | "pending"
        | "in_progress"
        | "approved"
        | "rejected",
      validators: [],
      consensusReached: false,
    },
  },
];

// Mock data for validation stats
const mockStats = {
  pending: 4,
  approved: 27,
  rejected: 8,
  total: 39,
};

// Mock rewards data
const mockRewards = {
  balance: 1250.75,
  pendingRewards: 45.25,
  weeklyEarnings: 125.5,
};

export function ValidatorDashboard() {
  const [pendingValidations, setPendingValidations] = useState<
    typeof mockPendingValidations
  >([]);
  const [filteredValidations, setFilteredValidations] = useState<
    typeof mockPendingValidations
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMedium, setFilterMedium] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedArtwork, setSelectedArtwork] = useState<
    (typeof mockPendingValidations)[0] | null
  >(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [stats, setStats] = useState(mockStats);
  const [rewards, setRewards] = useState(mockRewards);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setPendingValidations(mockPendingValidations);
      setFilteredValidations(mockPendingValidations);
      setStats(mockStats);
      setRewards(mockRewards);
    }, 500);
  }, []);

  useEffect(() => {
    let result = [...pendingValidations];

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

    setFilteredValidations(result);
  }, [pendingValidations, searchTerm, filterMedium, sortOrder]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ART`;
  };

  const handleArtworkSelect = (artwork: (typeof mockPendingValidations)[0]) => {
    setSelectedArtwork(artwork);
    setIsDetailOpen(true);
  };

  const handleValidationComplete = (
    artworkId: string,
    isApproved: boolean,
    feedback: string
  ) => {
    // In a real app, this would call an API to update the validation status
    console.log(
      `Artwork ${artworkId} ${
        isApproved ? "approved" : "rejected"
      }: ${feedback}`
    );

    // Update local state to remove the validated artwork
    setPendingValidations((prev) =>
      prev.filter((item) => item.id !== artworkId)
    );

    // Update stats
    setStats((prev) => ({
      ...prev,
      pending: prev.pending - 1,
      approved: isApproved ? prev.approved + 1 : prev.approved,
      rejected: !isApproved ? prev.rejected + 1 : prev.rejected,
    }));

    setIsDetailOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Validations
            </CardTitle>
            <div className="h-4 w-4 text-muted-foreground">{stats.total}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Artwork validations processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <Progress
              className="h-2"
              value={(stats.pending / stats.total) * 100}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <Progress
              className="h-2"
              value={(stats.approved / stats.total) * 100}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <Progress
              className="h-2"
              value={(stats.rejected / stats.total) * 100}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI-Powered Validation</CardTitle>
            <CardDescription>
              Our AI system helps detect potential fraud and verify artwork
              authenticity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-950/30 dark:to-purple-950/30 rounded-lg">
              <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm">
                <Sparkles className="h-8 w-8 text-teal-600" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-medium mb-2">
                  Advanced AI Analysis
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Our AI system analyzes submitted artwork against millions of
                  existing pieces to detect similarities, verify metadata, and
                  identify potential copyright issues.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                    Image Similarity Detection
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Metadata Verification
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Style Analysis
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Validator Rewards</CardTitle>
            <CardDescription>
              Earn tokens for validating artwork authenticity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-gradient-to-r from-yellow-50 to-teal-50 dark:from-yellow-950/30 dark:to-teal-950/30 rounded-lg">
              <div className="flex-shrink-0 bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm">
                <Coins className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-lg font-medium mb-2">
                  Current Balance: {formatCurrency(rewards.balance)}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  You've earned {formatCurrency(rewards.weeklyEarnings)} this
                  week. You have {formatCurrency(rewards.pendingRewards)} in
                  pending rewards.
                </p>
                <Link href="/app/rewards">
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    <Coins className="mr-2 h-4 w-4" />
                    View Rewards Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Verification Queue</CardTitle>
            <CardDescription>
              Review and validate submitted artwork
            </CardDescription>
          </div>
          <Link href="/app/verification">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <ClipboardList className="mr-2 h-4 w-4" />
              View All Artwork
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by title or artist..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="w-40">
                <Select value={filterMedium} onValueChange={setFilterMedium}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Mediums</SelectItem>
                    <SelectItem value="oil">Oil Painting</SelectItem>
                    <SelectItem value="acrylic">Acrylic</SelectItem>
                    <SelectItem value="watercolor">Watercolor</SelectItem>
                    <SelectItem value="digital">Digital Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {filteredValidations.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-gray-500">
                {pendingValidations.length === 0
                  ? "Loading validation queue..."
                  : "No artworks match your filters"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredValidations.map((artwork) => (
                <div
                  key={artwork.id}
                  className="overflow-hidden rounded-lg border bg-white dark:bg-gray-950 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleArtworkSelect(artwork)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={artwork.images[0] || "/placeholder.svg"}
                      alt={artwork.title}
                      className="h-full w-full object-cover"
                    />
                    <ValidationProgressBadge
                      required={artwork.validationStatus.required}
                      completed={artwork.validationStatus.completed}
                      status={
                        artwork.validationStatus.status as
                          | "pending"
                          | "in_progress"
                          | "approved"
                          | "rejected"
                      }
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate">{artwork.title}</h3>
                    <p className="text-sm text-gray-500">by {artwork.artist}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted: {formatDate(artwork.dateSubmitted)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArtworkSelect(artwork);
                        }}
                      >
                        Validate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArtworkSelect(artwork);
                        }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedArtwork && (
        <ArtworkValidationDetail
          artwork={selectedArtwork}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onValidationComplete={handleValidationComplete}
        />
      )}
    </div>
  );
}
