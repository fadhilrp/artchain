/**
 * Mock API for the artwork upload process
 */

// Types for the upload process
export interface UploadArtworkRequest {
  title: string
  description: string
  medium: string
  year: string
  dimensions?: string
  additionalInfo?: string
  images: File[]
}

export interface UploadProgressEvent {
  progress: number // 0-100
  currentFile?: string
  step: "uploading" | "processing" | "registering" | "complete"
  message?: string
}

export interface UploadArtworkResponse {
  success: boolean
  artworkId: string
  message: string
  status: "pending" | "processing" | "complete" | "failed"
  transactionHash?: string
  registrationDate?: string
  previewUrl?: string
}

export interface UploadStatusResponse {
  artworkId: string
  status: "pending" | "processing" | "complete" | "failed"
  progress: number // 0-100
  step: "uploading" | "processing" | "registering" | "complete"
  message?: string
  transactionHash?: string
  registrationDate?: string
  previewUrl?: string
}

// Mock implementation of the upload API
export const uploadApi = {
  /**
   * Upload artwork to the platform
   * @param artwork The artwork data to upload
   * @param onProgress Optional callback for upload progress
   * @returns Promise with the upload response
   */
  uploadArtwork: async (
    artwork: UploadArtworkRequest,
    onProgress?: (event: UploadProgressEvent) => void,
  ): Promise<UploadArtworkResponse> => {
    // Simulate upload process with progress updates
    return new Promise((resolve) => {
      // Simulate file upload progress (0-50%)
      let progress = 0
      const uploadInterval = setInterval(() => {
        progress += 5
        if (onProgress && progress <= 50) {
          onProgress({
            progress,
            currentFile: artwork.images[0]?.name || "artwork.jpg",
            step: "uploading",
            message: `Uploading image ${Math.min(progress * 2, 100)}%`,
          })
        }

        if (progress >= 50) {
          clearInterval(uploadInterval)

          // Simulate processing (50-75%)
          if (onProgress) {
            onProgress({
              progress: 50,
              step: "processing",
              message: "Processing artwork metadata...",
            })
          }

          setTimeout(() => {
            if (onProgress) {
              onProgress({
                progress: 75,
                step: "processing",
                message: "Generating preview and thumbnails...",
              })
            }

            // Simulate blockchain registration (75-100%)
            setTimeout(() => {
              if (onProgress) {
                onProgress({
                  progress: 85,
                  step: "registering",
                  message: "Registering on blockchain...",
                })
              }

              setTimeout(() => {
                if (onProgress) {
                  onProgress({
                    progress: 100,
                    step: "complete",
                    message: "Upload complete!",
                  })
                }

                // Return successful response
                resolve({
                  success: true,
                  artworkId: `art-${Date.now().toString(36)}`,
                  message: "Artwork successfully uploaded and registered",
                  status: "complete",
                  transactionHash: `0x${Array(40)
                    .fill(0)
                    .map(() => Math.floor(Math.random() * 16).toString(16))
                    .join("")}`,
                  registrationDate: new Date().toISOString(),
                  previewUrl: "/placeholder.svg?height=400&width=400",
                })
              }, 1000)
            }, 1000)
          }, 1000)
        }
      }, 200)
    })
  },

  /**
   * Get the current status of an artwork upload
   * @param artworkId The ID of the artwork
   * @returns Promise with the status response
   */
  getUploadStatus: async (artworkId: string): Promise<UploadStatusResponse> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly select a status for demonstration
        const statuses: UploadStatusResponse["status"][] = ["pending", "processing", "complete", "failed"]
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

        let progress = 0
        let step: UploadProgressEvent["step"] = "uploading"
        let message = ""

        switch (randomStatus) {
          case "pending":
            progress = 10
            step = "uploading"
            message = "Upload started, waiting for files..."
            break
          case "processing":
            progress = 60
            step = "processing"
            message = "Processing artwork metadata..."
            break
          case "complete":
            progress = 100
            step = "complete"
            message = "Artwork successfully registered on blockchain"
            break
          case "failed":
            progress = 30
            step = "uploading"
            message = "Upload failed due to network error"
            break
        }

        resolve({
          artworkId,
          status: randomStatus,
          progress,
          step,
          message,
          transactionHash:
            randomStatus === "complete"
              ? `0x${Array(40)
                  .fill(0)
                  .map(() => Math.floor(Math.random() * 16).toString(16))
                  .join("")}`
              : undefined,
          registrationDate: randomStatus === "complete" ? new Date().toISOString() : undefined,
          previewUrl: randomStatus === "complete" ? "/placeholder.svg?height=400&width=400" : undefined,
        })
      }, 500)
    })
  },

  /**
   * Cancel an in-progress upload
   * @param artworkId The ID of the artwork to cancel
   * @returns Promise with the cancellation result
   */
  cancelUpload: async (artworkId: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Upload for artwork ${artworkId} has been cancelled`,
        })
      }, 300)
    })
  },

  /**
   * Get a list of the user's uploaded artworks
   * @param userId The ID of the user
   * @param status Optional filter by status
   * @returns Promise with the list of artworks
   */
  getUserUploads: async (
    userId: string,
    status?: "pending" | "processing" | "complete" | "failed",
  ): Promise<UploadArtworkResponse[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate 5 mock artworks
        const mockArtworks: UploadArtworkResponse[] = Array(5)
          .fill(0)
          .map((_, index) => {
            const statuses: UploadArtworkResponse["status"][] = ["pending", "processing", "complete", "failed"]
            const randomStatus = status || statuses[Math.floor(Math.random() * statuses.length)]

            return {
              success: randomStatus !== "failed",
              artworkId: `art-${Date.now().toString(36)}-${index}`,
              message: randomStatus === "failed" ? "Upload failed" : "Artwork processed successfully",
              status: randomStatus,
              transactionHash:
                randomStatus === "complete"
                  ? `0x${Array(40)
                      .fill(0)
                      .map(() => Math.floor(Math.random() * 16).toString(16))
                      .join("")}`
                  : undefined,
              registrationDate:
                randomStatus === "complete"
                  ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                  : undefined,
              previewUrl: "/placeholder.svg?height=400&width=400",
            }
          })

        resolve(mockArtworks)
      }, 800)
    })
  },
}
