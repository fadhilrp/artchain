"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  ImageIcon,
  FileText,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Mock data for user's artwork
const mockArtworks = [
  {
    id: "art-1",
    title: "Abstract Harmony",
    dateSubmitted: "2025-05-10T14:30:00Z",
    status: "validated",
    thumbnail:
      "https://images.unsplash.com/photo-1737655241189-3e55c3b2dda4?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "art-2",
    title: "Urban Landscape #3",
    dateSubmitted: "2025-05-12T09:15:00Z",
    status: "pending",
    thumbnail:
      "https://plus.unsplash.com/premium_photo-1736464049593-0992460be5a5?q=80&w=2029&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "art-3",
    title: "Digital Dreams",
    dateSubmitted: "2025-05-08T16:45:00Z",
    status: "pending",
    thumbnail:
      "https://images.unsplash.com/photo-1737251043885-1fa62cb12933?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function UserDashboard() {
  const [artworks] = useState(mockArtworks);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Validated
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
        return <Badge>Unknown</Badge>;
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

  // Count artworks by status
  const verifiedCount = artworks.filter(
    (art) => art.status === "verified"
  ).length;
  const pendingCount = artworks.filter(
    (art) => art.status === "pending"
  ).length;
  const rejectedCount = artworks.filter(
    (art) => art.status === "rejected"
  ).length;
  const totalCount = artworks.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Artworks
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Artworks registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedCount}</div>
            <Progress
              className="h-2"
              value={(verifiedCount / totalCount) * 100}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <Progress
              className="h-2"
              value={(pendingCount / totalCount) * 100}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <Progress
              className="h-2"
              value={(rejectedCount / totalCount) * 100}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Artwork</CardTitle>
            <CardDescription>
              Your recently submitted artwork for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="overflow-hidden rounded-lg border bg-white dark:bg-gray-950 shadow-sm"
                >
                  <div className="aspect-square relative">
                    <img
                      src={artwork.thumbnail || "/placeholder.svg"}
                      alt={artwork.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(artwork.status)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium truncate">{artwork.title}</h3>
                    <p className="text-sm text-gray-500">
                      Submitted: {formatDate(artwork.dateSubmitted)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/app/my-art" className="w-full">
              <Button variant="outline" className="w-full">
                View All Artwork
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload New Artwork</CardTitle>
            <CardDescription>
              Register your artwork on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-teal-100 p-3 mb-4">
              <Upload className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Start Registration</h3>
            <p className="text-sm text-center text-gray-500 mb-6 max-w-md">
              Upload your artwork images and details to begin the verification
              process
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/app/upload" className="w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Upload Artwork
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verify Artwork</CardTitle>
            <CardDescription>
              Check authenticity of any registered artwork
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-purple-100 p-3 mb-4">
              <ImageIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Verify Authenticity</h3>
            <p className="text-sm text-center text-gray-500 mb-6 max-w-md">
              Scan a QR code or enter a token ID to verify the authenticity of
              any artwork
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/app/verification" className="w-full">
              <Button variant="outline" className="w-full">
                Verify Artwork
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
