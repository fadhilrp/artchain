"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useIPFSUpload } from "@/hooks/useIPFSUpload"
import { Upload, CheckCircle, Loader2, ExternalLink } from "lucide-react"

export function IPFSUploadExample() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const {
    uploadState,
    lastResult,
    uploadSingleFile,
    uploadMultipleFiles,
    resetState,
    ipfsToHttp,
  } = useIPFSUpload()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleSingleUpload = async () => {
    if (selectedFiles.length === 0) return
    try {
      const uri = await uploadSingleFile(selectedFiles[0])
      console.log("Single file uploaded:", uri)
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  const handleMultipleUpload = async () => {
    if (selectedFiles.length === 0) return
    try {
      const uris = await uploadMultipleFiles(selectedFiles)
      console.log("Multiple files uploaded:", uris)
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  const handleReset = () => {
    setSelectedFiles([])
    resetState()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>IPFS Upload Examples</CardTitle>
          <CardDescription>
            Demonstrate different ways to upload files to IPFS using ThirdWeb's storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select Files</Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploadState.isUploading}
            />
            {selectedFiles.length > 0 && (
              <div className="text-sm text-gray-600">
                Selected: {selectedFiles.map(f => f.name).join(", ")}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadState.isUploading && (
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{uploadState.message}</span>
                    <span className="text-sm">{uploadState.progress}%</span>
                  </div>
                  <Progress value={uploadState.progress} className="w-full" />
                  {uploadState.currentFile && (
                    <div className="text-sm opacity-70">
                      Current: {uploadState.currentFile}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {uploadState.error && (
            <Alert className="bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
              <AlertDescription>
                Upload failed: {uploadState.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {lastResult && !uploadState.isUploading && !uploadState.error && (
            <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">Upload Successful!</div>
                  <div className="space-y-1 text-sm">
                    {lastResult.metadataUri && (
                      <div className="flex items-center gap-2">
                        <span>Metadata:</span>
                        <a 
                          href={ipfsToHttp(lastResult.metadataUri)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline flex items-center gap-1"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {lastResult.imageUris && (
                      <div>
                        <span>Images uploaded: {lastResult.imageUris.length}</span>
                        <div className="mt-1 space-y-1">
                          {lastResult.imageUris.map((uri, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span>Image {index + 1}:</span>
                              <a 
                                href={ipfsToHttp(uri)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="underline flex items-center gap-1 text-xs"
                              >
                                {uri.substring(0, 20)}... <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSingleUpload}
              disabled={selectedFiles.length === 0 || uploadState.isUploading}
              variant="outline"
            >
              {uploadState.isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload First File
            </Button>

            <Button
              onClick={handleMultipleUpload}
              disabled={selectedFiles.length === 0 || uploadState.isUploading}
            >
              {uploadState.isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload All Files
            </Button>

            {(selectedFiles.length > 0 || uploadState.error || lastResult) && (
              <Button
                variant="ghost"
                onClick={handleReset}
                disabled={uploadState.isUploading}
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Usage Instructions Component
export function IPFSUsageInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Use IPFS Storage</CardTitle>
        <CardDescription>
          Integration guide for ThirdWeb IPFS storage in your components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">1. Import the hook:</h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
{`import { useIPFSUpload } from "@/hooks/useIPFSUpload"`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Use in your component:</h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
{`const {
  uploadState,      // { isUploading, progress, message, error }
  lastResult,       // Upload result with URIs
  uploadArtwork,    // Complete artwork upload
  uploadSingleFile, // Upload single file
  resetState,       // Reset hook state
  ipfsToHttp,       // Convert IPFS URI to HTTP
} = useIPFSUpload()`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Upload artwork with metadata:</h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
{`const result = await uploadArtwork(files, {
  title: "My Artwork",
  description: "Description",
  artist: "Artist Name",
  medium: "Digital Art",
  year: "2024"
})`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">4. Handle progress:</h4>
            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">
{`{uploadState.isUploading && (
  <Progress value={uploadState.progress} />
)}`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 