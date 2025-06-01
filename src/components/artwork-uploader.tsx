"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useIPFSUpload, ArtworkUploadData, UploadResult } from "@/hooks/useIPFSUpload"

interface ArtworkUploaderProps {
  onSuccess: (result: UploadResult & { artwork?: any; imageHash?: string }) => void
}

interface ExtendedUploadResult extends UploadResult {
  artwork?: any
  imageHash?: string
}

export function ArtworkUploader({ onSuccess }: ArtworkUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isProcessingBlockchain, setIsProcessingBlockchain] = useState(false)
  const [blockchainProgress, setBlockchainProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    medium: "",
    year: "",
    dimensions: "",
    additionalInfo: "",
    artist: "", // Will be set from wallet address
  })

  const {
    uploadState,
    lastResult,
    uploadArtwork,
    resetState,
    ipfsToHttp,
  } = useIPFSUpload()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])

      // Create previews
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviews((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      alert("Please upload at least one image of your artwork")
      return
    }

    if (!formData.title || !formData.description || !formData.medium || !formData.year) {
      alert("Please fill in all required fields")
      return
    }

    try {
      // Step 1: Upload to IPFS
      const artworkData: ArtworkUploadData = {
        ...formData,
        artist: formData.artist || "Unknown Artist", // You can integrate with wallet here
      }

      const ipfsResult = await uploadArtwork(files, artworkData)
      
      // Step 2: Submit to blockchain and database
      setIsProcessingBlockchain(true)
      setBlockchainProgress(0)

      console.log('Submitting to blockchain...', {
        imageUris: ipfsResult.imageUris,
        metadataUri: ipfsResult.metadataUri,
        metadata: ipfsResult.metadata
      })

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setBlockchainProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch('http://localhost:3001/upload-ipfs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUris: ipfsResult.imageUris,
          metadataUri: ipfsResult.metadataUri,
          metadata: ipfsResult.metadata
        }),
      })

      clearInterval(progressInterval)
      setBlockchainProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to submit to blockchain')
      }

      const blockchainResult = await response.json()
      console.log('Blockchain submission successful:', blockchainResult)

      // Combine results
      const extendedResult: ExtendedUploadResult = {
        ...ipfsResult,
        artwork: blockchainResult.artwork,
        imageHash: blockchainResult.imageHash
      }

      // Success! Pass the result to parent component
      onSuccess(extendedResult)
      
      // Reset form after success
      setTimeout(() => {
        setFiles([])
        setPreviews([])
        setFormData({
          title: "",
          description: "",
          medium: "",
          year: "",
          dimensions: "",
          additionalInfo: "",
          artist: "",
        })
        resetState()
        setIsProcessingBlockchain(false)
        setBlockchainProgress(0)
      }, 5000)
    } catch (error) {
      console.error("Upload failed:", error)
      setIsProcessingBlockchain(false)
      setBlockchainProgress(0)
      // Error is already handled by the hook for IPFS, but we need to handle blockchain errors
      if (error instanceof Error && error.message.includes('blockchain')) {
        alert(`Blockchain submission failed: ${error.message}`)
      }
    }
  }

  const handleReset = () => {
    setFiles([])
    setPreviews([])
    resetState()
    setIsProcessingBlockchain(false)
    setBlockchainProgress(0)
  }

  const isOverallLoading = uploadState.isUploading || isProcessingBlockchain
  const overallProgress = uploadState.isUploading 
    ? uploadState.progress * 0.7  // IPFS upload takes 70% of total
    : 70 + (blockchainProgress * 0.3)  // Blockchain takes 30% of total

  return (
    <div className="space-y-6">
      {uploadState.error ? (
        <Alert className="bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400">
          <X className="h-4 w-4" />
          <AlertDescription>
            Upload failed: {uploadState.error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2" 
              onClick={handleReset}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      ) : lastResult && !isOverallLoading ? (
        <Alert className="bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/20 dark:border-teal-900 dark:text-teal-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your artwork has been successfully uploaded to IPFS and registered on the blockchain!
            <div className="mt-4 text-sm space-y-2">
              <div><b>Metadata URI:</b> <a href={ipfsToHttp(lastResult.metadataUri)} target="_blank" rel="noopener noreferrer" className="underline">{lastResult.metadataUri}</a></div>
              <div><b>Image URI:</b> <a href={ipfsToHttp(lastResult.imageUris[0])} target="_blank" rel="noopener noreferrer" className="underline">{lastResult.imageUris[0]}</a></div>
              <div><b>Total Images:</b> {lastResult.imageUris.length}</div>
              <div className="text-xs opacity-75 pt-2">✅ Stored on IPFS ✅ Registered on Blockchain ✅ Saved to Database</div>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      {isOverallLoading && (
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>
                    {uploadState.isUploading 
                      ? uploadState.message 
                      : `Processing blockchain registration... ${blockchainProgress}%`
                    }
                  </span>
                  <span className="text-sm">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="w-full" />
                {uploadState.currentFile && uploadState.isUploading && (
                  <div className="text-sm opacity-70">
                    Current: {uploadState.currentFile}
                  </div>
                )}
                {isProcessingBlockchain && (
                  <div className="text-sm opacity-70">
                    Submitting to blockchain and saving to database...
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="artwork-upload">Upload Artwork Images</Label>
          <div
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            onClick={() => document.getElementById("artwork-upload")?.click()}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-1">Drag and drop your artwork images here</p>
            <p className="text-xs text-gray-400 mb-4">PNG, JPG or WEBP (max. 10MB per image)</p>
            <Button type="button" variant="outline" size="sm" disabled={isOverallLoading}>
              Browse Files
            </Button>
            <Input
              id="artwork-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isOverallLoading}
            />
          </div>
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Images ({previews.length})</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}
                    disabled={isOverallLoading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {files[index]?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter artwork title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isOverallLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medium">Medium *</Label>
            <Select 
              value={formData.medium} 
              onValueChange={(value) => handleSelectChange("medium", value)}
              disabled={isOverallLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select medium" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oil">Oil Painting</SelectItem>
                <SelectItem value="acrylic">Acrylic Painting</SelectItem>
                <SelectItem value="watercolor">Watercolor</SelectItem>
                <SelectItem value="digital">Digital Art</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="sculpture">Sculpture</SelectItem>
                <SelectItem value="mixed">Mixed Media</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year Created *</Label>
            <Input
              id="year"
              name="year"
              placeholder="e.g., 2024"
              value={formData.year}
              onChange={handleInputChange}
              disabled={isOverallLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions (Optional)</Label>
            <Input
              id="dimensions"
              name="dimensions"
              placeholder="e.g., 24 x 36 inches"
              value={formData.dimensions}
              onChange={handleInputChange}
              disabled={isOverallLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your artwork, inspiration, or story behind it"
            className="min-h-[120px]"
            value={formData.description}
            onChange={handleInputChange}
            disabled={isOverallLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            placeholder="Any additional details, provenance, or notes"
            className="min-h-[80px]"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            disabled={isOverallLoading}
          />
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={isOverallLoading || files.length === 0}
          >
            {isOverallLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadState.isUploading ? "Uploading to IPFS..." : "Registering on Blockchain..."}
              </>
            ) : (
              "Upload & Register Artwork"
            )}
          </Button>
          
          {(files.length > 0 || uploadState.error) && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={isOverallLoading}
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
