import express from 'express';
import { generateImage } from './imageGenerator';
import { createNFTMetadata } from './nftMetadata';
import { uploadMetadata } from './nftMinter';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/generate-nft', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    
    const { prompt, name, description, owner } = req.body;

    console.log('Generating image...');
    const imageUrl = await generateImage(prompt);
    console.log('Image generated:', imageUrl);

    console.log('Creating metadata...');
    const metadata = createNFTMetadata(name, description, imageUrl, owner);
    console.log('Metadata created:', metadata);

    console.log('Uploading metadata to IPFS...');
    const metadataUri = await uploadMetadata(metadata);
    console.log('Metadata uploaded to IPFS:', metadataUri);

    res.json({ success: true, metadataUri, imageUrl });
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ success: false, error: 'Failed to generate NFT', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});