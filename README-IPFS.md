# IPFS Storage with ThirdWeb Integration

This project includes a complete IPFS storage solution using ThirdWeb v5 SDK for uploading artwork images and metadata to IPFS (InterPlanetary File System).

## Features

- ✅ Upload single or multiple images to IPFS
- ✅ Generate and upload standardized artwork metadata
- ✅ Real-time upload progress tracking
- ✅ Error handling and retry functionality
- ✅ IPFS URI to HTTP URL conversion
- ✅ TypeScript support with full type safety
- ✅ React hooks for easy integration

## Quick Start

### 1. Basic File Upload

```tsx
import { useIPFSUpload } from "@/hooks/useIPFSUpload"

function MyComponent() {
  const { uploadSingleFile, uploadState } = useIPFSUpload()
  
  const handleUpload = async (file: File) => {
    try {
      const uri = await uploadSingleFile(file)
      console.log("Uploaded to IPFS:", uri)
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }
  
  return (
    <div>
      {uploadState.isUploading && (
        <p>Uploading... {uploadState.progress}%</p>
      )}
    </div>
  )
}
```

### 2. Complete Artwork Upload

```tsx
import { useIPFSUpload } from "@/hooks/useIPFSUpload"

function ArtworkUploader() {
  const { uploadArtwork, uploadState, lastResult } = useIPFSUpload()
  
  const handleUpload = async (images: File[]) => {
    try {
      const result = await uploadArtwork(images, {
        title: "My Artwork",
        description: "A beautiful piece of art",
        artist: "Artist Name",
        medium: "Digital Art",
        year: "2024",
        dimensions: "1920x1080",
        additionalInfo: "Created with love"
      })
      
      console.log("Metadata URI:", result.metadataUri)
      console.log("Image URIs:", result.imageUris)
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }
}
```

## API Reference

### `useIPFSUpload()` Hook

Returns an object with the following properties and methods:

#### State

- `uploadState`: Current upload state
  - `isUploading: boolean` - Whether an upload is in progress
  - `progress: number` - Upload progress (0-100)
  - `currentFile?: string` - Name of the file currently being uploaded
  - `message?: string` - Current status message
  - `error?: string` - Error message if upload failed

- `lastResult`: Result of the last successful upload
  - `imageUris: string[]` - Array of IPFS URIs for uploaded images
  - `metadataUri: string` - IPFS URI for the metadata JSON
  - `metadata: ArtworkMetadata` - The metadata object

#### Methods

- `uploadSingleFile(file: File): Promise<string>`
  - Uploads a single file to IPFS
  - Returns the IPFS URI

- `uploadMultipleFiles(files: File[]): Promise<string[]>`
  - Uploads multiple files to IPFS
  - Returns an array of IPFS URIs

- `uploadArtwork(images: File[], artworkData: ArtworkUploadData): Promise<UploadResult>`
  - Uploads artwork images and creates standardized metadata
  - Returns complete upload result with URIs

- `resetState(): void`
  - Resets the hook state

#### Utility Functions

- `ipfsToHttp(uri: string): string`
  - Converts IPFS URI to HTTP URL for viewing
  - Example: `ipfs://QmHash...` → `https://ipfs.io/ipfs/QmHash...`

- `getMetadata(uri: string): Promise<ArtworkMetadata>`
  - Fetches and parses metadata from IPFS URI

### Types

```typescript
interface ArtworkUploadData {
  title: string
  description: string
  artist: string
  medium: string
  year: string
  dimensions?: string
  additionalInfo?: string
  external_url?: string
}

interface ArtworkMetadata {
  name: string
  description: string
  image: string // IPFS URI of primary image
  external_url?: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  properties: {
    artist: string
    medium: string
    year: string
    dimensions?: string
    additionalInfo?: string
  }
}

interface UploadResult {
  imageUris: string[]
  metadataUri: string
  metadata: ArtworkMetadata
}
```

## Implementation Details

### Storage Layer (`src/lib/ipfs-storage.ts`)

The `IPFSStorage` class provides static methods for IPFS operations:

- Uses ThirdWeb v5's `upload` function
- Handles progress callbacks
- Creates standardized metadata format
- Includes comprehensive error handling

### React Hook (`src/hooks/useIPFSUpload.ts`)

The `useIPFSUpload` hook provides:

- State management for upload progress
- Error handling and user feedback
- Result caching
- Easy integration with React components

### Components

- `ArtworkUploader`: Complete form for artwork upload with IPFS storage
- `IPFSUploadExample`: Example component demonstrating various use cases

## Configuration

Make sure you have a ThirdWeb client ID configured in your environment:

```env
NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_thirdweb_client_id
```

The client is configured in `src/app/client.ts`.

## Metadata Standard

The system creates metadata following a standardized format compatible with NFT marketplaces:

```json
{
  "name": "Artwork Title",
  "description": "Artwork description",
  "image": "ipfs://QmImageHash...",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "Artist",
      "value": "Artist Name"
    },
    {
      "trait_type": "Medium", 
      "value": "Digital Art"
    },
    {
      "trait_type": "Year",
      "value": "2024"
    }
  ],
  "properties": {
    "artist": "Artist Name",
    "medium": "Digital Art",
    "year": "2024",
    "dimensions": "1920x1080",
    "additionalInfo": "Additional information"
  }
}
```

## Error Handling

The system includes comprehensive error handling:

- Network connection issues
- File size/type validation
- IPFS upload failures
- Progress tracking interruptions

All errors are captured and displayed to the user with helpful messages.

## Examples

See `src/components/ipfs-upload-example.tsx` for working examples of:

- Single file upload
- Multiple file upload
- Progress tracking
- Error handling
- Result display

## Integration with Existing Code

The IPFS storage can be easily integrated with your existing artwork upload flow:

1. Replace the current upload logic in `artwork-uploader.tsx`
2. Use the IPFS URIs for blockchain storage
3. Store metadata URIs in your database
4. Display images using the `ipfsToHttp` utility

## Performance Considerations

- Files are uploaded sequentially to avoid overwhelming the IPFS gateway
- Progress tracking provides user feedback during long uploads
- Metadata is uploaded after images to ensure all references are valid
- URIs are cached to avoid redundant uploads

## Troubleshooting

### Common Issues

1. **Upload fails immediately**
   - Check your ThirdWeb client ID configuration
   - Verify network connectivity

2. **Slow upload speeds**
   - IPFS uploads can be slower than traditional storage
   - Consider file size optimization

3. **Metadata not displaying**
   - Ensure IPFS URIs are properly formatted
   - Check that metadata follows the standard format

### Getting Help

- Check the browser console for detailed error messages
- Verify that all required fields are provided
- Test with smaller files first

## License

This IPFS integration is part of the ArtChain project and follows the same licensing terms. 