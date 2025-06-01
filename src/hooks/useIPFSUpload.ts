import { useState, useCallback } from "react";
import { IPFSStorage, UploadProgress, ArtworkMetadata } from "@/lib/ipfs-storage";

export interface UploadState {
  isUploading: boolean;
  progress: number;
  currentFile?: string;
  message?: string;
  error?: string;
}

export interface UploadResult {
  imageUris: string[];
  metadataUri: string;
  metadata: ArtworkMetadata;
}

export interface ArtworkUploadData {
  title: string;
  description: string;
  artist: string;
  medium: string;
  year: string;
  dimensions?: string;
  additionalInfo?: string;
  external_url?: string;
}

export function useIPFSUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
  });

  const [lastResult, setLastResult] = useState<UploadResult | null>(null);

  const resetState = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
    });
    setLastResult(null);
  }, []);

  const uploadArtwork = useCallback(
    async (images: File[], artworkData: ArtworkUploadData): Promise<UploadResult> => {
      try {
        setUploadState({
          isUploading: true,
          progress: 0,
          message: "Preparing upload...",
        });

        const result = await IPFSStorage.uploadArtwork(
          images,
          artworkData,
          (progress: UploadProgress) => {
            setUploadState((prev) => ({
              ...prev,
              progress: progress.progress,
              currentFile: progress.currentFile,
              message: progress.message,
            }));
          }
        );

        setLastResult(result);
        setUploadState({
          isUploading: false,
          progress: 100,
          message: "Upload completed successfully!",
        });

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setUploadState({
          isUploading: false,
          progress: 0,
          error: errorMessage,
          message: "Upload failed",
        });
        throw error;
      }
    },
    []
  );

  const uploadSingleFile = useCallback(async (file: File): Promise<string> => {
    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        currentFile: file.name,
        message: "Uploading file...",
      });

      const uri = await IPFSStorage.uploadFile(file, (progress) => {
        setUploadState((prev) => ({
          ...prev,
          progress,
        }));
      });

      setUploadState({
        isUploading: false,
        progress: 100,
        message: "File uploaded successfully!",
      });

      return uri;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        message: "Upload failed",
      });
      throw error;
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (files: File[]): Promise<string[]> => {
    try {
      setUploadState({
        isUploading: true,
        progress: 0,
        message: "Uploading files...",
      });

      const uris = await IPFSStorage.uploadFiles(files, (progress) => {
        setUploadState((prev) => ({
          ...prev,
          progress: progress.progress,
          currentFile: progress.currentFile,
          message: progress.message,
        }));
      });

      setUploadState({
        isUploading: false,
        progress: 100,
        message: "All files uploaded successfully!",
      });

      return uris;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setUploadState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        message: "Upload failed",
      });
      throw error;
    }
  }, []);

  return {
    uploadState,
    lastResult,
    uploadArtwork,
    uploadSingleFile,
    uploadMultipleFiles,
    resetState,
    // Utility functions
    ipfsToHttp: IPFSStorage.ipfsToHttp,
    getMetadata: IPFSStorage.getMetadata,
  };
} 