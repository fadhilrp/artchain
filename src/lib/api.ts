const API_BASE_URL = "http://localhost:3001";

export interface Artwork {
  id: string;
  imageHash: string;
  title: string;
  artist: string;
  dateSubmitted: string;
  status: "pending" | "validated" | "rejected";
  medium: string;
  images: string[];
  description: string;
  additionalInfo: string;
  isOriginal: boolean;
  validated: boolean;
  consensusCount: number;
  requiredValidators: number;
  originalAuthor: string;
  timestamp?: string; // Optional timestamp from backend
  createdAt?: string; // Creation timestamp
  
  // IPFS fields
  imageUris?: string[]; // Array of IPFS image URIs
  metadataUri?: string; // IPFS metadata URI
  
  // Additional fields for backward compatibility
  year?: string;
  dimensions?: string;
}

export class ValidationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const api = {
  // Get all artworks
  getArtworks: async (): Promise<Artwork[]> => {
    const response = await fetch(`${API_BASE_URL}/artworks`);
    if (!response.ok) {
      throw new Error("Failed to fetch artworks");
    }
    return response.json();
  },

  // Validate artwork
  validateArtwork: async (
    imageHash: string,
    isOriginal: boolean,
    originalAuthor: string,
    validatorAddress: string
  ): Promise<Artwork> => {
    try {
      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageHash,
          isOriginal,
          originalAuthor,
          validatorAddress,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ValidationError(
          error.details || "Failed to validate artwork",
          error.code
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError("Failed to validate artwork");
    }
  },
};
