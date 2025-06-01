"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArtworkUploader } from "@/components/artwork-uploader"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, ExternalLink, Hash } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UploadResult } from "@/hooks/useIPFSUpload"

type ExtendedUploadResult = UploadResult & {
  artwork?: any
  imageHash?: string
}

export default function UploadPage() {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadResult, setUploadResult] = useState<ExtendedUploadResult | null>(null)

  const handleUploadSuccess = (result: ExtendedUploadResult) => {
    setUploadResult(result)
    setIsSuccess(true)

    // Redirect after success message is shown
    setTimeout(() => {
      router.push("/app/my-art")
    }, 7000)
  }

  const ipfsToHttp = (uri: string): string => {
    if (uri.startsWith("ipfs://")) {
      return uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    }
    return uri
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" className="mb-6 flex items-center text-sm" onClick={() => router.push("/app")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      {isSuccess && uploadResult ? (
        <Alert className="bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/20 dark:border-teal-900 dark:text-teal-400 mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-4">
              <div className="font-semibold text-lg">
                🎉 Artwork "{uploadResult.metadata.name}" Successfully Registered!
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* IPFS Information */}
                <div className="space-y-2 p-3 bg-white/50 rounded-lg">
                  <div className="font-medium text-teal-700">📁 IPFS Storage</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Metadata:</span>
                      <a 
                        href={ipfsToHttp(uploadResult.metadataUri)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="underline flex items-center gap-1 hover:text-teal-600 text-xs"
                      >
                        View JSON <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Primary Image:</span>
                      <a 
                        href={ipfsToHttp(uploadResult.imageUris[0])} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="underline flex items-center gap-1 hover:text-teal-600 text-xs"
                      >
                        View Image <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    
                    {uploadResult.imageUris.length > 1 && (
                      <div className="text-xs">
                        + {uploadResult.imageUris.length - 1} more images stored
                      </div>
                    )}
                  </div>
                </div>

                {/* Blockchain Information */}
                <div className="space-y-2 p-3 bg-white/50 rounded-lg">
                  <div className="font-medium text-teal-700">⛓️ Blockchain Registry</div>
                  <div className="space-y-1">
                    {uploadResult.imageHash && (
                      <div className="flex items-start gap-2">
                        <Hash className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <div className="text-xs font-mono break-all">
                          {uploadResult.imageHash}
                        </div>
                      </div>
                    )}
                    
                    {uploadResult.artwork && (
                      <div className="text-xs space-y-1">
                        <div>Status: {uploadResult.artwork.validated ? '✅ Validated' : '⏳ Pending'}</div>
                        <div>Consensus: {uploadResult.artwork.consensusCount}/{uploadResult.artwork.requiredValidators}</div>
                        <div>Original: {uploadResult.artwork.isOriginal ? '✅ Yes' : '❌ No'}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Artwork Details */}
              <div className="space-y-2 p-3 bg-white/50 rounded-lg">
                <div className="font-medium text-teal-700">🎨 Artwork Details</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-medium">Artist:</span> {uploadResult.metadata.properties.artist}</div>
                  <div><span className="font-medium">Medium:</span> {uploadResult.metadata.properties.medium}</div>
                  <div><span className="font-medium">Year:</span> {uploadResult.metadata.properties.year}</div>
                  {uploadResult.metadata.properties.dimensions && (
                    <div><span className="font-medium">Dimensions:</span> {uploadResult.metadata.properties.dimensions}</div>
                  )}
                </div>
              </div>
              
              <div className="text-xs opacity-75 text-center pt-2 border-t border-teal-200">
                Your artwork is now permanently stored and can be viewed in the verification queue and your collection.
                <br />
                Redirecting to your artwork collection...
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Upload Artwork to Blockchain</CardTitle>
          <CardDescription>
            Store your artwork permanently on IPFS and register it on the blockchain for verification and provenance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ArtworkUploader onSuccess={handleUploadSuccess} />
        </CardContent>
      </Card>
    </div>
  )
}
