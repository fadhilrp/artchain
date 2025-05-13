import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-teal-600 mb-6 hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Register Your Artwork</h1>

        <Tabs defaultValue="artist" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="artist">Artist Registration</TabsTrigger>
            <TabsTrigger value="artwork">Artwork Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="artist">
            <Card>
              <CardHeader>
                <CardTitle>Artist Profile</CardTitle>
                <CardDescription>
                  Create your artist profile to register your artwork on the blockchain.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email address" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Artist Biography</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your artistic journey"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website or Portfolio (Optional)</Label>
                  <Input id="website" placeholder="https://yourwebsite.com" />
                </div>

                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-1">Drag and drop your profile picture here</p>
                    <p className="text-xs text-gray-400 mb-4">PNG, JPG or WEBP (max. 2MB)</p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id-verification">Identity Verification</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-1">Upload a government-issued ID for verification</p>
                    <p className="text-xs text-gray-400 mb-4">Your ID will be securely processed and not stored</p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-teal-600 hover:bg-teal-700">Continue to Artwork Registration</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="artwork">
            <Card>
              <CardHeader>
                <CardTitle>Artwork Details</CardTitle>
                <CardDescription>Register your artwork on the blockchain with detailed information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="artwork-title">Artwork Title</Label>
                  <Input id="artwork-title" placeholder="Enter the title of your artwork" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="creation-date">Creation Date</Label>
                    <Input id="creation-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium">Medium</Label>
                    <Input id="medium" placeholder="e.g., Oil on canvas, Digital, Sculpture" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input id="dimensions" placeholder="e.g., 24 x 36 inches" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edition">Edition</Label>
                    <Input id="edition" placeholder="e.g., 1/10, Unique" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Artwork Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your artwork, its meaning, and any relevant details"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Artwork Images</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-1">Upload high-quality images of your artwork</p>
                    <p className="text-xs text-gray-400 mb-4">
                      PNG, JPG or WEBP (max. 10MB). Upload multiple views if needed.
                    </p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provenance">Provenance Information (Optional)</Label>
                  <Textarea
                    id="provenance"
                    placeholder="Include any history of ownership, exhibitions, or other relevant provenance information"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate">Certificate of Authenticity</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-1">Upload your certificate of authenticity if available</p>
                    <p className="text-xs text-gray-400 mb-4">PDF format preferred (max. 5MB)</p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-teal-600 hover:bg-teal-700">Register on Blockchain</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
