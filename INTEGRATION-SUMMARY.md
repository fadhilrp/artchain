# ArtChain IPFS + Blockchain + Database Integration

## Complete Flow Overview

Your artwork upload system now has a complete integration between IPFS storage, blockchain registration, and database storage. Here's how it all works together:

## 🔄 Upload Flow

### 1. IPFS Storage (Frontend)
- User uploads artwork through `ArtworkUploader` component
- Files are uploaded to IPFS using ThirdWeb v5 storage
- Metadata is generated and stored on IPFS
- Returns: `imageUris[]` and `metadataUri`

### 2. Blockchain Registration (Backend)
- Frontend calls `/upload-ipfs` endpoint with IPFS data
- Backend generates deterministic hash for blockchain
- Submits to blockchain for validation
- Returns: `imageHash` and blockchain status

### 3. Database Storage (Backend)
- Artwork data saved to PostgreSQL with all fields:
  - IPFS URIs (`imageUris`, `metadataUri`)
  - Blockchain data (`imageHash`, `validated`, `consensusCount`)
  - Metadata (`title`, `description`, `artist`, `medium`, etc.)

## 🗂️ Database Schema

```sql
model Artwork {
  id                 Int      @id @default(autoincrement())
  imageHash          String   @unique
  title              String
  description        String?
  artist             String
  medium             String?
  year               String?
  dimensions         String?
  additionalInfo     String?
  
  // IPFS storage
  imageUris          String[] // Array of IPFS image URIs
  metadataUri        String?  // IPFS metadata URI
  
  // Blockchain validation
  isOriginal         Boolean  @default(true)
  validated          Boolean  @default(false)
  consensusCount     Int      @default(0)
  requiredValidators Int      @default(2)
  originalAuthor     String?
  
  // Timestamps
  timestamp          DateTime @default(now())
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

## 🖼️ Image Display Integration

### Verification Page (`/app/verification`)
- Fetches artworks from database
- Displays IPFS images using `ipfsToHttp()` helper
- Shows IPFS indicators and metadata links
- Fallback to placeholder if IPFS image fails

### My Art Page (`/app/my-art`)
- Personal artwork collection
- IPFS image gallery view
- Detailed view with all IPFS URIs
- Metadata and blockchain information

### Dashboard Integration
- All components updated to handle IPFS data
- Real-time image loading from IPFS
- Metadata accessibility

## 🔧 API Endpoints

### `/upload-ipfs` (POST)
```javascript
// Request
{
  imageUris: ["ipfs://Qm..."],
  metadataUri: "ipfs://Qm...",
  metadata: {
    name: "Artwork Title",
    description: "Description",
    properties: {
      artist: "Artist Name",
      medium: "Digital Art",
      year: "2024"
    }
  }
}

// Response
{
  success: true,
  artwork: { /* complete artwork object */ },
  imageHash: "0x...",
  message: "Artwork successfully uploaded, validated, and stored"
}
```

### `/artworks` (GET)
Returns all artworks with IPFS data included:
```javascript
[
  {
    id: 1,
    title: "My Artwork",
    imageUris: ["ipfs://Qm..."],
    metadataUri: "ipfs://Qm...",
    imageHash: "0x...",
    validated: true,
    // ... other fields
  }
]
```

## 🎨 Frontend Components

### Updated Components:
- ✅ `ArtworkUploader` - Full IPFS + Blockchain integration
- ✅ `UserArtworkList` - IPFS image display
- ✅ `VerificationPage` - IPFS images in verification queue
- ✅ Progress tracking for both IPFS and blockchain steps

### New Features:
- Real-time progress tracking (0-70% IPFS, 70-100% Blockchain)
- IPFS indicators on images
- Direct links to IPFS metadata
- Error handling and fallbacks
- Multiple image support

## 🔗 IPFS Integration Details

### Storage Format:
```json
{
  "name": "Artwork Title",
  "description": "Artwork description",
  "image": "ipfs://QmPrimaryImage...",
  "attributes": [
    { "trait_type": "Artist", "value": "Artist Name" },
    { "trait_type": "Medium", "value": "Digital Art" },
    { "trait_type": "Year", "value": "2024" }
  ],
  "properties": {
    "artist": "Artist Name",
    "medium": "Digital Art",
    "year": "2024",
    "dimensions": "1920x1080",
    "additionalInfo": "Additional info"
  }
}
```

### Helper Functions:
```javascript
// Convert IPFS URI to HTTP URL
ipfsToHttp("ipfs://Qm...") // → "https://ipfs.io/ipfs/Qm..."

// Upload single file
await IPFSStorage.uploadFile(file)

// Upload complete artwork with metadata
await IPFSStorage.uploadArtwork(files, artworkData)
```

## ⛓️ Blockchain Integration

### Hash Generation:
```javascript
// Creates deterministic hash from IPFS URI + metadata
function generateHashFromIPFS(imageUri, metadata) {
  const combined = JSON.stringify({
    image: imageUri,
    title: metadata.title,
    artist: metadata.artist,
    timestamp: Date.now()
  });
  return ethers.keccak256(ethers.toUtf8Bytes(combined));
}
```

### Validation Flow:
1. Generate hash from IPFS data
2. Submit to blockchain contract
3. Validate with VLM (simulated)
4. Update consensus tracking
5. Store validation results

## 🔍 Verification Queue

### Features:
- Grid view with IPFS images
- IPFS indicators and metadata links
- Search and filter by medium
- Validation status tracking
- Direct access to IPFS files

### Validation Process:
1. Click "Review" on artwork
2. View full artwork details with IPFS images
3. Submit validation decision
4. Updates blockchain and database
5. Real-time status updates

## 📱 User Experience

### Upload Process:
1. Select images → Upload to IPFS (0-70%)
2. Fill metadata → Generate IPFS metadata
3. Submit → Register on blockchain (70-100%)
4. Success → View in verification queue & my art

### Viewing Experience:
- High-quality IPFS images
- Multiple image support
- Metadata accessibility
- Blockchain proof
- Fallback handling

## 🚀 Next Steps

To complete the setup:

1. **Run Database Migration:**
   ```bash
   cd artchain && npx prisma db push
   ```

2. **Start Backend:**
   ```bash
   cd artchain-contracts/src_be && node server.js
   ```

3. **Start Frontend:**
   ```bash
   cd artchain && npm run dev
   ```

4. **Test Upload:**
   - Go to `/app/upload`
   - Upload artwork with images
   - Watch full IPFS + Blockchain + Database flow

## 🔧 Configuration

### Environment Variables:
```env
# Frontend (.env.local)
NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_thirdweb_client_id

# Backend (.env)
DATABASE_URL=your_postgresql_url
```

### ThirdWeb Setup:
- Client configured in `src/app/client.ts`
- IPFS storage via ThirdWeb v5
- Automatic metadata standards

## 📊 Monitoring

### Success Indicators:
- ✅ Images uploaded to IPFS
- ✅ Metadata generated and stored
- ✅ Blockchain hash created
- ✅ Database record saved
- ✅ Images display in verification queue
- ✅ Images display in user's collection

### Error Handling:
- IPFS upload failures → Retry mechanism
- Blockchain submission failures → User notification
- Image loading failures → Placeholder fallback
- Network issues → Error states with retry

## 🎯 Key Benefits

1. **Permanent Storage:** Images stored on IPFS (decentralized)
2. **Provenance:** Blockchain registration for authenticity
3. **Rich Metadata:** Complete artwork information
4. **User Experience:** Seamless upload and viewing
5. **Scalability:** Handles multiple images per artwork
6. **Reliability:** Fallback mechanisms and error handling

Your ArtChain platform now provides a complete Web3 art registration system with permanent IPFS storage, blockchain verification, and rich user interfaces! 🎨⛓️ 