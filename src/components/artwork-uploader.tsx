"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ArtworkUploaderProps {
  onSuccess: () => void
}

export function ArtworkUploader({ onSuccess }: ArtworkUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    medium: "",
    year: "",
    dimensions: "",
    additionalInfo: "",
  })

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

    setIsUploading(true)

    const data = new FormData()
    data.append("image", files[0]) // Only sending the first image for now
    data.append("artist", "0xYourArtistAddress") // Replace with actual artist address if available
    data.append("title", formData.title)
    // Add more fields as needed
    // data.append("description", formData.description);
    // data.append("medium", formData.medium);
    // data.append("year", formData.year);
    // data.append("dimensions", formData.dimensions);
    // data.append("additionalInfo", formData.additionalInfo);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      console.log("Upload result:", result)

      setIsUploading(false)
      setIsSuccess(true)
      setUploadResult(result)

      // Optionally, show the result to the user here

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
        })
        setIsSuccess(false)
        setUploadResult(null)
        onSuccess()
      }, 6000)
    } catch (error) {
      setIsUploading(false)
      alert("There was an error uploading your artwork. Please try again.")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      {isSuccess ? (
        <Alert className="bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/20 dark:border-teal-900 dark:text-teal-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your artwork has been successfully submitted for verification! You can track its status in the &quot;My
            Artwork&quot; section.<br />
            {uploadResult && (
              <div className="mt-4 text-sm">
                <div><b>Image Hash:</b> {uploadResult.imageHash}</div>
                <div><b>Duplicate:</b> {uploadResult.isDuplicate ? "Yes" : "No"}</div>
                <div><b>Consensus:</b> {uploadResult.consensus ? "Reached" : "Not Reached"}</div>
                <div><b>Metadata:</b> {uploadResult.metadata && (
                  <pre className="bg-gray-100 rounded p-2 mt-1 text-xs overflow-x-auto">{JSON.stringify(uploadResult.metadata, null, 2)}</pre>
                )}</div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      ) : (
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
              <Button type="button" variant="outline" size="sm">
                Browse Files
              </Button>
              <Input
                id="artwork-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {previews.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Images</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Artwork preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Artwork Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter the title of your artwork"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medium">Medium</Label>
              <Select
                name="medium"
                value={formData.medium}
                onValueChange={(value) => handleSelectChange("medium", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oil">Oil Painting</SelectItem>
                  <SelectItem value="acrylic">Acrylic Painting</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                  <SelectItem value="digital">Digital Art</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="mixed">Mixed Media</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year Created</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g., 2025"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder="e.g., 24 x 36 inches"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Artwork Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your artwork, its meaning, and any relevant details"
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Include any provenance information, exhibition history, or other relevant details"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Submit for Verification"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
