"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SimilarArtwork {
  id: string
  title: string
  artist: string
  image: string
  similarityScore: number
  source: string
}

interface MetadataMatch {
  field: string
  submitted: string
  existing: string
  match: boolean
}

interface AIValidationResultsProps {
  artwork: {
    id: string
    title: string
    artist: string
    images: string[]
    description: string
    medium: string
  }
  isLoading?: boolean
  onRequestAIValidation?: () => void
}

export function AIValidationResults({ artwork, isLoading = false, onRequestAIValidation }: AIValidationResultsProps) {
  const [activeTab, setActiveTab] = useState("similar")

  // Mock data for AI validation results
  const similarArtworks: SimilarArtwork[] = [
    {
      id: "sim-1",
      title: "Urban Landscape #2",
      artist: "James Wilson",
      image: "/placeholder.svg?height=300&width=300",
      similarityScore: 92,
      source: "Internal Database",
    },
    {
      id: "sim-2",
      title: "City View",
      artist: "Unknown",
      image: "/placeholder.svg?height=300&width=300",
      similarityScore: 87,
      source: "Public Registry",
    },
    {
      id: "sim-3",
      title: "Metropolitan Scene",
      artist: "Sarah Johnson",
      image: "/placeholder.svg?height=300&width=300",
      similarityScore: 76,
      source: "External Database",
    },
    {
      id: "sim-4",
      title: "Urban Perspective",
      artist: "David Chen",
      image: "/placeholder.svg?height=300&width=300",
      similarityScore: 68,
      source: "Public Registry",
    },
  ]

  const metadataMatches: MetadataMatch[] = [
    {
      field: "Title",
      submitted: artwork.title,
      existing: "Urban Landscape #2",
      match: false,
    },
    {
      field: "Artist",
      submitted: artwork.artist,
      existing: "James Wilson",
      match: true,
    },
    {
      field: "Medium",
      submitted: artwork.medium,
      existing: "Acrylic on canvas",
      match: true,
    },
    {
      field: "Style",
      submitted: "Contemporary",
      existing: "Contemporary",
      match: true,
    },
    {
      field: "Creation Date",
      submitted: "2025",
      existing: "2024",
      match: false,
    },
  ]

  // Calculate overall confidence score based on similarity and metadata matches
  const similarityConfidence = similarArtworks.length > 0 ? similarArtworks[0].similarityScore : 0
  const metadataConfidence = (metadataMatches.filter((item) => item.match).length / metadataMatches.length) * 100
  const overallConfidence = (similarityConfidence + metadataConfidence) / 2

  const getConfidenceBadge = (score: number) => {
    if (score >= 90) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          <XCircle className="h-3 w-3 mr-1" /> High Risk
        </Badge>
      )
    } else if (score >= 75) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <AlertTriangle className="h-3 w-3 mr-1" /> Medium Risk
        </Badge>
      )
    } else if (score >= 50) {
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          <Info className="h-3 w-3 mr-1" /> Low Risk
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="h-3 w-3 mr-1" /> Very Low Risk
        </Badge>
      )
    }
  }

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">AI is analyzing the artwork...</p>
        <p className="text-xs text-gray-400 mt-2">This may take a few moments</p>
      </div>
    )
  }

  if (!similarArtworks.length && onRequestAIValidation) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <p className="text-sm text-gray-500 mb-4">No AI validation has been performed yet.</p>
        <Button onClick={onRequestAIValidation} className="bg-teal-600 hover:bg-teal-700">
          Run AI Validation
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{Math.round(similarityConfidence)}%</div>
              <p className="text-sm text-gray-500">Image Similarity</p>
              <Progress className="h-2 mt-2" value={similarityConfidence} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{Math.round(metadataConfidence)}%</div>
              <p className="text-sm text-gray-500">Metadata Match</p>
              <Progress className="h-2 mt-2" value={metadataConfidence} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{Math.round(overallConfidence)}%</div>
              <p className="text-sm text-gray-500">Overall Confidence</p>
              <div className="mt-2">{getConfidenceBadge(overallConfidence)}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="similar">Similar Artworks</TabsTrigger>
          <TabsTrigger value="metadata">Metadata Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="similar" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {similarArtworks.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-1">
                    <span className="text-sm font-medium">{item.similarityScore}% Match</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 truncate">by {item.artist}</p>
                  <div className="flex items-center justify-between mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="text-xs">
                            {item.source}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Source of the similar artwork</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="metadata" className="pt-4">
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="text-left py-2 px-4 text-sm font-medium">Field</th>
                  <th className="text-left py-2 px-4 text-sm font-medium">Submitted Value</th>
                  <th className="text-left py-2 px-4 text-sm font-medium">Existing Value</th>
                  <th className="text-left py-2 px-4 text-sm font-medium">Match</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {metadataMatches.map((item, index) => (
                  <tr key={index} className={item.match ? "" : "bg-red-50 dark:bg-red-950/20"}>
                    <td className="py-2 px-4 text-sm">{item.field}</td>
                    <td className="py-2 px-4 text-sm">{item.submitted}</td>
                    <td className="py-2 px-4 text-sm">{item.existing}</td>
                    <td className="py-2 px-4 text-sm">
                      {item.match ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">AI Analysis Summary</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              The submitted artwork shows high similarity to existing works by the same artist. While this could
              indicate a series or style consistency, please verify the uniqueness of this specific piece. The metadata
              analysis shows discrepancies in the title and creation date.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
