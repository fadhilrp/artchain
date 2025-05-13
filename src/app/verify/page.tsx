import Link from "next/link"
import { ArrowLeft, CheckCircle, QrCode, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VerifyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-teal-600 mb-6 hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Verify Artwork Authenticity</h1>

        <Tabs defaultValue="token" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="token">Token ID</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="certificate">Certificate</TabsTrigger>
          </TabsList>

          <TabsContent value="token">
            <Card>
              <CardHeader>
                <CardTitle>Verify by Token ID</CardTitle>
                <CardDescription>
                  Enter the unique token ID associated with the artwork to verify its authenticity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Enter token ID (e.g., ART-12345-XYZ)" />
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Search className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example of verified artwork - this would be conditionally rendered based on search results */}
            <Card className="mt-8 border-teal-200 bg-teal-50 dark:bg-teal-950/20 dark:border-teal-900">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-teal-600" />
                  <CardTitle className="text-teal-700 dark:text-teal-400">Verified Artwork</CardTitle>
                </div>
                <CardDescription>This artwork has been verified on the blockchain.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="Verified artwork"
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold">Sunset Reflections</h3>
                      <p className="text-sm text-gray-500">by Elena Morales</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Creation Date</p>
                        <p className="text-gray-500">March 15, 2025</p>
                      </div>
                      <div>
                        <p className="font-medium">Medium</p>
                        <p className="text-gray-500">Oil on canvas</p>
                      </div>
                      <div>
                        <p className="font-medium">Dimensions</p>
                        <p className="text-gray-500">36 x 48 inches</p>
                      </div>
                      <div>
                        <p className="font-medium">Edition</p>
                        <p className="text-gray-500">Unique</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">Description</p>
                      <p className="text-sm text-gray-500">
                        A vibrant sunset scene capturing the reflection of light on water, inspired by the coastal
                        landscapes of the Pacific Northwest.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">Blockchain Information</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Token ID: ART-78392-XYZ</p>
                        <p>Registered: May 10, 2025</p>
                        <p>Transaction Hash: 0x8f7d...e4a2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">View Ownership History</Button>
                <Button className="bg-teal-600 hover:bg-teal-700">View Certificate</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle>Verify by QR Code</CardTitle>
                <CardDescription>
                  Scan the QR code attached to the artwork or its certificate to verify authenticity.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-6 py-8">
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center w-full max-w-sm">
                  <QrCode className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-center text-sm text-gray-500 mb-6">
                    Position the QR code within the scanning area
                  </p>
                  <Button className="bg-teal-600 hover:bg-teal-700">Start Camera Scan</Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">You can also upload a photo of the QR code</p>
                  <Button variant="link" size="sm">
                    Upload QR Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle>Verify by Certificate</CardTitle>
                <CardDescription>Upload the certificate of authenticity to verify the artwork.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                    <QrCode className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-center text-sm text-gray-500 mb-2">Upload the certificate PDF or image</p>
                  <p className="text-center text-xs text-gray-400 mb-6">PDF, JPG, or PNG formats accepted</p>
                  <Button className="bg-teal-600 hover:bg-teal-700">Upload Certificate</Button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <h3 className="font-medium mb-2">Certificate Verification Process</h3>
                  <ol className="text-sm text-gray-500 space-y-2 list-decimal list-inside">
                    <li>Upload the certificate document provided with your artwork</li>
                    <li>Our system will extract the embedded verification data</li>
                    <li>The certificate will be validated against blockchain records</li>
                    <li>Verification results will display the complete artwork information</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
