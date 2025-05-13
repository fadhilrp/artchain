"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { uploadApi } from "@/lib/api/upload-api"
import { validationApi } from "@/lib/api/validation-api"
import { rewardApi } from "@/lib/api/reward-api"

export function UploadApiExample() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async () => {
    setLoading(true)
    setProgress(0)

    try {
      // Mock file object
      const mockFile = new File(["dummy content"], "artwork.jpg", { type: "image/jpeg" })

      const response = await uploadApi.uploadArtwork(
        {
          title: "Sample Artwork",
          description: "This is a sample artwork for testing the API",
          medium: "Digital Art",
          year: "2025",
          images: [mockFile],
        },
        (event) => {
          setProgress(event.progress)
        },
      )

      setResult(response)
    } catch (error) {
      console.error("Upload failed:", error)
      setResult({ error: "Upload failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleUpload} disabled={loading}>
        {loading ? `Uploading... ${progress}%` : "Test Upload API"}
      </Button>

      {result && (
        <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}

export function ValidationApiExample() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleGetQueue = async () => {
    setLoading(true)

    try {
      const response = await validationApi.getValidationQueue({
        status: "pending",
        limit: 3,
      })

      setResult(response)
    } catch (error) {
      console.error("API call failed:", error)
      setResult({ error: "API call failed" })
    } finally {
      setLoading(false)
    }
  }

  const handleAIValidation = async () => {
    setLoading(true)

    try {
      const response = await validationApi.requestAIValidation("art-123")

      setResult(response)
    } catch (error) {
      console.error("API call failed:", error)
      setResult({ error: "API call failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleGetQueue} disabled={loading}>
          {loading ? "Loading..." : "Test Get Queue"}
        </Button>

        <Button onClick={handleAIValidation} disabled={loading}>
          {loading ? "Loading..." : "Test AI Validation"}
        </Button>
      </div>

      {result && (
        <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}

export function RewardApiExample() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleGetBalance = async () => {
    setLoading(true)

    try {
      const response = await rewardApi.getRewardBalance("validator-123")

      setResult(response)
    } catch (error) {
      console.error("API call failed:", error)
      setResult({ error: "API call failed" })
    } finally {
      setLoading(false)
    }
  }

  const handleGetHistory = async () => {
    setLoading(true)

    try {
      const response = await rewardApi.getRewardHistory("validator-123", {
        period: "month",
        limit: 3,
      })

      setResult(response)
    } catch (error) {
      console.error("API call failed:", error)
      setResult({ error: "API call failed" })
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawal = async () => {
    setLoading(true)

    try {
      const response = await rewardApi.requestWithdrawal("validator-123", {
        amount: 100,
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
        network: "polygon",
      })

      setResult(response)
    } catch (error) {
      console.error("API call failed:", error)
      setResult({ error: "API call failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleGetBalance} disabled={loading}>
          {loading ? "Loading..." : "Test Get Balance"}
        </Button>

        <Button onClick={handleGetHistory} disabled={loading}>
          {loading ? "Loading..." : "Test Get History"}
        </Button>

        <Button onClick={handleWithdrawal} disabled={loading}>
          {loading ? "Loading..." : "Test Withdrawal"}
        </Button>
      </div>

      {result && (
        <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}
