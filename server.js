const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// In /upload endpoint, after building 'result':
app.post('/upload', upload.single('image'), async (req, res) => {
  const { artist, title } = req.body;
  const imageBuffer = req.file.buffer;

  // 1. Simulate embedding image to blockchain
  const blockchainResult = embedImageToBlockchain(imageBuffer);

  // 2. Simulate sharing hash to nodes (skipped, just log)
  console.log('Sharing hash to nodes:', blockchainResult.imageHash);

  // 3. Simulate validators decoding hash and VLM validation
  const validationResult = validateWithVLM(imageBuffer);

  // 4. Simulate consensus
  const consensus = reachConsensus(validationResult);

  // 5. Build result
  const result = {
    imageHash: blockchainResult.imageHash,
    artist,
    isDuplicate: validationResult === 'duplicate',
    consensus,
    metadata: {
      title,
      timestamp: new Date().toISOString(),
    },
  };

  // Save to database
  try {
    await prisma.artwork.create({
      data: {
        imageHash: result.imageHash,
        artist: result.artist,
        isDuplicate: result.isDuplicate,
        consensus: result.consensus,
        title: result.metadata.title,
        metadata: result.metadata,
      }
    });
  } catch (err) {
    console.error('Error saving artwork to database:', err);
    return res.status(500).json({ error: 'Failed to save artwork to database.' });
  }

  res.json(result);
});

// Endpoint to fetch all artworks
app.get('/artworks', async (req, res) => {
    try {
      const artworks = await prisma.artwork.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(artworks);
    } catch (err) {
      console.error('Error fetching artworks:', err);
      res.status(500).json({ error: 'Failed to fetch artworks.' });
    }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Simulated ArtChain backend listening at http://localhost:${port}`);
}); 