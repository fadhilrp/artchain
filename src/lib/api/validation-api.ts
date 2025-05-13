/**
 * Mock API for the artwork validation process
 */

import type { ValidationStatus, Validator } from "@/lib/types/validation"

// Types for the validation process
export interface ArtworkToValidate {
  id: string
  title: string
  artist: string
  dateSubmitted: string
  status: "pending" | "in_progress" | "validated" | "rejected"
  medium: string
  images: string[]
  description: string
  additionalInfo?: string
  metadata?: Record<string, any>
  validationStatus?: ValidationStatus
}

export interface ValidationDecision {
  artworkId: string
  decision: "approve" | "reject"
  feedback: string
  validatorId: string
  aiAssisted?: boolean
}

export interface ValidationResponse {
  success: boolean
  message: string
  artworkId: string
  status: "pending" | "validated" | "rejected"
  transactionHash?: string
  validationDate?: string
  rewardAmount?: number
  rewardTransactionId?: string
  validationStatus?: ValidationStatus
}

export interface AIValidationResult {
  similarityScore: number
  metadataMatchScore: number
  overallConfidence: number
  riskLevel: "high" | "medium" | "low" | "very_low"
  similarArtworks: {
    id: string
    title: string
    artist: string
    image: string
    similarityScore: number
    source: string
  }[]
  metadataMatches: {
    field: string
    submitted: string
    existing: string
    match: boolean
  }[]
  summary: string
}

export interface ValidationQueueParams {
  status?: "pending" | "in_progress" | "validated" | "rejected"
  medium?: string
  sortBy?: "date" | "title" | "artist"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface ValidationQueueResponse {
  artworks: ArtworkToValidate[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Mock validators
const mockValidators: Validator[] = [
  {
    id: "val-1",
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 95,
  },
  {
    id: "val-2",
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 92,
  },
  {
    id: "val-3",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 88,
  },
  {
    id: "val-4",
    name: "Sarah Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 91,
  },
  {
    id: "val-5",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 87,
  },
  {
    id: "val-6",
    name: "Jessica Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 94,
  },
  {
    id: "val-7",
    name: "Robert Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 89,
  },
  {
    id: "val-8",
    name: "Amanda Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 93,
  },
  {
    id: "val-9",
    name: "Thomas Anderson",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 90,
  },
  {
    id: "val-10",
    name: "Lisa Wang",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 91,
  },
  {
    id: "val-11",
    name: "Kevin Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 88,
  },
  {
    id: "val-12",
    name: "Maria Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 93,
  },
  {
    id: "val-13",
    name: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 89,
  },
  {
    id: "val-14",
    name: "Sophia Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 94,
  },
  {
    id: "val-15",
    name: "Daniel Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 92,
  },
]

// Mock implementation of the validation API
export const validationApi = {
  /**
   * Get the validation queue
   * @param params Query parameters for filtering and pagination
   * @returns Promise with the validation queue response
   */
  getValidationQueue: async (params: ValidationQueueParams = {}): Promise<ValidationQueueResponse> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Default values
        const status = params.status || "pending"
        const page = params.page || 1
        const limit = params.limit || 10

        // Generate mock artworks
        const mockArtworks: ArtworkToValidate[] = Array(limit)
          .fill(0)
          .map((_, index) => {
            const id = `art-${100 + index}`
            const dateSubmitted = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()

            // Random medium selection
            const mediums = [
              "Oil on canvas",
              "Acrylic on canvas",
              "Watercolor",
              "Digital Art",
              "Mixed Media",
              "Sculpture",
            ]
            const medium = params.medium || mediums[Math.floor(Math.random() * mediums.length)]

            // Random artist names
            const artists = [
              "James Wilson",
              "Maria Chen",
              "Alex Rodriguez",
              "Emma Johnson",
              "David Lee",
              "Sarah Miller",
            ]
            const artist = artists[Math.floor(Math.random() * artists.length)]

            // Generate random validation status
            const validationStatus: ValidationStatus = {
              required: 11,
              completed: Math.floor(Math.random() * 11) + 1, // 1-11 validators
              approved: 0,
              rejected: 0,
              status: "in_progress",
              validators: [],
              consensusReached: false,
            }

            // Generate random validators
            const shuffledValidators = [...mockValidators].sort(() => 0.5 - Math.random())
            validationStatus.validators = shuffledValidators.slice(0, validationStatus.completed).map((validator) => {
              const decision = Math.random() > 0.2 ? "approve" : "reject"
              if (decision === "approve") validationStatus.approved++
              else validationStatus.rejected++

              return {
                ...validator,
                decision,
                feedback:
                  decision === "approve"
                    ? "Artwork meets authenticity criteria."
                    : "Found issues with artwork authenticity.",
                timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
              }
            })

            // Determine status based on validation progress
            if (validationStatus.completed === 11) {
              validationStatus.consensusReached = true
              validationStatus.status = validationStatus.approved > validationStatus.rejected ? "approved" : "rejected"
              validationStatus.consensusDate = new Date().toISOString()
            }

            return {
              id,
              title: `Artwork Title ${id}`,
              artist,
              dateSubmitted,
              status: status as ArtworkToValidate["status"],
              medium,
              images: ["/placeholder.svg?height=400&width=400"],
              description: `This is a ${medium} artwork created by ${artist}. It explores themes of nature and technology.`,
              additionalInfo:
                Math.random() > 0.5 ? "Additional information about the artwork creation process." : undefined,
              validationStatus,
            }
          })

        // Apply sorting if specified
        if (params.sortBy) {
          mockArtworks.sort((a, b) => {
            let comparison = 0

            switch (params.sortBy) {
              case "date":
                comparison = new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime()
                break
              case "title":
                comparison = a.title.localeCompare(b.title)
                break
              case "artist":
                comparison = a.artist.localeCompare(b.artist)
                break
            }

            return params.sortOrder === "desc" ? -comparison : comparison
          })
        }

        resolve({
          artworks: mockArtworks,
          total: 35, // Mock total count
          page,
          limit,
          totalPages: Math.ceil(35 / limit),
        })
      }, 800)
    })
  },

  /**
   * Get details of a specific artwork for validation
   * @param artworkId The ID of the artwork
   * @returns Promise with the artwork details
   */
  getArtworkForValidation: async (artworkId: string): Promise<ArtworkToValidate> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Random medium selection
        const mediums = ["Oil on canvas", "Acrylic on canvas", "Watercolor", "Digital Art", "Mixed Media", "Sculpture"]
        const medium = mediums[Math.floor(Math.random() * mediums.length)]

        // Random artist names
        const artists = ["James Wilson", "Maria Chen", "Alex Rodriguez", "Emma Johnson", "David Lee", "Sarah Miller"]
        const artist = artists[Math.floor(Math.random() * artists.length)]

        // Generate random validation status
        const validationStatus: ValidationStatus = {
          required: 11,
          completed: Math.floor(Math.random() * 11) + 1, // 1-11 validators
          approved: 0,
          rejected: 0,
          status: "in_progress",
          validators: [],
          consensusReached: false,
        }

        // Generate random validators
        const shuffledValidators = [...mockValidators].sort(() => 0.5 - Math.random())
        validationStatus.validators = shuffledValidators.slice(0, validationStatus.completed).map((validator) => {
          const decision = Math.random() > 0.2 ? "approve" : "reject"
          if (decision === "approve") validationStatus.approved++
          else validationStatus.rejected++

          return {
            ...validator,
            decision,
            feedback:
              decision === "approve"
                ? "Artwork meets authenticity criteria."
                : "Found issues with artwork authenticity.",
            timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
          }
        })

        // Determine status based on validation progress
        if (validationStatus.completed === 11) {
          validationStatus.consensusReached = true
          validationStatus.status = validationStatus.approved > validationStatus.rejected ? "approved" : "rejected"
          validationStatus.consensusDate = new Date().toISOString()
        }

        resolve({
          id: artworkId,
          title: `Artwork Title ${artworkId}`,
          artist,
          dateSubmitted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          medium,
          images: Array(Math.floor(Math.random() * 3) + 1).fill("/placeholder.svg?height=400&width=400"),
          description: `This is a ${medium} artwork created by ${artist}. It explores themes of nature and technology.`,
          additionalInfo:
            Math.random() > 0.5 ? "Additional information about the artwork creation process." : undefined,
          metadata: {
            dimensions: "24 x 36 inches",
            year: "2025",
            location: "New York, USA",
            tags: ["contemporary", "abstract", "landscape"],
          },
          validationStatus,
        })
      }, 500)
    })
  },

  /**
   * Submit a validation decision for an artwork
   * @param decision The validation decision
   * @returns Promise with the validation response
   */
  submitValidationDecision: async (decision: ValidationDecision): Promise<ValidationResponse> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const isApproved = decision.decision === "approve"
        const rewardAmount = isApproved ? 10 + Math.random() * 10 : 0

        // Generate random validation status
        const validationStatus: ValidationStatus = {
          required: 11,
          completed: Math.floor(Math.random() * 10) + 2, // 2-11 validators (including this one)
          approved: 0,
          rejected: 0,
          status: "in_progress",
          validators: [],
          consensusReached: false,
        }

        // Generate random validators
        const shuffledValidators = [...mockValidators].sort(() => 0.5 - Math.random())
        validationStatus.validators = shuffledValidators
          .slice(0, validationStatus.completed - 1) // -1 because we'll add the current validator
          .map((validator) => {
            const validatorDecision = Math.random() > 0.2 ? "approve" : "reject"
            if (validatorDecision === "approve") validationStatus.approved++
            else validationStatus.rejected++

            return {
              ...validator,
              decision: validatorDecision,
              feedback:
                validatorDecision === "approve"
                  ? "Artwork meets authenticity criteria."
                  : "Found issues with artwork authenticity.",
              timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
            }
          })

        // Add the current validator
        const currentValidator = mockValidators.find((v) => v.id === decision.validatorId) || {
          id: decision.validatorId,
          name: "Current Validator",
          avatar: "/placeholder.svg?height=40&width=40",
          reputation: 90,
        }

        validationStatus.validators.push({
          ...currentValidator,
          decision: decision.decision,
          feedback: decision.feedback,
          timestamp: new Date().toISOString(),
        })

        // Update counts
        if (decision.decision === "approve") validationStatus.approved++
        else validationStatus.rejected++

        // Determine status based on validation progress
        if (validationStatus.completed === 11) {
          validationStatus.consensusReached = true
          validationStatus.status = validationStatus.approved > validationStatus.rejected ? "approved" : "rejected"
          validationStatus.consensusDate = new Date().toISOString()
        }

        resolve({
          success: true,
          message: isApproved ? "Artwork has been successfully validated" : "Artwork has been rejected",
          artworkId: decision.artworkId,
          status: isApproved ? "validated" : "rejected",
          transactionHash: isApproved
            ? `0x${Array(40)
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join("")}`
            : undefined,
          validationDate: new Date().toISOString(),
          rewardAmount: isApproved ? rewardAmount : 0,
          rewardTransactionId: isApproved ? `tx-${Date.now().toString(36)}` : undefined,
          validationStatus,
        })
      }, 1200)
    })
  },

  /**
   * Request AI validation for an artwork
   * @param artworkId The ID of the artwork
   * @returns Promise with the AI validation results
   */
  requestAIValidation: async (artworkId: string): Promise<AIValidationResult> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random scores
        const similarityScore = Math.random() * 100
        const metadataMatchScore = Math.random() * 100
        const overallConfidence = (similarityScore + metadataMatchScore) / 2

        // Determine risk level based on overall confidence
        let riskLevel: AIValidationResult["riskLevel"] = "very_low"
        if (overallConfidence > 90) {
          riskLevel = "high"
        } else if (overallConfidence > 75) {
          riskLevel = "medium"
        } else if (overallConfidence > 50) {
          riskLevel = "low"
        }

        // Generate similar artworks
        const similarArtworks = Array(4)
          .fill(0)
          .map((_, index) => {
            const score = similarityScore - index * 10
            return {
              id: `sim-${index + 1}`,
              title: `Similar Artwork ${index + 1}`,
              artist: ["James Wilson", "Unknown", "Sarah Johnson", "David Chen"][index],
              image: "/placeholder.svg?height=300&width=300",
              similarityScore: Math.max(0, score),
              source: ["Internal Database", "Public Registry", "External Database", "Public Registry"][index],
            }
          })

        // Generate metadata matches
        const metadataMatches = [
          {
            field: "Title",
            submitted: `Artwork Title ${artworkId}`,
            existing: "Similar Artwork 1",
            match: false,
          },
          {
            field: "Artist",
            submitted: "James Wilson",
            existing: "James Wilson",
            match: true,
          },
          {
            field: "Medium",
            submitted: "Acrylic on canvas",
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

        resolve({
          similarityScore,
          metadataMatchScore,
          overallConfidence,
          riskLevel,
          similarArtworks,
          metadataMatches,
          summary: `The submitted artwork shows ${riskLevel === "high" ? "very high" : riskLevel === "medium" ? "moderate" : "low"} similarity to existing works. ${
            riskLevel === "high"
              ? "This suggests potential duplication or derivative work."
              : riskLevel === "medium"
                ? "While there are similarities, they may be due to style consistency."
                : "The artwork appears to be original with minimal similarities to existing works."
          }`,
        })
      }, 2000)
    })
  },

  /**
   * Get validation statistics for a validator
   * @param validatorId The ID of the validator
   * @returns Promise with the validation statistics
   */
  getValidatorStats: async (
    validatorId: string,
  ): Promise<{
    total: number
    pending: number
    validated: number
    rejected: number
    averageTimePerValidation: number // in minutes
  }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total: 39,
          pending: 4,
          validated: 27,
          rejected: 8,
          averageTimePerValidation: 12.5, // minutes
        })
      }, 300)
    })
  },

  /**
   * Get validation status for an artwork
   * @param artworkId The ID of the artwork
   * @returns Promise with the validation status
   */
  getValidationStatus: async (artworkId: string): Promise<ValidationStatus> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate random validation status
        const validationStatus: ValidationStatus = {
          required: 11,
          completed: Math.floor(Math.random() * 11) + 1, // 1-11 validators
          approved: 0,
          rejected: 0,
          status: "in_progress",
          validators: [],
          consensusReached: false,
        }

        // Generate random validators
        const shuffledValidators = [...mockValidators].sort(() => 0.5 - Math.random())
        validationStatus.validators = shuffledValidators.slice(0, validationStatus.completed).map((validator) => {
          const decision = Math.random() > 0.2 ? "approve" : "reject"
          if (decision === "approve") validationStatus.approved++
          else validationStatus.rejected++

          return {
            ...validator,
            decision,
            feedback:
              decision === "approve"
                ? "Artwork meets authenticity criteria."
                : "Found issues with artwork authenticity.",
            timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
          }
        })

        // Determine status based on validation progress
        if (validationStatus.completed === 11) {
          validationStatus.consensusReached = true
          validationStatus.status = validationStatus.approved > validationStatus.rejected ? "approved" : "rejected"
          validationStatus.consensusDate = new Date().toISOString()
        }

        resolve(validationStatus)
      }, 500)
    })
  },
}
