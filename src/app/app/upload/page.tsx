"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArtworkUploader } from "@/components/artwork-uploader"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UploadPage() {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleUploadSuccess = () => {
    setIsSuccess(true)

    // Redirect after success message is shown
    setTimeout(() => {
      router.push("/app/my-art")
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" className="mb-6 flex items-center text-sm" onClick={() => router.push("/app")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      {isSuccess ? (
        <Alert className="bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-950/20 dark:border-teal-900 dark:text-teal-400 mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your artwork has been successfully submitted for verification! Redirecting to your artwork...
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Upload Artwork</CardTitle>
          <CardDescription>Register your artwork on the blockchain for verification</CardDescription>
        </CardHeader>
        <CardContent>
          <ArtworkUploader onSuccess={handleUploadSuccess} />
        </CardContent>
      </Card>
    </div>
  )
}
