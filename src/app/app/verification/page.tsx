"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Filter, Search, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { VerificationProcess } from "@/components/verification-process"
import { api, Artwork, ValidationError } from "@/lib/api"
import { useAccount } from "wagmi"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { toast } from "sonner"

// Mock data for pending verifications
const mockPendingArtworks = [
  {
    id: "art-101",
    title: "Urban Landscape #3",
    artist: "James Wilson",
    dateSubmitted: "2025-05-12T09:15:00Z",
    status: "pending",
    medium: "Acrylic on canvas",
    images: ["/placeholder.svg?height=400&width=400"],
    description: "A contemporary view of city architecture and human interaction.",
    additionalInfo: "Created during my residency in New York. This is part of a series exploring urban environments.",
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
    additionalInfo: "Created using a combination of 3D modeling and digital painting techniques.",
  },
  {
    id: "art-104",
    title: "Forest Whispers",
    artist: "Emma Johnson",
    dateSubmitted: "2025-05-09T11:30:00Z",
    status: "pending",
    medium: "Watercolor",
    images: ["/placeholder.svg?height=400&width=400"],
    description: "A serene forest scene capturing the interplay of light through trees.",
    additionalInfo: "Painted on location in the Pacific Northwest.",
  },
  {
    id: "art-105",
    title: "Geometric Harmony",
    artist: "David Lee",
    dateSubmitted: "2025-05-08T10:15:00Z",
    status: "pending",
    medium: "Digital Art",
    images: ["/placeholder.svg?height=400&width=400"],
    description: "An exploration of geometric shapes and patterns in harmony.",
    additionalInfo: "Created using custom algorithms and digital painting techniques.",
  },
  {
    id: "art-106",
    title: "Autumn Reflections",
    artist: "Sarah Miller",
    dateSubmitted: "2025-05-07T16:30:00Z",
    status: "pending",
    medium: "Oil on canvas",
    images: ["/placeholder.svg?height=400&width=400"],
    description: "A landscape capturing the vibrant colors of autumn reflected in a still lake.",
    additionalInfo: "Painted en plein air during a trip to Vermont.",
  },
]

export default function VerifyQueuePage() {
  const router = useRouter()
  const { address: validatorAddress } = useAccount()
  const [pendingArtworks, setPendingArtworks] = useState<Artwork[]>([])
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([])
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMedium, setFilterMedium] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [isVerifying, setIsVerifying] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArtworks()
  }, [])

  const fetchArtworks = async () => {
    try {
      setIsLoading(true)
      const artworks = await api.getArtworks()
      // Transform the data to match our interface
      const transformedArtworks: Artwork[] = artworks.map(artwork => ({
        ...artwork,
        id: artwork.imageHash, // Use imageHash as id if not provided
        status: artwork.validated ? 'validated' : 'pending' as const,
        dateSubmitted: artwork.timestamp || new Date().toISOString(),
        images: artwork.images || ['/placeholder.svg?height=400&width=400'],
        description: artwork.description || '',
        additionalInfo: artwork.additionalInfo || '',
        medium: artwork.medium || 'Unknown',
      }))
      setPendingArtworks(transformedArtworks)
      setFilteredArtworks(transformedArtworks)
    } catch (err) {
      setError('Failed to fetch artworks')
      console.error('Error fetching artworks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let result = [...pendingArtworks]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.artist.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply medium filter
    if (filterMedium !== "all") {
      result = result.filter((item) => item.medium.toLowerCase().includes(filterMedium.toLowerCase()))
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.dateSubmitted).getTime()
      const dateB = new Date(b.dateSubmitted).getTime()

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredArtworks(result)
  }, [pendingArtworks, searchTerm, filterMedium, sortOrder])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleSelectAll = () => {
    if (selectedArtworks.length === filteredArtworks.length) {
      setSelectedArtworks([])
    } else {
      setSelectedArtworks(filteredArtworks.map((artwork) => artwork.id))
    }
  }

  const handleSelectArtwork = (id: string) => {
    if (selectedArtworks.includes(id)) {
      setSelectedArtworks(selectedArtworks.filter((artworkId) => artworkId !== id))
    } else {
      setSelectedArtworks([...selectedArtworks, id])
    }
  }

  const handleVerifySelected = () => {
    if (selectedArtworks.length === 0) {
      alert("Please select at least one artwork to verify")
      return
    }

    // Find the first selected artwork to start verification
    const firstSelected = pendingArtworks.find((artwork) => artwork.id === selectedArtworks[0])
    if (firstSelected) {
      setSelectedArtwork(firstSelected)
      setIsVerifying(true)
    }
  }

  const handleVerificationComplete = async (artworkId: string, isApproved: boolean, feedback: string) => {
    if (!validatorAddress) {
      toast.error('Please connect your wallet to validate artwork')
      return
    }

    try {
      const artwork = pendingArtworks.find(a => a.id === artworkId)
      if (!artwork) return

      await api.validateArtwork(
        artwork.imageHash,
        isApproved,
        isApproved ? artwork.artist : feedback,
        validatorAddress
      )

      // Remove the verified artwork from selected and pending lists
      setSelectedArtworks(selectedArtworks.filter((id) => id !== artworkId))
      setPendingArtworks(pendingArtworks.filter((artwork) => artwork.id !== artworkId))

      // If there are more selected artworks, continue to the next one
      const remainingSelected = selectedArtworks.filter((id) => id !== artworkId)
      if (remainingSelected.length > 0) {
        const nextArtwork = pendingArtworks.find((artwork) => artwork.id === remainingSelected[0])
        if (nextArtwork) {
          setSelectedArtwork(nextArtwork)
        } else {
          setIsVerifying(false)
          setSelectedArtwork(null)
        }
      } else {
        setIsVerifying(false)
        setSelectedArtwork(null)
      }

      // Refresh the artwork list
      await fetchArtworks()
      toast.success('Artwork validated successfully')
    } catch (err) {
      console.error('Error validating artwork:', err)
      if (err instanceof ValidationError) {
        if (err.code === 'ALREADY_VOTED') {
          toast.error('You have already validated this artwork')
        } else {
          toast.error(err.message)
        }
      } else {
        toast.error('Failed to validate artwork. Please try again.')
      }
    }
  }

  const handleCancelVerification = () => {
    setIsVerifying(false)
    setSelectedArtwork(null)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2 flex items-center text-sm" onClick={() => router.push("/app")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Artwork Verification</h1>
        </div>
        <div className="flex gap-2">
          <ConnectButton />
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={handleVerifySelected}
            disabled={selectedArtworks.length === 0 || !validatorAddress}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Verify Selected ({selectedArtworks.length})
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Artwork</CardTitle>
          <CardDescription>Verify artwork authenticity using AI-powered analysis</CardDescription>
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
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-gray-500">Loading verification queue...</p>
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-gray-500">
                {pendingArtworks.length === 0 ? "No artworks available for verification" : "No artworks match your filters"}
              </p>
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <div className="flex items-center">
                          <Checkbox
                            checked={filteredArtworks.length > 0 && selectedArtworks.length === filteredArtworks.length}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                          />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Artwork</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Artist</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Medium</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Submitted</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredArtworks.map((artwork) => (
                      <tr key={artwork.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedArtworks.includes(artwork.id)}
                            onCheckedChange={() => handleSelectArtwork(artwork.id)}
                            aria-label={`Select ${artwork.title}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={artwork.images[0] || "/placeholder.svg"}
                                alt={artwork.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="truncate max-w-[200px]">
                              <p className="text-sm font-medium truncate">{artwork.title}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {artwork.description.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{artwork.artist}</td>
                        <td className="px-4 py-3 text-sm">{artwork.medium}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(artwork.dateSubmitted)}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700"
                            onClick={() => {
                              setSelectedArtwork(artwork)
                              setIsVerifying(true)
                            }}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  {selectedArtworks.length} of {filteredArtworks.length} selected
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedArtworks([])}>
                    Clear Selection
                  </Button>
                  <Button
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleVerifySelected}
                    disabled={selectedArtworks.length === 0}
                  >
                    <Sparkles className="mr-2 h-3 w-3" />
                    Verify Selected
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isVerifying && selectedArtwork && (
        <VerificationProcess
          artwork={selectedArtwork}
          isOpen={isVerifying}
          onClose={handleCancelVerification}
          onComplete={handleVerificationComplete}
          totalSelected={selectedArtworks.length}
          currentIndex={selectedArtworks.indexOf(selectedArtwork.id) + 1}
        />
      )}
    </div>
  )
}
