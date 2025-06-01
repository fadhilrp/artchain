import { upload } from "thirdweb/storage";
import { client } from "@/app/client";

export interface ArtworkMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    artist: string;
    medium: string;
    year: string;
    dimensions?: string;
    additionalInfo?: string;
  };
}

export interface UploadProgress {
  progress: number;
  currentFile?: string;
  message?: string;
}

export class IPFSStorage {
  /**
   * Upload a single file to IPFS
   */
  static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<string> {
    try {
      if (onProgress) onProgress(0);
      
      const uri = await upload({
        client,
        files: [file],
      });

      if (onProgress) onProgress(100);
      return uri;
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload multiple files to IPFS
   */
  static async uploadFiles(
    files: File[], 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string[]> {
    try {
      const uris: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = ((i + 1) / files.length) * 100;
        
        if (onProgress) {
          onProgress({
            progress: Math.round(progress * 0.8), // Reserve 20% for metadata upload
            currentFile: file.name,
            message: `Uploading image ${i + 1} of ${files.length}...`
          });
        }

        const uri = await this.uploadFile(file);
        uris.push(uri);
      }

      return uris;
    } catch (error) {
      console.error("Error uploading files to IPFS:", error);
      throw new Error(`Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload artwork metadata to IPFS
   */
  static async uploadMetadata(
    metadata: ArtworkMetadata,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      if (onProgress) onProgress(0);

      const metadataFile = new File(
        [JSON.stringify(metadata, null, 2)], 
        "metadata.json", 
        { type: "application/json" }
      );

      const uri = await upload({
        client,
        files: [metadataFile],
      });

      if (onProgress) onProgress(100);
      return uri;
    } catch (error) {
      console.error("Error uploading metadata to IPFS:", error);
      throw new Error(`Failed to upload metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Complete artwork upload process - images + metadata
   */
  static async uploadArtwork(
    images: File[],
    artworkData: {
      title: string;
      description: string;
      artist: string;
      medium: string;
      year: string;
      dimensions?: string;
      additionalInfo?: string;
      external_url?: string;
    },
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{
    imageUris: string[];
    metadataUri: string;
    metadata: ArtworkMetadata;
  }> {
    try {
      // Step 1: Upload images (0-80%)
      if (onProgress) {
        onProgress({
          progress: 0,
          message: "Starting image uploads..."
        });
      }

      const imageUris = await this.uploadFiles(images, (imageProgress) => {
        if (onProgress) {
          onProgress({
            progress: Math.round(imageProgress.progress * 0.8),
            currentFile: imageProgress.currentFile,
            message: imageProgress.message
          });
        }
      });

      // Step 2: Create metadata (80-90%)
      if (onProgress) {
        onProgress({
          progress: 80,
          message: "Creating metadata..."
        });
      }

      const attributes = [
        { trait_type: "Artist", value: artworkData.artist },
        { trait_type: "Medium", value: artworkData.medium },
        { trait_type: "Year", value: artworkData.year },
      ];

      if (artworkData.dimensions) {
        attributes.push({ trait_type: "Dimensions", value: artworkData.dimensions });
      }

      const metadata: ArtworkMetadata = {
        name: artworkData.title,
        description: artworkData.description,
        image: imageUris[0], // Primary image
        external_url: artworkData.external_url,
        attributes,
        properties: {
          artist: artworkData.artist,
          medium: artworkData.medium,
          year: artworkData.year,
          dimensions: artworkData.dimensions,
          additionalInfo: artworkData.additionalInfo,
        },
      };

      // Step 3: Upload metadata (90-100%)
      if (onProgress) {
        onProgress({
          progress: 90,
          message: "Uploading metadata to IPFS..."
        });
      }

      const metadataUri = await this.uploadMetadata(metadata, (metadataProgress) => {
        if (onProgress) {
          onProgress({
            progress: 90 + Math.round(metadataProgress * 0.1),
            message: "Finalizing metadata upload..."
          });
        }
      });

      if (onProgress) {
        onProgress({
          progress: 100,
          message: "Upload complete!"
        });
      }

      return {
        imageUris,
        metadataUri,
        metadata,
      };
    } catch (error) {
      console.error("Error uploading artwork:", error);
      throw new Error(`Failed to upload artwork: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve metadata from IPFS URI
   */
  static async getMetadata(uri: string): Promise<ArtworkMetadata> {
    try {
      const response = await fetch(uri.replace("ipfs://", "https://ipfs.io/ipfs/"));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching metadata from IPFS:", error);
      throw new Error(`Failed to fetch metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert IPFS URI to HTTP URL for display
   */
  static ipfsToHttp(uri: string): string {
    if (uri.startsWith("ipfs://")) {
      return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return uri;
  }
} 